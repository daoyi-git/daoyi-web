import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Facebook } from "lucide-react";
import { Suspense } from "react";
import { getAllArticles, getRandomActivityPhotos } from "@/src/lib/articles";
import { ArticleCard } from "@/src/components/blog/article-card";
import { PhotoCarousel } from "@/src/components/home/photo-carousel";
import { VideoSection, VideoSectionSkeleton } from "@/src/components/home/video-section";
import { FeatureSections } from "@/src/components/home/feature-sections";
import { siteConfig } from "@/src/config/site";

export default async function HomePage() {
  const [articles, photos] = await Promise.all([
    getAllArticles(),
    getRandomActivityPhotos(),
  ]);
  const recent = articles.slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* 背景大圖（佛堂）+ 暖色漸層遮罩 */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/top1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-4 pt-20 md:pt-28">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-widest text-primary">
              社團法人新北市道一關懷協會
            </p>
            <h1 className="mb-5 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              以關懷之心，
              <br />
              行修道之路
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-foreground/80">
              道一關懷協會致力於道務推廣與公益關懷，分享班會報導、經典課程與道務活動的點滴紀實。
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={siteConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-warm transition hover:opacity-90"
              >
                <Facebook className="size-5" aria-hidden="true" />
                道一關懷協會　歡迎加入
              </a>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 font-medium text-foreground backdrop-blur-sm transition hover:bg-secondary"
              >
                <CalendarDays className="size-5 text-primary" aria-hidden="true" />
                查看行事曆
              </Link>
            </div>
          </div>

          {/* 隨機活動照片輪播 */}
          <div className="mt-12 md:mt-16">
            <PhotoCarousel photos={photos} />
          </div>
        </div>
      </section>

      {/* 聖樂影音（Suspense 串流，載入時顯示骨架） */}
      <Suspense fallback={<VideoSectionSkeleton />}>
        <VideoSection />
      </Suspense>

      {/* 人物分享 + 好書閱讀 + 拾穗集 */}
      <FeatureSections />

      {/* 近期報導 */}
      <section className="container mx-auto px-4 pb-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              最新動態
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              近期班會報導
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            查看全部
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
