"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:text-muted-foreground"
      aria-label="Toggle theme"
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
