import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;
const notionVersion = "2022-06-28";

if (!notionToken || !databaseId) {
  console.log("Skipping Notion sync: NOTION_TOKEN or NOTION_DATABASE_ID is missing.");
  process.exit(0);
}

const rootDir = process.cwd();
const generatedFile = path.join(rootDir, "data", "notion-posts.ts");
const blogImageRoot = path.join(rootDir, "public", "images", "blog");

async function notionFetch(endpoint, init = {}) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${notionToken}`,
      "Notion-Version": notionVersion,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Notion API error ${response.status}: ${body}`);
  }

  return response.json();
}

function richTextToPlainText(richText = []) {
  return richText.map((item) => item.plain_text ?? "").join("");
}

function titleProperty(properties) {
  const property = properties.Title ?? properties.Name ?? Object.values(properties).find((item) => item.type === "title");
  return richTextToPlainText(property?.title ?? "");
}

function textProperty(properties, name) {
  const property = properties[name];
  if (!property) return "";
  if (property.type === "rich_text") return richTextToPlainText(property.rich_text);
  if (property.type === "url") return property.url ?? "";
  return "";
}

function selectProperty(properties, name) {
  const property = properties[name];
  return property?.select?.name ?? "";
}

function multiSelectProperty(properties, name) {
  const property = properties[name];
  return property?.multi_select?.map((item) => item.name) ?? [];
}

function dateProperty(properties, name, fallback) {
  const property = properties[name];
  return property?.date?.start ?? fallback;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function headingId(value) {
  return slugify(value) || "section";
}

async function queryPublishedPages() {
  const pages = [];
  let cursor;

  do {
    const body = {
      page_size: 100,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Published At",
          direction: "descending",
        },
      ],
      ...(cursor ? { start_cursor: cursor } : {}),
    };

    const data = await notionFetch(`/databases/${databaseId}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages;
}

async function fetchBlockChildren(blockId) {
  const blocks = [];
  let cursor;

  do {
    const data = await notionFetch(
      `/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`,
    );
    blocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

function imageExtension(url, contentType) {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext)) {
    return ext;
  }
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("gif")) return ".gif";
  if (contentType?.includes("svg")) return ".svg";
  return ".jpg";
}

async function downloadImage(url, slug, index) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image ${url}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const ext = imageExtension(url, contentType);
  const imageDir = path.join(blogImageRoot, slug);
  const fileName = `image-${String(index).padStart(2, "0")}${ext}`;
  const filePath = path.join(imageDir, fileName);

  await mkdir(imageDir, { recursive: true });
  const arrayBuffer = await response.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));

  return `/images/blog/${slug}/${fileName}`;
}

async function flushList(blocks, listState) {
  if (!listState.type || listState.items.length === 0) return;
  blocks.push({ type: listState.type, items: [...listState.items] });
  listState.type = null;
  listState.items = [];
}

async function convertBlocksToContent(blocks, slug) {
  const content = [];
  const toc = [];
  const listState = { type: null, items: [] };
  let imageIndex = 1;

  for (const block of blocks) {
    const type = block.type;

    if (type !== "bulleted_list_item" && type !== "numbered_list_item") {
      await flushList(content, listState);
    }

    if (type === "paragraph") {
      const text = richTextToPlainText(block.paragraph.rich_text).trim();
      if (text) content.push({ type: "paragraph", text });
    }

    if (["heading_1", "heading_2", "heading_3"].includes(type)) {
      const text = richTextToPlainText(block[type].rich_text).trim();
      if (text) {
        const level = Number(type.replace("heading_", ""));
        const id = headingId(text);
        toc.push(text);
        content.push({ type: "heading", level, text, id });
      }
    }

    if (type === "quote") {
      const text = richTextToPlainText(block.quote.rich_text).trim();
      if (text) content.push({ type: "quote", text });
    }

    if (type === "callout") {
      const text = richTextToPlainText(block.callout.rich_text).trim();
      if (text) content.push({ type: "quote", text });
    }

    if (type === "code") {
      const code = richTextToPlainText(block.code.rich_text);
      content.push({ type: "code", code, language: block.code.language });
    }

    if (type === "divider") {
      content.push({ type: "divider" });
    }

    if (type === "bulleted_list_item") {
      if (listState.type !== "bulletedList") {
        await flushList(content, listState);
        listState.type = "bulletedList";
      }
      listState.items.push(richTextToPlainText(block.bulleted_list_item.rich_text).trim());
    }

    if (type === "numbered_list_item") {
      if (listState.type !== "numberedList") {
        await flushList(content, listState);
        listState.type = "numberedList";
      }
      listState.items.push(richTextToPlainText(block.numbered_list_item.rich_text).trim());
    }

    if (type === "image") {
      const image = block.image;
      const url = image.type === "external" ? image.external.url : image.file.url;
      const alt = richTextToPlainText(image.caption).trim();
      const src = await downloadImage(url, slug, imageIndex);
      imageIndex += 1;
      content.push({ type: "image", src, alt });
    }
  }

  await flushList(content, listState);

  return { content, toc };
}

async function pageToPost(page) {
  const { properties } = page;
  const title = titleProperty(properties);
  const slug = textProperty(properties, "Slug") || slugify(title);
  const summary = textProperty(properties, "Summary");
  const category = selectProperty(properties, "Category");
  const subcategory = selectProperty(properties, "Subcategory");
  const tags = multiSelectProperty(properties, "Tags");
  const date = dateProperty(properties, "Published At", page.created_time.slice(0, 10));

  if (!title || !slug || !category) {
    throw new Error(`Missing required Notion properties for page ${page.id}`);
  }

  await rm(path.join(blogImageRoot, slug), { recursive: true, force: true });
  const blocks = await fetchBlockChildren(page.id);
  const { content, toc } = await convertBlocksToContent(blocks, slug);

  return {
    slug,
    title,
    excerpt: summary,
    date,
    category,
    subcategory,
    tags,
    toc,
    content,
  };
}

async function main() {
  const pages = await queryPublishedPages();
  const posts = [];

  for (const page of pages) {
    posts.push(await pageToPost(page));
  }

  const source = `import type { BlogPost } from "./site";

export const notionPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;

  await writeFile(generatedFile, source);
  console.log(`Synced ${posts.length} Notion blog post(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
