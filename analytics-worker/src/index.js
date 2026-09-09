const COOKIE_NAME = "imjw_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BOT_PATTERN = /bot|crawler|spider|slurp|preview|facebookexternalhit|kakaotalk-scrap|discordbot|telegrambot|whatsapp/i;

export function getKstDay(now = new Date()) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function parseCookie(header, name) {
  if (!header) return undefined;

  for (const part of header.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === name) {
      try {
        return decodeURIComponent(valueParts.join("="));
      } catch {
        return undefined;
      }
    }
  }

  return undefined;
}

export function isValidSlug(slug) {
  return typeof slug === "string" && slug.length <= 120 && SLUG_PATTERN.test(slug);
}

export function isAutomatedRequest(request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const purpose = `${request.headers.get("purpose") ?? ""} ${request.headers.get("sec-purpose") ?? ""}`;
  return BOT_PATTERN.test(userAgent) || /prefetch|preview/i.test(purpose);
}

function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS ?? "https://imjwoo.com")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function hasAllowedOrigin(request, env) {
  const origin = request.headers.get("origin");
  return origin !== null && allowedOrigins(env).includes(origin);
}

async function dailyVisitorHash(secret, visitorId, day) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${day}:${visitorId}`));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function readStats(env, day, slug, slugs = []) {
  const statements = [
    env.DB.prepare("SELECT COUNT(*) AS count FROM daily_visitors WHERE day = ?").bind(day),
  ];

  if (slug) {
    statements.push(env.DB.prepare("SELECT COUNT(*) AS count FROM post_daily_views WHERE slug = ?").bind(slug));
  }

  if (slugs.length) {
    const placeholders = slugs.map(() => "?").join(", ");
    statements.push(
      env.DB.prepare(
        `SELECT slug, COUNT(*) AS count FROM post_daily_views WHERE slug IN (${placeholders}) GROUP BY slug`,
      ).bind(...slugs),
    );
  }

  const results = await env.DB.batch(statements);
  const response = { today: Number(results[0].results?.[0]?.count ?? 0) };
  let resultIndex = 1;

  if (slug) {
    response.postViews = Number(results[resultIndex].results?.[0]?.count ?? 0);
    resultIndex += 1;
  }

  if (slugs.length) {
    response.posts = Object.fromEntries(slugs.map((item) => [item, 0]));
    for (const row of results[resultIndex].results ?? []) {
      response.posts[row.slug] = Number(row.count ?? 0);
    }
  }

  return response;
}

async function handleStats(request, env) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? undefined;
  const slugs = (url.searchParams.get("slugs") ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 100);

  if ((slug && !isValidSlug(slug)) || slugs.some((item) => !isValidSlug(item))) {
    return json({ error: "Invalid slug" }, { status: 400 });
  }

  return json(await readStats(env, getKstDay(), slug, [...new Set(slugs)]));
}

async function handleVisit(request, env) {
  if (!env.ANALYTICS_HASH_SECRET) {
    return json({ error: "Analytics secret is not configured" }, { status: 503 });
  }

  if (!hasAllowedOrigin(request, env)) {
    return json({ error: "Origin is not allowed" }, { status: 403 });
  }

  if (isAutomatedRequest(request)) {
    return json({ counted: false, reason: "automated-request" });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1024) {
    return json({ error: "Request body is too large" }, { status: 413 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body?.slug;
  if (slug !== undefined && !isValidSlug(slug)) {
    return json({ error: "Invalid slug" }, { status: 400 });
  }

  const cookieHeader = request.headers.get("cookie");
  let visitorId = parseCookie(cookieHeader, COOKIE_NAME);
  let setCookie;

  if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
    visitorId = crypto.randomUUID();
    setCookie = `${COOKIE_NAME}=${encodeURIComponent(visitorId)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`;
  }

  const day = getKstDay();
  const visitorHash = await dailyVisitorHash(env.ANALYTICS_HASH_SECRET, visitorId, day);
  const writes = [
    env.DB.prepare("INSERT OR IGNORE INTO daily_visitors (day, visitor_hash) VALUES (?, ?)").bind(day, visitorHash),
  ];

  if (slug) {
    writes.push(
      env.DB.prepare("INSERT OR IGNORE INTO post_daily_views (day, slug, visitor_hash) VALUES (?, ?, ?)").bind(
        day,
        slug,
        visitorHash,
      ),
    );
  }

  await env.DB.batch(writes);
  const stats = await readStats(env, day, slug);
  const headers = setCookie ? { "set-cookie": setCookie } : undefined;
  return json({ counted: true, ...stats }, { headers });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, "");

    if (pathname === "/api/analytics/health" && request.method === "GET") {
      return json({ ok: true });
    }

    if (pathname === "/api/analytics/stats" && request.method === "GET") {
      return handleStats(request, env);
    }

    if (pathname === "/api/analytics/visit" && request.method === "POST") {
      return handleVisit(request, env);
    }

    return json({ error: "Not found" }, { status: 404 });
  },
};

export default worker;
