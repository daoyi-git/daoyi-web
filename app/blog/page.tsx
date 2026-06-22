import type { Metadata } from "next";
import { getAllArticles, getCategories } from "@/src/lib/articles";
import { ArticleCard } from "@/src/components/blog/article-card";
import { CategoryTabs } from "@/src/components/blog/category-tabs";

export const metadata: Metadata = {
  title: "班會報導",
  description: "道一關懷協會的班會報導、經典課程與道務活動紀實。",
};

const ALL = "全部";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category ?? ALL;

  const [allArticles, categories] = await Promise.all([
    getAllArticles(),
    getCategories(),
  ]);

  const filtered =
    active === ALL
      ? allArticles
      : allArticles.filter((a) => a.category === active);

  const [featured, ...rest] = filtered;

  return (
    <main className="container mx-auto px-4 py-14 md:py-20">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          道務紀實
        </p>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          班會報導
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          記錄協會班會、經典課程與道務活動的點滴，與道親分享修辦路上的法喜。
        </p>
      </header>

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
    </main>
  );
}
