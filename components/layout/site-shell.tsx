"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TopHeader } from "./top-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wideContent =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/architecture");

  return (
    <>
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
    </>
  );
}
