import assert from "node:assert/strict";
import test from "node:test";
import worker, { getKstDay, isAutomatedRequest, isValidSlug, parseCookie } from "./index.js";

class MemoryStatement {
  constructor(database, sql, args = []) {
    this.database = database;
    this.sql = sql;
    this.args = args;
  }

  bind(...args) {
    return new MemoryStatement(this.database, this.sql, args);
  }
}

class MemoryDatabase {
  constructor() {
    this.visitors = new Set();
    this.postViews = new Set();
  }

  prepare(sql) {
    return new MemoryStatement(this, sql);
  }

  async batch(statements) {
    return statements.map((statement) => {
      if (statement.sql.startsWith("INSERT OR IGNORE INTO daily_visitors")) {
        this.visitors.add(statement.args.join(":"));
        return { results: [] };
      }
      if (statement.sql.startsWith("INSERT OR IGNORE INTO post_daily_views")) {
        this.postViews.add(statement.args.join(":"));
        return { results: [] };
      }
      if (statement.sql.includes("FROM daily_visitors")) {
        const [day] = statement.args;
        return { results: [{ count: [...this.visitors].filter((key) => key.startsWith(`${day}:`)).length }] };
      }
      if (statement.sql.includes("GROUP BY slug")) {
        const requested = new Set(statement.args);
        const counts = {};
        for (const key of this.postViews) {
          const [, slug] = key.split(":");
          if (requested.has(slug)) counts[slug] = (counts[slug] ?? 0) + 1;
        }
        return { results: Object.entries(counts).map(([slug, count]) => ({ slug, count })) };
      }
      if (statement.sql.includes("FROM post_daily_views")) {
        const [slug] = statement.args;
        return { results: [{ count: [...this.postViews].filter((key) => key.split(":")[1] === slug).length }] };
      }
      throw new Error(`Unexpected SQL: ${statement.sql}`);
    });
  }
}

test("KST 날짜를 기준으로 집계한다", () => {
  assert.equal(getKstDay(new Date("2026-09-08T15:30:00.000Z")), "2026-09-09");
});

test("쿠키에서 방문자 식별자를 읽는다", () => {
  assert.equal(parseCookie("theme=dark; imjw_visitor=abc-123; mode=compact", "imjw_visitor"), "abc-123");
  assert.equal(parseCookie(null, "imjw_visitor"), undefined);
});

test("게시글 slug 형식을 제한한다", () => {
  assert.equal(isValidSlug("container-orchestration-basics"), true);
  assert.equal(isValidSlug("Container Basics"), false);
  assert.equal(isValidSlug("../secret"), false);
});

test("검색 봇과 미리보기 요청을 제외한다", () => {
  const botRequest = new Request("https://imjwoo.com/api/analytics/visit", {
    headers: { "user-agent": "Googlebot/2.1" },
  });
  const userRequest = new Request("https://imjwoo.com/api/analytics/visit", {
    headers: { "user-agent": "Mozilla/5.0" },
  });

  assert.equal(isAutomatedRequest(botRequest), true);
  assert.equal(isAutomatedRequest(userRequest), false);
});

test("같은 브라우저의 Today와 게시글 조회수를 하루 한 번만 집계한다", async () => {
  const env = {
    DB: new MemoryDatabase(),
    ANALYTICS_HASH_SECRET: "test-secret-with-enough-entropy",
    ALLOWED_ORIGINS: "https://imjwoo.com",
  };
  const requestInit = {
    method: "POST",
    headers: { origin: "https://imjwoo.com", "content-type": "application/json", "user-agent": "Mozilla/5.0" },
    body: JSON.stringify({ slug: "container-orchestration-basics" }),
  };

  const first = await worker.fetch(new Request("https://imjwoo.com/api/analytics/visit", requestInit), env);
  const firstBody = await first.json();
  const visitorCookie = first.headers.get("set-cookie").split(";", 1)[0];
  assert.deepEqual({ today: firstBody.today, postViews: firstBody.postViews }, { today: 1, postViews: 1 });

  const second = await worker.fetch(
    new Request("https://imjwoo.com/api/analytics/visit", {
      ...requestInit,
      headers: { ...requestInit.headers, cookie: visitorCookie },
    }),
    env,
  );
  const secondBody = await second.json();
  assert.deepEqual({ today: secondBody.today, postViews: secondBody.postViews }, { today: 1, postViews: 1 });
});
