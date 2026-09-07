import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  convertNotionCodeBlock,
  diagramFileName,
  isD2DiagramCaption,
  resetGeneratedBlogImages,
  resolveDiagramOutput,
  validateLocalIconReferences,
} from "./d2-diagrams.mjs";

test("preserves an ordinary Notion code block", async () => {
  assert.deepEqual(
    await convertNotionCodeBlock({
      code: "console.log('hello')",
      caption: "example",
      language: "javascript",
      slug: "sample-post",
      postTitle: "샘플 글",
      blockIndex: 0,
    }),
    { type: "code", code: "console.log('hello')", language: "javascript" },
  );
});

test("matches only the normalized diagram:d2 caption", () => {
  assert.equal(isD2DiagramCaption(" diagram:d2 "), true);
  assert.equal(isD2DiagramCaption("DIAGRAM:D2"), true);
  assert.equal(isD2DiagramCaption("diagram:d2 preview"), false);
  assert.equal(isD2DiagramCaption("d2"), false);
});

test("uses deterministic, distinct names based on the Notion block index", () => {
  assert.equal(diagramFileName(0), "diagram-001.svg");
  assert.equal(diagramFileName(8), "diagram-009.svg");
  assert.notEqual(diagramFileName(2), diagramFileName(3));
});

test("rejects unsafe slugs before resolving an output path", () => {
  assert.throws(
    () => resolveDiagramOutput("/tmp/blog-images", "../outside", 0),
    /Unsafe blog slug/,
  );
});

test("accepts existing local SVG icons and rejects traversal or remote icons", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "d2-icons-"));
  await mkdir(path.join(root, "icons"));
  await writeFile(path.join(root, "icons", "ok.svg"), "<svg></svg>");

  try {
    assert.deepEqual(
      await validateLocalIconReferences("icon: ./icons/ok.svg", root),
      ["./icons/ok.svg"],
    );
    assert.deepEqual(
      await validateLocalIconReferences("icon: {\n  shape: image\n}", root),
      [],
    );
    await assert.rejects(
      validateLocalIconReferences("icon: ../../secret.svg", root),
      /escapes its allowed directory/,
    );
    await assert.rejects(
      validateLocalIconReferences("icon: https://example.com/icon.svg", root),
      /Remote D2 icons are not allowed/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("removes stale generated blog images", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "d2-stale-"));
  await mkdir(path.join(root, "old-post"));
  await writeFile(path.join(root, "old-post", "diagram.svg"), "stale");

  try {
    await resetGeneratedBlogImages(root);
    await assert.rejects(readFile(path.join(root, "old-post", "diagram.svg")));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renders SVG and reports malformed D2 with post context", async (t) => {
  const d2Bin = process.env.D2_BIN;
  if (!d2Bin) {
    t.skip("D2_BIN is not configured");
    return;
  }

  const root = await mkdtemp(path.join(os.tmpdir(), "d2-render-"));
  const iconDirectory = path.join(root, "public", "images", "diagram-icons", "icons");
  await mkdir(iconDirectory, { recursive: true });
  await writeFile(
    path.join(iconDirectory, "test.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>',
  );

  try {
    const block = await convertNotionCodeBlock({
      code: 'symbol: "" {\n  shape: image\n  icon: ./icons/test.svg\n  width: 32\n  height: 32\n}\nsymbol -> b',
      caption: "diagram:d2",
      language: "plain text",
      slug: "sample-post",
      postTitle: "샘플 글",
      blockIndex: 4,
      rootDir: root,
      d2Bin,
    });
    assert.deepEqual(block, {
      type: "diagram",
      src: "/images/blog/sample-post/diagram-005.svg",
      alt: "샘플 글 다이어그램 5",
    });
    assert.match(
      await readFile(path.join(root, "public", "images", "blog", "sample-post", "diagram-005.svg"), "utf8"),
      /<svg/,
    );

    await assert.rejects(
      convertNotionCodeBlock({
        code: "a: {",
        caption: "diagram:d2",
        language: "plain text",
        slug: "sample-post",
        postTitle: "샘플 글",
        blockIndex: 6,
        rootDir: root,
        d2Bin,
      }),
      /D2 render failed for sample-post block 7/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
