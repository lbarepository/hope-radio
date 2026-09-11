'use client';

import Image                    from 'next/image';
import { Swiper, SwiperSlide }  from 'swiper/react';
import 'swiper/css';

import { normalizeWpImageUrl } from '@/lib/wordpress';
import type { AnimateurCard }  from '@/app/data';

interface EquipeSliderProps {
  animateurs: AnimateurCard[];
}

const CARD_WIDTH_DESKTOP = 260;
const CARD_WIDTH_MOBILE  = 200;
const SPACE_BETWEEN      = 32;

// Mirrors the .container CSS: max-width 1139px, margin auto, padding 0 32px.
// Aligns the first slide with the container's left content edge without JS measurement.
const CONTAINER_OFFSET = 'max(32px, calc((100vw - 1139px) / 2 + 32px))';

export default function EquipeSlider({ animateurs }: EquipeSliderProps) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={SPACE_BETWEEN}
      className="equipe-slider !overflow-visible"
      style={{ paddingLeft: CONTAINER_OFFSET, paddingRight: '32px' }}
    >
      {animateurs.map((animateur) => (
        <SwiperSlide
          key={animateur.id}
          className="!h-auto !w-[200px] md:!w-[260px]"
        >
          <div className="flex flex-col items-center text-center gap-5">
            <div>
              <p className="font-heading font-[700] uppercase text-white text-[16px] leading-[120%] m-0">
                {animateur.nom}
              </p>
              {animateur.fonction && (
                <p className="font-heading font-[700] uppercase text-white/80 text-[13px] leading-[124%] m-0">
                  {animateur.fonction}
                </p>
              )}
            </div>

            <div
              className="relative rounded-full overflow-hidden bg-secondary shrink-0 w-full"
              style={{ aspectRatio: '1 / 1' }}
            >
              <Image
                src={normalizeWpImageUrl(animateur.imageUrl)}
                alt={animateur.imageAlt}
                fill
                sizes={`(min-width: 768px) ${CARD_WIDTH_DESKTOP}px, ${CARD_WIDTH_MOBILE}px`}
                className="object-cover object-top"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
