'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide }         from 'swiper/react';
import { Pagination }                  from 'swiper/modules';
import type { Swiper as SwiperClass }  from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import type { ClipCard } from '@/app/data';

interface ClipsSliderProps {
  cards: ClipCard[];
}

const SPACE_BETWEEN     = 20;
const MOBILE_BREAKPOINT = 768;

const DESKTOP = {
  active:   { width: 752, height: 478 },
  inactive: { width: 304, height: 356 },
};

export default function ClipsSlider({ cards }: ClipsSliderProps) {
  const initialSlide                  = Math.floor(cards.length / 2);
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const [isMobile, setIsMobile]       = useState(false);
  const [mobileWidth, setMobileWidth] = useState(320);
  const swiperRef                     = useRef<SwiperClass | null>(null);
  const containerRef                  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setIsMobile(w < MOBILE_BREAKPOINT);
      setMobileWidth(w);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => swiperRef.current?.update(), 420);
    return () => clearTimeout(timer);
  }, [activeIndex, isMobile, mobileWidth]);

  return (
    <div ref={containerRef} className="w-full">
      <Swiper
        modules={[Pagination]}
        slidesPerView="auto"
        spaceBetween={SPACE_BETWEEN}
        centeredSlides
        initialSlide={initialSlide}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="clips-slider"
      >
        {cards.map((clip, index) => {
          const isActive = index === activeIndex;

          const slideWidth  = isMobile ? mobileWidth : (isActive ? DESKTOP.active.width  : DESKTOP.inactive.width);
          const slideHeight = isMobile ? mobileWidth * (9 / 16) : (isActive ? DESKTOP.active.height : DESKTOP.inactive.height);

          return (
            <SwiperSlide
              key={`${clip.clipUrl}-${index}`}
              style={{ width: slideWidth }}
              onClick={() => window.open(clip.clipUrl, '_blank', 'noopener,noreferrer')}
            >
              <div
                className="relative w-full rounded-2xl overflow-hidden select-none cursor-pointer"
                style={{ height: slideHeight }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clip.imageUrl}
                  alt={clip.imageAlt}
                  className="w-full h-full object-cover block"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-heading text-sm font-bold leading-tight uppercase m-0 line-clamp-2">
                    {clip.title}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
