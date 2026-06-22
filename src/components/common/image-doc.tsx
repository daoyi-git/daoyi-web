"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

/** 文件型圖片展示（協會章程、組織架構等掃描圖），點擊放大檢視 */
export function ImageDoc({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition hover:shadow-warm-lg"
            aria-label={`放大檢視 ${alt} 第 ${i + 1} 張`}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              width={900}
              height={1200}
              className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="圖片檢視"
          onClick={() => setActive(null)}
        >
          <button
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="關閉"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
          <div
            className="relative h-[88vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={`${alt} ${active + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
