"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Play, X, ChevronRight, Clapperboard } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { Video } from "@/src/lib/videos";

export function VideoSectionClient({
  videos,
  channelUrl,
}: {
  videos: Video[];
  channelUrl: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  return (
    <section className="container mx-auto px-4 py-10">
      <div>
        <div className="mb-6 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <Clapperboard className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              聖樂影音
            </h2>
          </div>
          <Link
            href="/video"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            更多
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={videos.length > 4}
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <button
                onClick={() => setActiveId(video.id)}
                className="group block w-full text-left"
                aria-label={`播放：${video.title}`}
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl shadow-warm">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 80vw, 280px"
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 播放 modal */}
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
    </section>
  );
}
