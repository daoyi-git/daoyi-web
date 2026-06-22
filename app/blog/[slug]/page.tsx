import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAllArticles, getArticleBySlug } from "@/src/lib/articles";
import { Badge } from "@/src/components/ui/badge";
import { PhotoGallery } from "@/src/components/blog/photo-gallery";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "找不到文章" };
  return {
    title: article.title,
    description: article.excerpt.slice(0, 120),
    openGraph: {
      title: article.title,
      description: article.excerpt.slice(0, 120),
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const heroImage = article.images[0] ?? article.coverImage;
  const galleryImages = article.images.length > 1 ? article.images.slice(1) : [];

  return (
    <main className="pb-8">
      {/* Hero 首圖 */}
      {heroImage && (
        <div className="relative h-[36vh] min-h-64 w-full overflow-hidden bg-secondary md:h-[48vh]">
          <Image
            src={heroImage}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
        </div>
      )}

      <article className="container mx-auto max-w-3xl px-4">
        <div className={heroImage ? "-mt-16 relative" : "pt-12"}>
          <Link
            href="/blog"
            className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            返回班會報導
          </Link>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-warm md:p-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="rounded-full">
                {article.category}
              </Badge>
              <time>{article.date}</time>
              <span>{article.authorName}</span>
            </div>

            <h1 className="mt-4 font-serif text-2xl font-bold leading-snug text-foreground md:text-3xl">
              {article.title}
            </h1>

            {article.body ? (
              <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
                {article.body}
              </div>
            ) : (
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-foreground/90">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>

        {galleryImages.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              活動照片
            </h2>
            <PhotoGallery images={galleryImages} title={article.title} />
          </section>
        )}
      </article>
    </main>
  );
}
