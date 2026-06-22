import Link from "next/link";
import Image from "next/image";
import { User, BookOpen, Wheat } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { getCloudinaryUrl } from "@/src/utils/cloudinary";
import {
  featuredPerson,
  books,
  gleanings,
} from "@/src/config/home-features";

function SectionHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
        {icon}
      </span>
      <h2 className="font-serif text-2xl font-bold text-foreground">{children}</h2>
    </div>
  );
}

export function FeatureSections() {
  return (
    <section className="container mx-auto space-y-12 px-4 py-12">
      {/* 人物分享 + 好書閱讀 */}
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* 人物分享 */}
        <div>
          <SectionHeading icon={<User className="size-5" aria-hidden="true" />}>
            人物分享
          </SectionHeading>
          <Link
            href={featuredPerson.href}
            className="group flex overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition hover:shadow-warm-lg"
          >
            <div className="relative aspect-[4/3] w-2/5 shrink-0 overflow-hidden">
              <Image
                src={featuredPerson.image}
                alt={featuredPerson.title}
                fill
                sizes="(max-width: 1024px) 40vw, 280px"
                className="object-cover object-[50%_15%] transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center gap-2 p-5">
              <Badge className="w-fit rounded-full">{featuredPerson.badge}</Badge>
              <h3 className="font-serif text-lg font-bold leading-snug text-foreground transition group-hover:text-primary">
                {featuredPerson.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {featuredPerson.date}　|　{featuredPerson.author}
              </p>
            </div>
          </Link>
        </div>

        {/* 好書閱讀 */}
        <div>
          <SectionHeading icon={<BookOpen className="size-5" aria-hidden="true" />}>
            好書閱讀
          </SectionHeading>

          {/* 木質書架 */}
          <div className="relative rounded-2xl bg-linear-to-b from-[#caa775] to-[#a9824f] p-6 pb-3 shadow-warm">
            <div className="flex items-end justify-center gap-7" style={{ perspective: "1200px" }}>
              {books.map((book) => (
                <Link
                  key={book.href}
                  href={book.href}
                  className="group relative block h-52 w-36 shrink-0 transition-transform duration-300 ease-out hover:-translate-y-3"
                  aria-label={`翻閱 ${book.title}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* 立體書本（封面 + 書脊 + 頁緣） */}
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-l-[3px] rounded-r-md bg-linear-to-br ${book.cover} shadow-[8px_10px_24px_-6px_rgba(60,30,10,0.5)] transition-shadow duration-300 group-hover:shadow-[14px_18px_32px_-8px_rgba(60,30,10,0.55)]`}
                  >
                    {/* 書脊（左側深色，含立體高光） */}
                    <span className={`absolute inset-y-0 left-0 w-4 bg-linear-to-r ${book.spine}`} />
                    <span className="absolute inset-y-0 left-4 w-px bg-white/30" />
                    {/* 封面斜向高光 */}
                    <span className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/20" />
                    {/* 燙金邊框 + 書名 */}
                    <div className="absolute inset-x-3 inset-y-4 left-6 flex flex-col items-center justify-center rounded-sm border border-amber-200/40">
                      <span className="absolute -top-px left-1/2 h-px w-8 -translate-x-1/2 bg-amber-200/50" />
                      <span
                        className={`px-2 text-center font-serif text-lg font-bold leading-snug tracking-wide ${book.ink} [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]`}
                      >
                        {book.title}
                      </span>
                      <span className="mt-2 text-[9px] uppercase tracking-[0.2em] text-amber-100/60">
                        DAOYI
                      </span>
                    </div>
                  </div>
                  {/* 右側頁緣（書頁厚度） */}
                  <span className="absolute right-0 top-1 h-[calc(100%-8px)] w-1.5 translate-x-[5px] rounded-r-sm bg-linear-to-r from-stone-200 to-stone-400 shadow-sm [background-image:repeating-linear-gradient(to_right,#e7e2d8_0,#e7e2d8_1px,#cfc8ba_1px,#cfc8ba_2px)]" />
                </Link>
              ))}
            </div>
            {/* 書架層板 */}
            <div className="mt-3 h-3 rounded-b-lg bg-linear-to-b from-[#8a6a3f] to-[#6f5333] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </div>

      {/* 拾穗集 */}
      <div>
        <SectionHeading icon={<Wheat className="size-5" aria-hidden="true" />}>
          拾穗集
        </SectionHeading>
        <div className="grid gap-5 md:grid-cols-2">
          {gleanings.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group relative flex h-40 items-center overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition hover:shadow-warm-lg"
            >
              {/* 圖片填滿整卡，文字浮在左側漸層上 */}
              <Image
                src={getCloudinaryUrl(g.image)}
                alt={g.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-right transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-card via-card/85 to-transparent" />
              <div className="relative z-10 flex flex-col gap-1 p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Gleaning Collection
                </span>
                <span className="font-serif text-xl font-bold text-primary-deep transition group-hover:text-primary">
                  {g.name}
                </span>
                <span className="text-sm text-muted-foreground">{g.subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
