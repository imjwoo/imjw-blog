/**
 * 블로그용 Notion 데이터베이스를 API로 생성합니다.
 *
 * 사용법:
 *   NOTION_TOKEN=ntn_xxx NOTION_PARENT_PAGE_ID=xxx node scripts/create-notion-db.mjs
 *
 * 사전 준비:
 *   1. Notion에 빈 페이지를 하나 만듭니다 (DB가 들어갈 부모 페이지).
 *   2. 그 페이지 우측 상단 ... → Connections 에서 integration 을 연결합니다.
 *   3. 페이지 URL 끝의 32자리 ID 를 NOTION_PARENT_PAGE_ID 로 넘깁니다.
 */

const notionToken = process.env.NOTION_TOKEN;
const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
const notionVersion = "2022-06-28";

if (!notionToken || !parentPageId) {
  console.error("NOTION_TOKEN 과 NOTION_PARENT_PAGE_ID 환경변수가 필요합니다.");
  process.exit(1);
}

// 초기 선택 옵션. Notion 에서 나중에 추가/삭제하면 블로그에 자동 반영됩니다.
const CATEGORIES = ["AI", "CS", "Cloud", "DevOps", "Language"];

const SUBCATEGORIES = [
  "Agent",
  "Algorithm",
  "Architecture",
  "AWS",
  "Azure",
  "Data Structure",
  "Database",
  "Docker",
  "GitHub Actions",
  "Jenkins",
  "MCP",
  "Monitoring",
  "NCP",
  "Network",
  "Operating System",
  "Prompt",
  "Python",
  "RAG",
  "Shell Script",
  "Spring Boot",
];

const STATUSES = [
  { name: "Draft", color: "gray" },
  { name: "Published", color: "green" },
  { name: "Archived", color: "red" },
];

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
    throw new Error(`Notion API error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

const database = await notionFetch("/databases", {
  method: "POST",
  body: JSON.stringify({
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: "Blog Posts" } }],
    properties: {
      Title: { title: {} },
      Slug: { rich_text: {} },
      Category: { select: { options: CATEGORIES.map((name) => ({ name })) } },
      Subcategory: { select: { options: SUBCATEGORIES.map((name) => ({ name })) } },
      Tags: { multi_select: { options: [] } },
      Summary: { rich_text: {} },
      Status: { select: { options: STATUSES } },
      "Publish Date": { date: {} },
    },
  }),
});

const databaseId = database.id.replace(/-/g, "");

console.log("");
console.log("데이터베이스를 만들었습니다.");
console.log("");
console.log(`  이름   : ${database.title?.[0]?.plain_text ?? "Blog Posts"}`);
console.log(`  URL    : ${database.url}`);
console.log(`  DB ID  : ${databaseId}`);
console.log("");
console.log("이 DB ID 를 GitHub Secrets 의 NOTION_DATABASE_ID 에 넣어주세요.");
console.log("");
