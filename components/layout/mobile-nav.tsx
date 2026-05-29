"use client";

import Link from "next/link";
import { Menu, Terminal, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/data/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 font-semibold" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md border text-primary">
            <Terminal className="h-4 w-4" />
          </span>
          Cloud Portfolio
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t px-4 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
