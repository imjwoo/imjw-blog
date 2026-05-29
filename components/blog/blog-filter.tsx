"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { categories, posts } from "@/data/site";
import { cn, formatDate } from "@/lib/utils";

export function BlogFilter() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const categoryMatched = activeCategory === "All" || post.category === activeCategory;
      const queryMatched =
        query.trim().length === 0 ||
        `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      return categoryMatched && queryMatched;
    });
  }, [activeCategory, query]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={cn(
                "border-b border-transparent pb-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                activeCategory === category && "border-foreground font-semibold text-foreground",
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-72">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="border-0 border-b px-0 focus-visible:ring-0"
            placeholder="Search posts"
          />
        </div>
      </div>

      <div>
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="grid gap-4 border-b py-8 transition-colors hover:text-primary md:grid-cols-[180px_1fr]"
          >
            <div className="text-xs leading-6 text-muted-foreground">
              <p>{formatDate(post.date)}</p>
              <p>{post.category}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">{post.tags.join(" / ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
