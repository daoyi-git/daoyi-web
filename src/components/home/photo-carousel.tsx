"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Photo {
  src: string;
  href: string;
  title: string;
}

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

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
        loop={photos.length > 5}
        className="daoyi-photo-swiper pb-9"
      >
        {photos.map((photo, i) => (
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
