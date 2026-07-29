'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import type { PodcastEpisode } from '@/lib/podcasts';

interface PodcastEpisodesSliderProps {
  episodes: PodcastEpisode[];
}

// ─── Card individuelle ────────────────────────────────────────────────────────

function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  return (
    <div
      className="episode-card relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer
                 transition-transform duration-300 ease-out will-change-transform
                 hover:scale-[1.1] hover:z-20"
    >
      {episode.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${episode.imageUrl})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative h-full flex flex-col items-center justify-between gap-4 p-6 text-center">
        <h3 className="font-nav font-[900] text-[28px] leading-[110%] text-[#E85B21]">
          {episode.title}
        </h3>

        <div className="flex flex-col items-center gap-3">
          {/* <span className="font-heading font-bold text-xs uppercase tracking-wide text-white">
            Dernier podcast
          </span> */}
          <button
            type="button"
            aria-label={`Écouter ${episode.title}`}
            className="flex items-center justify-center w-[53px] py-3 rounded-lg bg-secondary cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="23" viewBox="0 0 20 24" fill="none">
              <path d="M0 0L20 12L0 24V0Z" fill="#fff" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────

export default function PodcastEpisodesSlider({ episodes }: PodcastEpisodesSliderProps) {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        768: {
          slidesPerView: 2,
          spaceBetween:  20,
        },
        987: {
          slidesPerView: 3.2,
          spaceBetween:  20,
        },
      }}
      className="podcast-episodes-slider !overflow-visible"
    >
      {episodes.map((episode) => (
        <SwiperSlide key={episode.id}>
          {episode.emissionSlug ? (
            <Link href={`/emissions/${episode.emissionSlug}`} className="block">
              <EpisodeCard episode={episode} />
            </Link>
          ) : (
            <EpisodeCard episode={episode} />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
