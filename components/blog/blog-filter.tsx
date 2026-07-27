"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { blogCategoryGroups, posts } from "@/data/site";
import { cn, formatDate } from "@/lib/utils";

export function BlogFilter() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All" || activeSubcategory === null) {
      return posts;
    }

    return posts.filter((post) => {
      return post.category === activeCategory && post.subcategory === activeSubcategory;
    });
  }, [activeCategory, activeSubcategory]);

  const handleAllChange = () => {
    setActiveCategory("All");
    setActiveSubcategory(null);
  };

  const handleSubcategoryChange = (category: string, subcategory: string) => {
    setActiveCategory(category);
    setExpandedCategory(category);
    setActiveSubcategory(subcategory);
  };

  const postCountByCategory = (category: string) => posts.filter((post) => post.category === category).length;
  const postCountBySubcategory = (category: string, subcategory: string) =>
    posts.filter((post) => post.category === category && post.subcategory === subcategory).length;

  return (
    <div className="grid gap-10 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start">
      <aside className="lg:sticky lg:top-24" aria-label="Blog categories">
        <p className="mb-5 text-sm font-semibold">Category</p>
        <div className="grid gap-4">
          <button
            type="button"
            className={cn(
              "text-left text-sm text-muted-foreground transition-colors hover:text-foreground",
              activeCategory === "All" && activeSubcategory === null && "font-semibold text-[#ea580c]",
            )}
            onClick={handleAllChange}
          >
            All ({posts.length})
          </button>

          {blogCategoryGroups.map((group) => {
            const isExpanded = expandedCategory === group.label;

            return (
              <div key={group.label} className="grid gap-3">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between text-left text-sm text-muted-foreground transition-colors hover:text-foreground",
                    activeCategory === group.label && activeSubcategory === null && "font-semibold text-[#ea580c]",
                  )}
                  aria-expanded={isExpanded}
                  onClick={() => {
                    if (isExpanded && activeCategory === group.label && activeSubcategory === null) {
                      setActiveCategory("All");
                      setActiveSubcategory(null);
                      setExpandedCategory(null);
                      return;
                    }

                    setActiveCategory(group.label);
                    setActiveSubcategory(null);
                    setExpandedCategory(group.label);
                  }}
                >
                  <span>
                    {group.label} ({postCountByCategory(group.label)})
                  </span>
                  <span className="text-xs text-muted-foreground">{isExpanded ? "-" : "+"}</span>
                </button>

                {isExpanded ? (
                  <div className="grid gap-3 pl-5">
                    {group.items.map((subcategory) => (
                      <button
                        key={subcategory}
                        type="button"
                        className={cn(
                          "text-left text-sm text-muted-foreground transition-colors hover:text-foreground",
                          activeSubcategory === subcategory && "font-semibold text-[#ea580c]",
                        )}
                        onClick={() => handleSubcategoryChange(group.label, subcategory)}
                      >
                        {subcategory} ({postCountBySubcategory(group.label, subcategory)})
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </aside>

      <div>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="grid gap-4 border-b border-border/70 py-7 transition-colors hover:text-foreground md:grid-cols-[160px_1fr]"
            >
              <div className="text-xs leading-6 text-muted-foreground">
                <p>{formatDate(post.date)}</p>
                <p className="font-medium text-[#ea580c]">
                  {post.category}
                  {post.subcategory ? ` / ${post.subcategory}` : ""}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{post.tags.join(" / ")}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="border-b border-border/70 py-10 text-sm text-muted-foreground">아직 작성된 글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
