"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Photo {
  src: string;
  href: string;
  title: string;
}

/** 取最多 count 張隨機照片 */
function pickRandom(photos: Photo[], count: number): Photo[] {
  const arr = [...photos];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export function PhotoCarousel({
  photos,
  count = 12,
}: {
  photos: Photo[];
  count?: number;
}) {
  // 在 client 端隨機抽，每次進頁 / reload 都是不同組（避免 SSR/hydration 不一致：
  // 首次 render 用穩定前 count 張，掛載後才洗牌）
  const [shown, setShown] = useState<Photo[]>(() => photos.slice(0, count));

  useEffect(() => {
    const id = window.setTimeout(() => setShown(pickRandom(photos, count)), 0);
    return () => window.clearTimeout(id);
  }, [photos, count]);

  if (shown.length === 0) return null;

  return (
    <div className="rounded-2xl bg-card/90 p-4 shadow-warm-lg backdrop-blur-sm md:p-5">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={12}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        loop={shown.length > 5}
        className="daoyi-photo-swiper pb-9"
      >
        {shown.map((photo, i) => (
          <SwiperSlide key={photo.src + i}>
            <Link
              href={photo.href}
              className="group relative block aspect-[4/3] overflow-hidden rounded-xl shadow-warm"
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
