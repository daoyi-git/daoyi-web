import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Disc3, Film, ScrollText } from "lucide-react";
import { getCloudinaryUrl } from "@/src/utils/cloudinary";
import { VideoGrid } from "@/src/components/video/video-grid";
import { Badge } from "@/src/components/ui/badge";
import {
  heroImage,
  relatedVideos,
  storybooks,
  badge,
  articleTitle,
  articleMeta,
  bioBlocks,
  quotes,
} from "@/src/config/he-qian-ren";

export const metadata: Metadata = {
  title: "何前人專輯",
  description: "好學不倦，筆耕不輟 — 何紹棠前人。",
};

export default function HeQianRenPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="mb-8 flex items-center gap-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
        <Disc3 className="size-8 text-primary" aria-hidden="true" />
        何前人專輯
      </h1>

      {/* 主圖 + 相關影片 */}
      <div className="mb-12 flex flex-col gap-6 lg:flex-row">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-warm lg:aspect-auto lg:w-[460px] lg:shrink-0">
          <Image
            src={heroImage}
            alt="何紹棠前人"
            fill
            sizes="(max-width: 1024px) 100vw, 460px"
            className="object-cover object-top"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Film className="size-4 text-primary" aria-hidden="true" />
            相關影片
          </h2>
          <VideoGrid videos={relatedVideos} />
        </div>
      </div>

      {/* 事蹟圖冊 */}
      <section className="mb-12 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
        <h2 className="mb-2 flex items-center gap-3 font-serif text-2xl font-bold text-foreground">
          <ScrollText className="size-6 text-primary" aria-hidden="true" />
          事蹟介紹
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          點擊下方圖冊，可全螢幕縮放閱讀何前人一生事蹟記錄。
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {storybooks.map((book) => {
            const imageId = `daoyi-web/books/${book.id}/page_001`;
            const href = `/gleanings-viewer?img=${encodeURIComponent(imageId)}&title=${encodeURIComponent(book.title)}`;
            return (
              <Link
                key={book.id}
                href={href}
                className="group block overflow-hidden rounded-xl border border-border bg-card shadow-warm transition hover:shadow-warm-lg"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={getCloudinaryUrl(imageId, {
                      width: 300,
                      height: 400,
                      crop: "fill",
                      gravity: "north",
                    })}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="size-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="p-3 text-center text-sm font-semibold leading-tight text-foreground">
                  {book.title}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 傳記文章 */}
      <header className="mb-8">
        <Badge className="rounded-full">{badge}</Badge>
        <h2 className="mt-4 font-serif text-2xl font-bold text-foreground md:text-3xl">
          {articleTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{articleMeta}</p>
      </header>

      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/85 prose-figcaption:text-muted-foreground">
        {/* 開頭：照片左 + 前兩段文字右（兩欄，不用 float） */}
        <div className="not-prose mb-6 flex flex-col gap-6 sm:flex-row">
          <figure className="m-0 w-44 shrink-0 md:w-56">
            <Image
              src={bioBlocks[0].figure!.src}
              alt={bioBlocks[0].figure!.caption}
              width={480}
              height={600}
              className="w-full rounded-lg shadow-warm"
            />
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {bioBlocks[0].figure!.caption}
            </figcaption>
          </figure>
          <div className="prose prose-neutral min-w-0 max-w-none flex-1 dark:prose-invert prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/85 [&>*:first-child]:mt-0">
            {[bioBlocks[0], bioBlocks[1]].map((block, i) => (
              <div key={i}>
                {block.heading && (
                  <h3 className="mt-6 mb-3 font-serif text-xl font-bold text-foreground first:mt-0">
                    {block.heading}
                  </h3>
                )}
                {block.paras?.map((p, j) => (
                  <p key={j} className="mb-3 leading-relaxed text-foreground/85">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 「不斷學習」段的兩張並排圖，整寬接在兩欄下方 */}
        {bioBlocks[1].figures && (
          <div className="my-8 grid gap-6 md:grid-cols-2">
            {bioBlocks[1].figures.map((fig, k) => (
              <figure key={k} className="m-0">
                <Image
                  src={fig.src}
                  alt={fig.caption}
                  width={600}
                  height={400}
                  className="w-full rounded-lg shadow-warm"
                />
                <figcaption className="mt-2 text-center text-sm">
                  {fig.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* 其餘段落：單欄 */}
        {bioBlocks.slice(2).map((block, i) => (
          <section key={i}>
            {block.heading && <h3>{block.heading}</h3>}
            {block.paras?.map((p, j) => (
              <p key={j}>{p}</p>
            ))}

            {block.figures && (
              <div className="my-8 grid gap-6 md:grid-cols-2">
                {block.figures.map((fig, k) => (
                  <figure key={k} className="m-0">
                    <Image
                      src={fig.src}
                      alt={fig.caption}
                      width={600}
                      height={400}
                      className="w-full rounded-lg shadow-warm"
                    />
                    <figcaption className="mt-2 text-center text-sm">
                      {fig.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {block.figure && !block.figure.float && (
              <figure className="my-8 max-w-xl">
                <Image
                  src={block.figure.src}
                  alt={block.figure.caption}
                  width={640}
                  height={420}
                  className="w-full rounded-lg shadow-warm"
                />
                <figcaption className="mt-2 text-sm">
                  {block.figure.caption}
                </figcaption>
              </figure>
            )}
          </section>
        ))}

        {/* 語錄 */}
        <div className="clear-both mt-10 rounded-2xl bg-secondary/60 p-6 not-prose">
          {quotes.map((q, i) => (
            <p
              key={i}
              className="font-serif text-lg italic leading-relaxed text-primary-deep first:mb-4"
            >
              {q}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
