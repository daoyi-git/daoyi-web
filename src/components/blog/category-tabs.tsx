"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  active: string;
}

const ALL = "全部";

export function CategoryTabs({ categories, active }: CategoryTabsProps) {
  const tabs = [ALL, ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="文章分類">
      {tabs.map((cat) => {
        const isActive = cat === active || (cat === ALL && active === ALL);
        const href = cat === ALL ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
        return (
          <Link
            key={cat}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-primary text-primary-foreground shadow-warm"
                : "border border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
