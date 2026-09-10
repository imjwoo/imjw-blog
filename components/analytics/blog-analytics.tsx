"use client";

import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_ANALYTICS_API_BASE ?? "/api/analytics").replace(/\/$/, "");

type AnalyticsStats = {
  today: number;
  postViews?: number;
  posts?: Record<string, number>;
};

type AnalyticsState = {
  status: "loading" | "ready" | "error";
  slug?: string;
  stats: AnalyticsStats | null;
};

const AnalyticsContext = createContext<AnalyticsState>({
  status: "loading",
  stats: null,
});

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

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<AnalyticsState>({ status: "loading", stats: null });

  useEffect(() => {
    const controller = new AbortController();
    const slug = blogSlugFromPathname(pathname);
    setState({ status: "loading", slug, stats: null });

    void fetch(`${API_BASE}/visit`, {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(slug ? { slug } : {}),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Analytics request failed: ${response.status}`);
        return (await response.json()) as AnalyticsStats;
      })
      .then((stats) => setState({ status: "ready", slug, stats }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error", slug, stats: null });
      });

    return () => controller.abort();
  }, [pathname]);

  return <AnalyticsContext.Provider value={state}>{children}</AnalyticsContext.Provider>;
}

export function AnalyticsCountSkeleton({ className = "w-5" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-3 animate-pulse rounded-sm bg-muted align-middle motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}

export function TodayVisitors() {
  const { status, stats } = useContext(AnalyticsContext);

  return (
    <p className="text-xs text-muted-foreground" aria-label="오늘 방문자 수">
      Today{" "}
      <span className="inline-block min-w-5 font-semibold tabular-nums text-foreground">
        {status === "loading" ? <AnalyticsCountSkeleton /> : (stats?.today ?? "—")}
      </span>
    </p>
  );
}

export function PostViewCount({ slug }: { slug: string }) {
  const state = useContext(AnalyticsContext);
  const isLoading = state.status === "loading" || state.slug !== slug;
  const views = state.slug === slug ? state.stats?.postViews : undefined;

  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={isLoading ? "조회수 불러오는 중" : `조회수 ${views ?? "불러오기 실패"}`}
    >
      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="inline-block min-w-5 tabular-nums">
        {isLoading ? <AnalyticsCountSkeleton /> : (views ?? "—")}
      </span>
    </span>
  );
}

export function usePostViewCounts(slugs: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const slugKey = useMemo(() => [...new Set(slugs)].sort().join(","), [slugs]);

  const load = useCallback(() => {
    if (!slugKey) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void fetchStats(`?slugs=${encodeURIComponent(slugKey)}`)
      .then((stats) => setCounts(stats.posts ?? {}))
      .catch(() => setCounts({}))
      .finally(() => setIsLoading(false));
  }, [slugKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { counts, isLoading };
}
