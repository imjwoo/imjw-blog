"use client";

import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_ANALYTICS_API_BASE ?? "/api/analytics").replace(/\/$/, "");
const ANALYTICS_UPDATED_EVENT = "imjw:analytics-updated";

type AnalyticsStats = {
  today: number;
  postViews?: number;
  posts?: Record<string, number>;
};

function blogSlugFromPathname(pathname: string) {
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

async function fetchStats(query = "") {
  const response = await fetch(`${API_BASE}/stats${query}`, {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }

  return (await response.json()) as AnalyticsStats;
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const controller = new AbortController();
    const slug = blogSlugFromPathname(pathname);

    void fetch(`${API_BASE}/visit`, {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(slug ? { slug } : {}),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const detail = (await response.json()) as AnalyticsStats;
        window.dispatchEvent(new CustomEvent(ANALYTICS_UPDATED_EVENT, { detail }));
      })
      .catch(() => {
        // 통계 서비스가 잠시 실패해도 페이지 이용에는 영향을 주지 않는다.
      });

    return () => controller.abort();
  }, [pathname]);

  return null;
}

export function TodayVisitors() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      void fetchStats()
        .then((stats) => {
          if (active) setToday(stats.today);
        })
        .catch(() => {
          // 숫자를 읽지 못한 경우 자리만 유지한다.
        });
    };

    const handleUpdate = (event: Event) => {
      const stats = (event as CustomEvent<AnalyticsStats>).detail;
      if (typeof stats?.today === "number") setToday(stats.today);
    };

    load();
    window.addEventListener(ANALYTICS_UPDATED_EVENT, handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(ANALYTICS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return (
    <p className="text-xs text-muted-foreground" aria-label="오늘 방문자 수">
      Today <span className="font-semibold tabular-nums text-foreground">{today ?? "—"}</span>
    </p>
  );
}

export function PostViewCount({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      void fetchStats(`?slug=${encodeURIComponent(slug)}`)
        .then((stats) => {
          if (active && typeof stats.postViews === "number") setViews(stats.postViews);
        })
        .catch(() => {
          // 통계 장애가 본문 렌더링을 막지 않도록 조용히 실패한다.
        });
    };

    const handleUpdate = (event: Event) => {
      const stats = (event as CustomEvent<AnalyticsStats>).detail;
      if (typeof stats?.postViews === "number") setViews(stats.postViews);
    };

    load();
    window.addEventListener(ANALYTICS_UPDATED_EVENT, handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(ANALYTICS_UPDATED_EVENT, handleUpdate);
    };
  }, [slug]);

  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={views === null ? "조회수 불러오는 중" : `조회수 ${views}`}
    >
      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="tabular-nums">{views ?? "—"}</span>
    </span>
  );
}

export function usePostViewCounts(slugs: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const slugKey = useMemo(() => [...new Set(slugs)].sort().join(","), [slugs]);

  const load = useCallback(() => {
    if (!slugKey) return;

    void fetchStats(`?slugs=${encodeURIComponent(slugKey)}`)
      .then((stats) => setCounts(stats.posts ?? {}))
      .catch(() => {
        // 목록은 조회수 API가 실패해도 그대로 사용할 수 있다.
      });
  }, [slugKey]);

  useEffect(() => {
    load();
    window.addEventListener(ANALYTICS_UPDATED_EVENT, load);
    return () => window.removeEventListener(ANALYTICS_UPDATED_EVENT, load);
  }, [load]);

  return counts;
}
