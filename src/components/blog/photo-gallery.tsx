"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-warm"
            aria-label={`檢視第 ${i + 1} 張照片`}
          >
            <Image
              src={src}
              alt={`${title}　照片 ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-60 bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="照片檢視"
          onClick={close}
        >
          {/* 關閉 */}
          <button
            onClick={close}
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="關閉"
          >
            <X className="size-6" aria-hidden="true" />
          </button>

          {/* 上一張 / 下一張：垂直置中、貼左右邊 */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
                aria-label="上一張"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
                aria-label="下一張"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            </>
          )}

          {/* 圖片：左右留出箭頭空間，上下留標題/分頁空間 */}
          <div
            className="absolute inset-0 flex items-center justify-center px-16 py-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={`${title}　照片 ${index + 1}`}
              width={1600}
              height={1200}
              sizes="100vw"
              className="max-h-full w-auto object-contain"
              priority
            />
          </div>

          {/* 分頁 */}
          {images.length > 1 && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {index + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
