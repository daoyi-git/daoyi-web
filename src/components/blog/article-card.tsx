import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
import type { UnifiedArticle } from "@/src/lib/articles";

interface ArticleCardProps {
  article: UnifiedArticle;
  /** featured：橫向大卡，圖左文右，整列寬 */
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const href = `/blog/${article.slug}`;

  if (featured) {
    return (
      <Link
        href={href}
        className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition hover:shadow-warm-lg md:grid-cols-2"
      >
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-secondary" />
          )}
        </div>
        <div className="flex flex-col justify-center gap-3 p-7 md:p-9">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary" className="rounded-full">
              {article.category}
            </Badge>
            <time>{article.date}</time>
          </div>
          <h2 className="font-serif text-2xl font-bold leading-snug text-foreground transition group-hover:text-primary">
            {article.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition hover:shadow-warm-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-secondary" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <Badge variant="secondary" className="rounded-full">
            {article.category}
          </Badge>
          <time>{article.date}</time>
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug text-foreground transition group-hover:text-primary">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
