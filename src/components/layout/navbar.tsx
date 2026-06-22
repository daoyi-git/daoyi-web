"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { siteConfig, mainNav, type NavItem } from "@/src/config/site";
import { Button } from "@/src/components/ui/button";
import { ThemeToggle } from "@/src/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/src/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href !== "#" && item.href !== "/") return pathname.startsWith(item.href);
  if (item.href === "/") return pathname === "/";
  return item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.fullName} logo`}
            width={40}
            height={40}
            className="size-10 shrink-0"
            priority
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-serif text-sm font-bold leading-tight text-foreground sm:text-base">
              {siteConfig.fullName}
            </span>
            <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
              {siteConfig.nameEn}
            </span>
          </span>
        </Link>

        {/* 桌面導覽 */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="主導覽">
          {mainNav.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-primary/50",
                      isActive(pathname, item)
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  isActive(pathname, item)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* 行動選單 */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="開啟選單">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 p-0">
              <SheetTitle className="flex items-center gap-2.5 border-b border-border px-5 py-4">
                <Image
                  src={siteConfig.logo}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0"
                />
                <span className="font-serif text-sm font-bold leading-snug">{siteConfig.fullName}</span>
              </SheetTitle>
              <nav className="flex flex-col overflow-y-auto p-3" aria-label="行動導覽">
                {mainNav.map((item) =>
                  item.children ? (
                    <div key={item.label} className="mt-2 first:mt-0">
                      <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      {item.children.map((child) => (
                        <SheetClose asChild key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-lg px-5 py-2.5 text-sm hover:bg-secondary",
                              isActive(pathname, child) ? "text-primary" : "text-foreground",
                            )}
                          >
                            {child.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  ) : (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary",
                          isActive(pathname, item) ? "text-primary" : "text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
