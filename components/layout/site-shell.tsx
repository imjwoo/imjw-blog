"use client";

import { usePathname } from "next/navigation";
import { AnalyticsProvider } from "@/components/analytics/blog-analytics";
import { cn } from "@/lib/utils";
import { TopHeader } from "./top-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wideContent =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/projects") ||
    pathname === "/blog" ||
    pathname === "/blog/" ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/architecture");

  return (
    <AnalyticsProvider>
      <TopHeader />
      <main className="min-h-screen">
        <div
          className={cn(
            "mx-auto w-full px-6 py-14 sm:px-8 lg:py-20",
            wideContent ? "max-w-[960px]" : "max-w-[760px]",
          )}
        >
          {children}
        </div>
      </main>
    </AnalyticsProvider>
  );
}
