import Link from "next/link";
import { Github, Mail, Terminal } from "lucide-react";
import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-background/95 px-6 py-7 backdrop-blur lg:flex lg:flex-col">
      <Link href="/" className="group block">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border bg-card text-primary">
          <Terminal className="h-5 w-5" />
        </div>
        <div className="mt-5">
          <p className="text-xl font-semibold">임정우</p>
          <p className="mt-1 text-sm text-muted-foreground">Cloud Engineer Portfolio</p>
        </div>
      </Link>

      <nav className="mt-10 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="terminal-surface">
          <div className="flex gap-1 border-b bg-muted px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <div className="space-y-2 p-4 text-xs">
            <p><span className="text-primary">$</span> whoami</p>
            <p className="text-muted-foreground">개발을 이해하는 클라우드 엔지니어</p>
            <p><span className="text-primary">$</span> focus</p>
            <p className="text-muted-foreground">AWS · Terraform · CI/CD · Docker</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t pt-5">
          <div className="flex items-center gap-1">
            <Link className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" href="https://github.com/imjwoo" target="_blank">
              <Github className="h-4 w-4" />
            </Link>
            <Link className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" href="mailto:hello@example.com">
              <Mail className="h-4 w-4" />
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
