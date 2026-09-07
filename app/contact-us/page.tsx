import type { Metadata } from "next";
import { HandHeart, Landmark, Receipt } from "lucide-react";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "贊助本會",
  description: "社團法人新北市道一關懷協會 捐款與贊助資訊。",
};

export default function ContactUsPage() {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          護持道務
        </p>
        <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
          <HandHeart className="size-8 text-primary" aria-hidden="true" />
          贊助本會
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          感謝您的慈悲護持。本會為新北市政府立案成立之協會，捐款與會費皆可開立收據供報稅使用。
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 捐款 / 會費 */}
        <section className="rounded-2xl border border-border bg-card p-7 shadow-warm">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <Landmark className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-serif text-xl font-bold text-foreground">
              繳會員年費 / 小額捐款
            </h2>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            為便於日後報稅，請使用銀行轉帳：
          </p>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                戶名
              </dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                社團法人新北市道一關懷協會
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                銀行
              </dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                第一銀行　樹林分行
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                帳號
              </dt>
              <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-primary-deep">
                20310056081
              </dd>
            </div>
          </dl>
        </section>

        {/* 報帳 / 統編 */}
        <section className="rounded-2xl border border-border bg-card p-7 shadow-warm">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <Receipt className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-serif text-xl font-bold text-foreground">
              開立收據 / 統一發票
            </h2>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            道務或協會工作上的費用支出，請開立收據或統一發票，以便會計報帳：
          </p>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                署名
              </dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                社團法人新北市道一關懷協會
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                統一編號
              </dt>
              <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-primary-deep">
                91177786
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">感謝慈悲護持！</p>
        </section>
      </div>
      <section
        className="mt-10 border-t border-border pt-8 dark:border-border"
        aria-labelledby="contact-heading"
      >
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:items-start">
          <div>
            <h2
              id="contact-heading"
              className="font-serif text-xl font-bold text-foreground dark:text-foreground"
            >
              聯絡本會
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground dark:text-muted-foreground">
              如有捐款、收據或其他協會相關問題，歡迎來信聯絡。
            </p>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  聯絡信箱
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-block max-w-full break-all rounded-sm text-base font-medium text-primary underline underline-offset-4 transition hover:text-primary-deep dark:text-primary dark:hover:text-primary-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  地址
                </dt>
                <dd className="mt-1 text-base leading-relaxed text-foreground">
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm underline decoration-border underline-offset-4 transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {siteConfig.address}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-secondary shadow-warm dark:border-border dark:bg-secondary">
            <iframe
              src={mapUrl}
              title={`${siteConfig.fullName}位置地圖`}
              className="h-80 w-full border-0 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  );
}
