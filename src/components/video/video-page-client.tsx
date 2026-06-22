"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Play, X, Video as VideoIcon, Music } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Video } from "@/src/lib/videos";

export interface SheetMusicItem {
  url: string;
  title: string;
}

type Tab = "videos" | "sheets";

export function VideoPageClient({
  videos,
  sheets,
}: {
  videos: Video[];
  sheets: SheetMusicItem[];
}) {
  const [tab, setTab] = useState<Tab>("videos");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<SheetMusicItem | null>(null);

  useEffect(() => {
    const open = activeId || activeSheet;
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveId(null);
        setActiveSheet(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, activeSheet]);

  const tabBtn = (t: Tab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setTab(t)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition",
        tab === t
          ? "bg-primary text-primary-foreground shadow-warm"
          : "border border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          影音典藏
        </p>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          聖樂影音
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          道一關懷協會的影片紀實與聖樂歌譜，與道親共享法喜。
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-10 flex flex-wrap gap-3">
        {tabBtn("videos", "影片", <VideoIcon className="size-4" aria-hidden="true" />)}
        {sheets.length > 0 &&
          tabBtn("sheets", "聖樂歌譜", <Music className="size-4" aria-hidden="true" />)}
      </div>

      {/* 影片 */}
      {tab === "videos" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveId(video.id)}
              className="group block text-left"
              aria-label={`播放：${video.title}`}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-warm">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/30" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-12 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-warm transition group-hover:scale-110">
                    <Play className="size-5 translate-x-0.5 fill-current" aria-hidden="true" />
                  </span>
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-foreground transition group-hover:text-primary">
                {video.title}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* 聖樂歌譜 */}
      {tab === "sheets" && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {sheets.map((sheet) => (
            <button
              key={sheet.url}
              onClick={() => setActiveSheet(sheet)}
              className="group block text-left"
              aria-label={`檢視歌譜：${sheet.title}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card shadow-warm">
                <Image
                  src={sheet.url}
                  alt={sheet.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 240px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-center text-sm font-medium text-foreground transition group-hover:text-primary">
                {sheet.title}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* 影片播放 modal */}
      {activeId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="影片播放"
          onClick={() => setActiveId(null)}
        >
          <button
            onClick={() => setActiveId(null)}
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="關閉"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
          <div
            className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="size-full"
              src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube 影片"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}

      {/* 歌譜檢視 modal */}
      {activeSheet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="歌譜檢視"
          onClick={() => setActiveSheet(null)}
        >
          <button
            onClick={() => setActiveSheet(null)}
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="關閉"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
          <div className="relative h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={activeSheet.url}
              alt={activeSheet.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
