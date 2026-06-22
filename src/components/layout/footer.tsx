import Link from "next/link";
import Image from "next/image";
import { Facebook } from "lucide-react";
import { siteConfig, mainNav } from "@/src/config/site";

export function Footer() {
  const flatLinks = mainNav.flatMap((item) =>
    item.children ? item.children : item.href !== "#" ? [item] : [],
  );

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-[1.5fr_2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src={siteConfig.logo}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0"
            />
            <span className="font-serif text-lg font-bold text-foreground">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteConfig.fullName}　致力於道務推廣與公益關懷。
          </p>
          <a
            href={siteConfig.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Facebook className="size-4" aria-hidden="true" />
            Facebook 社團
          </a>
        </div>

        <nav aria-label="頁尾導覽">
          <p className="text-sm font-semibold text-foreground">網站導覽</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {flatLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.fullName}．版權所有
        </div>
      </div>
    </footer>
  );
}
