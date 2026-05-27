'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Swiper, SwiperSlide }                         from 'swiper/react';
import { Navigation }                                  from 'swiper/modules';
import type { Swiper as SwiperClass }                  from 'swiper';
import Image                                           from 'next/image';
import Link                                            from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';

import { normalizeWpImageUrl } from '@/lib/wordpress';
import type { AgendaCard }     from '@/app/data/agenda/transformer';
import type { AgendaCategorie } from '@/graphql/agenda';

interface Props {
  initialItems:    AgendaCard[];
  categories:      AgendaCategorie[];
  loadByCategory:  (slug: string | null) => Promise<AgendaCard[]>;
}

const FALLBACK_IMAGE = 'https://placehold.co/560x420/72004A/FFFFFF?text=Agenda';

export default function AgendaSlider({ initialItems, categories, loadByCategory }: Props) {
  const [items, setItems]           = useState<AgendaCard[]>(initialItems);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const swiperRef = useRef<SwiperClass | null>(null);

  // Recalcule les largeurs Swiper après que React a appliqué les nouveaux styles
  useEffect(() => {
    const timer = setTimeout(() => swiperRef.current?.update(), 50);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  function handleCategory(slug: string | null) {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
    setActiveIndex(0);
    startTransition(async () => {
      try {
        const next = await loadByCategory(slug);
        setItems(next);
      } catch {
        // WP indisponible — on garde les items actuels
      }
    });
  }

  return (
    <div className="w-full">
      {/* ── Filtre catégories ── */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center gap-3 flex-wrap mb-10 px-6">
          <button
            onClick={() => handleCategory(null)}
            className={`font-heading font-bold text-sm px-6 py-2 rounded-full border transition-colors cursor-pointer ${
              activeSlug === null
                ? 'bg-white text-primary border-white'
                : 'bg-transparent text-white border-white hover:bg-white/10'
            }`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.slug)}
              className={`font-heading font-bold text-sm px-6 py-2 rounded-full border transition-colors cursor-pointer ${
                activeSlug === cat.slug
                  ? 'bg-white text-primary border-white'
                  : 'bg-transparent text-white border-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Slider ── */}
      {items.length === 0 ? (
        <p className="text-center text-white/60 font-heading py-16">
          Aucun événement dans cette catégorie.
        </p>
      ) : (
        <div className={`agenda-slider px-6 lg:px-12 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          <Swiper
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={16}
            navigation
            observer
            observeParents
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onActiveIndexChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {items.map((item, i) => {
              const isActive = i === activeIndex;
              const imgSrc   = item.image ? normalizeWpImageUrl(item.image.url) : FALLBACK_IMAGE;
              const imgAlt   = item.image?.alt ?? item.title;

              return (
                <SwiperSlide
                  key={item.id}
                  className={isActive ? 'is-active' : ''}
                >
                  <div className="h-[420px] rounded-[16px] overflow-hidden flex flex-col bg-white">
                    {/* Image — 70% */}
                    <div className="relative w-full" style={{ height: '70%' }}>
                      <Image
                        src={imgSrc}
                        alt={imgAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 560px"
                      />
                    </div>

                    {/* Contenu — 30% */}
                    <div className="flex flex-col justify-between px-5 py-4 flex-1 overflow-hidden">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        {item.date && (
                          <span className="font-heading font-bold text-[13px] text-secondary uppercase leading-none">
                            {item.date}
                          </span>
                        )}
                        <h3 className="font-nav font-[900] text-primary text-[20px] leading-tight line-clamp-2 uppercase">
                          {item.title}
                        </h3>
                        {isActive && item.excerpt && (
                          <p className="font-heading text-[13px] text-gray-600 line-clamp-2 mt-1">
                            {item.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Bouton uniquement sur le slide actif */}
                      {isActive && (
                        <div className="flex justify-end mt-2">
                          {item.lien ? (
                            <Link
                              href={item.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-button font-semibold inline-flex items-center rounded-[30px] bg-primary text-white text-sm h-[40px] px-5 whitespace-nowrap hover:bg-primary/90 transition-colors"
                            >
                              Découvrir
                            </Link>
                          ) : (
                            <span className="font-button font-semibold inline-flex items-center rounded-[30px] bg-primary/30 text-primary text-sm h-[40px] px-5 whitespace-nowrap cursor-default">
                              Découvrir
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
}
