import type { BlogCategoryGroup, BlogPost } from "./site";

export const notionPosts: BlogPost[] = [
  {
    "slug": "test-post",
    "title": "테스트 글",
    "excerpt": "연동 테스트용",
    "date": "2026-07-27",
    "category": "CS",
    "subcategory": "Network",
    "tags": [
      "OSI",
      "Router"
    ],
    "toc": [],
    "content": [
      {
        "type": "paragraph",
        "text": "연동 테스트중입니다!"
      }
    ]
  }
];

export const notionCategoryGroups: BlogCategoryGroup[] = [
  {
    "label": "CS",
    "items": [
      "Network"
    ]
  }
];
