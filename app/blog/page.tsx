import type { Metadata } from "next";
import { getAllArticles, getCategories } from "@/src/lib/articles";
import { BlogIndex } from "@/src/components/blog/blog-index";

export const metadata: Metadata = {
  title: "班會報導",
  description: "道一關懷協會的班會報導、經典課程與道務活動紀實。",
};

export default async function BlogPage() {
  const [allArticles, categories] = await Promise.all([
    getAllArticles(),
    getCategories(),
  ]);

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

      <BlogIndex articles={allArticles} categories={categories} />
    </main>
  );
}
