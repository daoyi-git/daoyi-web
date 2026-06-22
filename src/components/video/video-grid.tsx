"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";

export interface GridVideo {
  id: string;
  title: string;
}

export function VideoGrid({ videos }: { videos: GridVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveId(video.id)}
            className="group block text-left"
            aria-label={`播放：${video.title}`}
          >
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-warm">
              <Image
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 50vw, 200px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/30" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid size-10 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-warm transition group-hover:scale-110">
                  <Play className="size-4 translate-x-0.5 fill-current" aria-hidden="true" />
                </span>
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-foreground transition group-hover:text-primary">
              {video.title}
            </p>
          </button>
        ))}
      </div>

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
    </>
  );
}
