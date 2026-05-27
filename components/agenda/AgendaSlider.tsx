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

const FALLBACK_IMAGE     = 'https://placehold.co/560x420/72004A/FFFFFF?text=Agenda';
const SPACE_BETWEEN      = 16;
const MOBILE_BREAKPOINT  = 768;

function computeWidths(containerWidth: number, mobile: boolean) {
  if (mobile) {
    // Mobile : 1 slide plein écran à la fois
    return { inactive: containerWidth, active: containerWidth };
  }
  // Desktop : 2.5 slides visibles — active (2×) + 1 inactive + ½ inactive = 3.5 unités + 2 gaps
  const inactive = (containerWidth - SPACE_BETWEEN * 2) / 3.5;
  return { inactive: Math.floor(inactive), active: Math.floor(inactive * 2) };
}

export default function AgendaSlider({ initialItems, categories, loadByCategory }: Props) {
  const [items, setItems]             = useState<AgendaCard[]>(initialItems);
  const [activeSlug, setActiveSlug]   = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPending, startTransition]  = useTransition();
  const [widths, setWidths]           = useState({ inactive: 280, active: 560 });
  const [isMobile, setIsMobile]       = useState(false);
  const swiperRef    = useRef<SwiperClass | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calcul responsive : 2.5 slides sur desktop, 1 slide sur mobile
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const w      = entry.contentRect.width;
      const mobile = w < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setWidths(computeWidths(w, mobile));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Recalcule les positions Swiper après changement de largeur ou de slide actif
  useEffect(() => {
    const timer = setTimeout(() => swiperRef.current?.update(), 50);
    return () => clearTimeout(timer);
  }, [activeIndex, widths]);

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
        <div ref={containerRef} className={`agenda-slider px-6 lg:px-12 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          <Swiper
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={SPACE_BETWEEN}
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
                  style={{ width: isActive ? `${widths.active}px` : `${widths.inactive}px` }}
                >
                  <div className="md:h-[420px] rounded-[16px] overflow-hidden flex flex-col bg-white">
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
                        
                        <div className="font-bold text-primary text-[20px] leading-tight uppercase">
                          {item.title}
                        </div>
                        {item.date && (
                          <span className="font-bold text-[13px] text-secondary uppercase leading-none">
                            {item.date}
                          </span>
                        )}
                        {isActive && (
                          <div className="flex gap-4 flex-col md:flex-row">
                            {item.excerpt && (
                              <p className="text-[12px] mt-1 leading-tight text-justify">
                                {item.excerpt}
                              </p>
                            )}
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
                              <span className="font-button font-semibold inline-flex items-center rounded-[30px] bg-primary text-white text-sm h-[40px] px-5 whitespace-nowrap cursor-default">
                                Découvrir
                              </span>
                            )}
                          </div>
                          </div>
                        )}
                        {/* Bouton uniquement sur le slide actif */}
                      
                      </div>

                      
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
