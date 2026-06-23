"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/src/components/blog/article-card";
import { CategoryTabs } from "@/src/components/blog/category-tabs";
import type { UnifiedArticle } from "@/src/lib/articles";

interface BlogIndexProps {
  articles: UnifiedArticle[];
  categories: string[];
}

const ALL = "全部";

export function BlogIndex({ articles, categories }: BlogIndexProps) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? ALL;

  const filtered = useMemo(
    () =>
      active === ALL
        ? articles
        : articles.filter((article) => article.category === active),
    [active, articles],
  );
  const [featured, ...rest] = filtered;

  return (
    <>
      <div className="mb-10">
        <CategoryTabs categories={categories} active={active} />
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          此分類目前尚無文章。
        </p>
      ) : (
        <div className="space-y-8">
          {featured && <ArticleCard article={featured} featured />}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
