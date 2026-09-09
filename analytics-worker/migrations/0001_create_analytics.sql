CREATE TABLE IF NOT EXISTS daily_visitors (
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, visitor_hash)
);

CREATE TABLE IF NOT EXISTS post_daily_views (
  day TEXT NOT NULL,
  slug TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, slug, visitor_hash)
);

CREATE INDEX IF NOT EXISTS idx_post_daily_views_slug ON post_daily_views (slug);
