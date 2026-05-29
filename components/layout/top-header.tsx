"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const headerItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Projects", href: "/projects" },
  { title: "Blog", href: "/blog" },
];

export function TopHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 shadow-[0_6px_18px_rgba(28,25,23,0.04)] backdrop-blur dark:shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex h-11 w-full max-w-[960px] items-center justify-between px-4 sm:h-12 sm:px-8">
        <Link href="/" className="text-[26px] font-black italic leading-none tracking-tight sm:text-[28px]">
          IMJW
        </Link>
        <nav className="flex items-center gap-4 sm:gap-5">
          {headerItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[16px] font-normal leading-none text-foreground transition-colors hover:text-foreground sm:text-[18px]",
                  active && "font-extrabold",
                )}
              >
                {item.title}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
