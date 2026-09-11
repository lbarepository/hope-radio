'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectFade, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';

import type { HeroSlide, HeroSlideLink } from '@/app/data';
import { isExternalUrl, isSafeHref } from '@/lib/wordpress';

const BUTTON1_CN = 'font-button font-semibold inline-flex items-center shrink-0 cursor-pointer max-[768px]:w-full max-[768px]:justify-center rounded-[30px] bg-white text-primary text-base h-[50px] px-[30px] py-[10px] whitespace-nowrap';
const BUTTON2_CN = 'font-button font-semibold flex items-center gap-3 shrink-0 cursor-pointer max-[768px]:w-full max-[768px]:justify-center rounded-[30px] bg-[#5A3D75] text-white text-sm h-[50px] px-6 whitespace-nowrap';
const NAV_BUTTON_CN = 'flex items-center justify-center w-11 h-11 rounded-full border-2 border-white bg-transparent cursor-pointer transition-colors hover:bg-white/10 max-[980px]:w-9 max-[980px]:h-9';

// ─── Composant ────────────────────────────────────────────────────────────────

interface Props {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: Props) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Branche les boutons de navigation externes une fois le Swiper et les refs disponibles
  useEffect(() => {
    if (!swiperInstance || !prevRef.current || !nextRef.current) return;

    const { navigation } = swiperInstance.params;
    if (navigation && typeof navigation !== 'boolean') {
      navigation.prevEl = prevRef.current;
      navigation.nextEl = nextRef.current;
    }
    swiperInstance.navigation.destroy();
    swiperInstance.navigation.init();
    swiperInstance.navigation.update();
  }, [swiperInstance]);

  return (
    <section className="relative w-full overflow-hidden pt-48 max-w-[980px]:pt-32 bg-primary bg-[url('/images/slider-bg.png')] bg-repeat">
      {/* Conteneur centré 1139px : les flèches restent dans les limites du slide, jamais collées aux bords de l'écran */}
      <div className="relative max-w-[1139px] mx-auto max-[980px]:max-w-none">
        {/* Flèches centrées horizontalement, juste au-dessus de la pagination */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 max-[980px]:bottom-12">
          <button ref={prevRef} type="button" aria-label="Diapositive précédente" className={NAV_BUTTON_CN}>
            <ArrowIcon direction="left" />
          </button>
          <button ref={nextRef} type="button" aria-label="Diapositive suivante" className={NAV_BUTTON_CN}>
            <ArrowIcon direction="right" />
          </button>
        </div>
        <Swiper
          modules={[EffectFade, Pagination, Navigation, Autoplay]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onSwiper={setSwiperInstance}
          className="hero-slider \!h-[600px] max-[980px]:\!h-auto"
        >
          {slides.map((slide) => {
            const link1 = isValidLink(slide.link1) ? slide.link1 : null;

            return (
            <SwiperSlide key={slide.id}>
              {/*
                Desktop  : flex-row  — texte à gauche, image à droite, 1139px centré
                Mobile   : flex-col  — image en haut (order-1), texte en bas (order-2)
              */}
              <div className="max-w-[1139px] mx-auto h-full flex items-stretch px-8 max-[980px]:flex-col max-[980px]:px-0 max-[980px]:max-w-none">

              {/* ── Colonne texte (gauche desktop / bas mobile) ── */}
              <div className="flex flex-col justify-start gap-6 flex-1 min-w-0 pr-8 pb-12 max-[980px]:order-2 max-[980px]:px-5 max-[980px]:py-8 max-[980px]:bg-[#720049]">
                {/*
                  Tag — desktop uniquement.
                  Sur mobile il est repositionné sur l'image (voir ci-dessous).
                */}
                <span className="font-heading font-bold uppercase max-[768px]:hidden w-fit py-[15px] px-[30px] text-white text-base leading-5 border border-white rounded-full bg-transparent">
                  À la une
                </span>

                {/* Titre */}
                <h2 className="font-nav uppercase whitespace-pre-line max-[768px]:text-[32px] text-white text-[48px] font-[900] leading-[83%]">
                  {slide.title}
                </h2>

                {/* Description */}
                <p className="font-heading font-bold uppercase max-[768px]:text-[18px] text-[#BCBCBC] text-[32px] leading-none">
                  {slide.description}
                </p>

                {/* Boutons */}
                <div className="flex flex-col items-start gap-3 min-[769px]:flex-row min-[769px]:items-center min-[769px]:flex-wrap">

                  {/* Bouton 1 — vers le contenu */}
                  {link1 && (
                    <SlideActionLink link={link1} defaultLabel="En savoir plus" className={BUTTON1_CN} />
                  )}

                  {/* Bouton 2 — Message en direct (statique, en dur : ouvrira une popup d'envoi de message, à implémenter) */}
                  <button type="button" className={BUTTON2_CN}>
                    Message en direct
                    <LiveIcon />
                  </button>
                </div>
              </div>

              {/* ── Colonne image (droite desktop / haut mobile) ── */}
              <div
                className="
                  shrink-0 self-end
                  w-[512px] h-[546px]
                  max-[980px]:order-1
                  max-[980px]:w-10/12
                  max-[980px]:mx-auto
                  max-[980px]:min-h-[400px]
                  max-[980px]:self-auto
                  relative
                "
              >
                {/* Tag mobile — positionné en bas à gauche de l'image */}
                <span className="hidden max-[980px]:inline-flex font-heading font-bold uppercase absolute bottom-4 left-5 z-10 py-[10px] px-5 text-white text-sm leading-5 border border-white rounded-full bg-transparent">
                  À la une
                </span>

                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Placeholder en attente de l'image WordPress */
                  <div className="w-full h-full flex items-end justify-center pb-8 bg-[rgba(255,255,255,0.07)] rounded-t-lg">
                    <span className="font-heading uppercase text-[rgba(255,255,255,0.3)] text-xs tracking-[0.15em]">
                      Image à la une
                    </span>
                  </div>
                )}
              </div>

            </div>
          </SwiperSlide>
          );
        })}
        </Swiper>
      </div>
    </section>
  );
}

// ─── Lien de bouton (champ ACF "Lien" : url + libellé + cible) ────────────────

function isValidLink(link: HeroSlideLink | null): link is HeroSlideLink {
  return !!link && isSafeHref(link.url);
}

function SlideActionLink({
  link,
  defaultLabel,
  className,
  children,
}: {
  link: HeroSlideLink;
  defaultLabel: string;
  className: string;
  children?: React.ReactNode;
}) {
  const label = link.label || defaultLabel;
  const openInNewTab = link.target === '_blank' || isExternalUrl(link.url);

  return openInNewTab ? (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      {children}
    </a>
  ) : (
    <Link href={link.url} className={className}>
      {label}
      {children}
    </Link>
  );
}

// ─── Icône flèche (boutons de navigation du slider) ───────────────────────────

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      className={direction === 'left' ? 'rotate-180' : undefined}
      aria-hidden="true"
    >
      <path
        d="M11 1L17 7L11 13M17 7H1"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Icône micro (bouton "Message en direct") ─────────────────────────────────

function LiveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="19"
      viewBox="0 0 26 19"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 0C22.866 1.93277e-07 26 3.13401 26 7C26 10.866 22.866 14 19 14H8.16504L6 19L3.4043 13.0059C1.3652 11.7824 0 9.55105 0 7C0 3.13401 3.13401 1.93277e-07 7 0H19Z"
        fill="white"
      />
    </svg>
  );
}
