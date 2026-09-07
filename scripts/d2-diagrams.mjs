import { execFile } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const D2_CAPTION_MARKER = "diagram:d2";

const SAFE_SLUG_PATTERN = /^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/u;
const ICON_PATTERN = /^\s*icon\s*:\s*(?:"([^"]+)"|'([^']+)'|([^\s#{}]+))\s*(?:#.*)?$/gm;

export function normalizeDiagramCaption(value = "") {
  return value.normalize("NFKC").trim().toLowerCase();
}

export function isD2DiagramCaption(value = "") {
  return normalizeDiagramCaption(value) === D2_CAPTION_MARKER;
}

export function assertSafeSlug(slug) {
  if (!SAFE_SLUG_PATTERN.test(slug)) {
    throw new Error(`Unsafe blog slug: ${JSON.stringify(slug)}`);
  }
}

function assertPathWithin(root, target, label) {
  const relative = path.relative(root, target);
  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) return;
  throw new Error(`${label} escapes its allowed directory: ${target}`);
}

export function diagramFileName(blockIndex) {
  if (!Number.isInteger(blockIndex) || blockIndex < 0) {
    throw new Error(`Invalid Notion block index: ${blockIndex}`);
  }
  return `diagram-${String(blockIndex + 1).padStart(3, "0")}.svg`;
}

export function resolveDiagramOutput(blogImageRoot, slug, blockIndex) {
  assertSafeSlug(slug);
  const root = path.resolve(blogImageRoot);
  const directory = path.resolve(root, slug);
  const filePath = path.resolve(directory, diagramFileName(blockIndex));
  assertPathWithin(root, directory, "Diagram directory");
  assertPathWithin(directory, filePath, "Diagram output");
  return { directory, filePath };
}

export async function validateLocalIconReferences(source, assetRoot) {
  const root = path.resolve(assetRoot);
  const references = [...source.matchAll(ICON_PATTERN)].map((match) => match[1] ?? match[2] ?? match[3]);

  for (const reference of references) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(reference) || reference.startsWith("//")) {
      throw new Error(`Remote D2 icons are not allowed: ${reference}`);
    }

    const filePath = path.resolve(root, reference);
    assertPathWithin(root, filePath, "D2 icon");

    if (!filePath.toLowerCase().endsWith(".svg")) {
      throw new Error(`D2 icons must be local SVG files: ${reference}`);
    }

    try {
      await access(filePath);
    } catch {
      throw new Error(`D2 icon does not exist under the allowed asset root: ${reference}`);
    }
  }

  return references;
}

export async function resetGeneratedBlogImages(blogImageRoot) {
  const root = path.resolve(blogImageRoot);
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });
}

export async function renderD2Diagram({
  source,
  slug,
  postTitle,
  blockIndex,
  rootDir = process.cwd(),
  d2Bin = process.env.D2_BIN || "d2",
}) {
  if (!source.trim()) {
    throw new Error(`D2 render failed for ${slug} block ${blockIndex + 1}: source is empty`);
  }
  if (Buffer.byteLength(source, "utf8") > 200_000) {
    throw new Error(`D2 render failed for ${slug} block ${blockIndex + 1}: source exceeds 200 KB`);
  }

  const assetRoot = path.resolve(rootDir, "public", "images", "diagram-icons");
  const blogImageRoot = path.resolve(rootDir, "public", "images", "blog");
  const { directory, filePath } = resolveDiagramOutput(blogImageRoot, slug, blockIndex);
  const temporarySource = path.resolve(assetRoot, `.render-${slug}-${blockIndex + 1}.d2`);

  assertPathWithin(assetRoot, temporarySource, "Temporary D2 source");
  await validateLocalIconReferences(source, assetRoot);
  await mkdir(assetRoot, { recursive: true });
  await mkdir(directory, { recursive: true });
  await writeFile(temporarySource, source, "utf8");

  try {
    await execFileAsync(
      d2Bin,
      ["--layout=dagre", "--pad=32", temporarySource, filePath],
      { timeout: 30_000, maxBuffer: 10 * 1024 * 1024 },
    );

    const svg = await readFile(filePath, "utf8");
    if (!svg.includes("<svg")) {
      throw new Error("renderer did not produce an SVG document");
    }
  } catch (error) {
    await rm(filePath, { force: true });
    const detail = error?.stderr?.trim() || error?.message || String(error);
    throw new Error(`D2 render failed for ${slug} block ${blockIndex + 1}: ${detail}`);
  } finally {
    await rm(temporarySource, { force: true });
  }

  const fileName = path.basename(filePath);
  return {
    type: "diagram",
    src: `/images/blog/${slug}/${fileName}`,
    alt: `${postTitle} 다이어그램 ${blockIndex + 1}`,
  };
}

export async function convertNotionCodeBlock({
  code,
  caption,
  language,
  slug,
  postTitle,
  blockIndex,
  rootDir,
  d2Bin,
}) {
  if (!isD2DiagramCaption(caption)) {
    return { type: "code", code, language };
  }

  return renderD2Diagram({
    source: code,
    slug,
    postTitle,
    blockIndex,
    rootDir,
    d2Bin,
  });
}
