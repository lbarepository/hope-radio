import { fetchGraphQL }       from '@/lib/wordpress';
import { transformClips }     from '@/app/data';
import type { ClipCard }      from '@/app/data';
import { GET_CLIPS }          from '@/graphql/clips';
import type { GetClipsData }  from '@/graphql/clips';
import ClipsSlider            from './ClipsSlider';

interface ClipsSectionProps {
  count?: number;
  title?: string;
}

export default async function ClipsSection({
  count = 10,
  title = 'Clips à la une',
}: ClipsSectionProps) {
  let cards: ClipCard[] = [];
  try {
    const data = await fetchGraphQL<GetClipsData>(
      GET_CLIPS,
      { first: count },
      { next: { revalidate: 60 } },
    );
    cards = transformClips(data);
  } catch {
    // WP indisponible — section masquée
  }

  if (cards.length === 0) return null;

  return (
    <section className="clips-section w-full py-12 overflow-hidden">
      <style>{`
        .clips-slider .swiper-pagination {
          position:        relative;
          bottom:          auto;
          display:         flex;
          align-items:     center;
          justify-content: center;
          gap:             6px;
          margin-top:      24px;
        }
        .clips-slider .swiper-pagination-bullet {
          width:         8px;
          height:        8px;
          background:    rgba(114, 0, 74, 0.4);
          opacity:       1;
          border-radius: 100px;
          transition:    width 0.3s ease, background 0.3s ease;
        }
        .clips-slider .swiper-pagination-bullet-active {
          width:         24px;
          background:    #72004A;
          border-radius: 100px;
        }
        .clips-slider .swiper-wrapper {
          align-items: center;
        }
        .clips-slider .swiper-slide {
          cursor:     pointer;
          transition: width 0.4s ease;
        }
        .clips-slider .swiper-slide > div {
          transition: height 0.4s ease;
        }
      `}</style>

      <div className="container">
        <h2 className="font-nav font-[900] text-[48px] leading-none uppercase mb-8 m-0">
          {title}
        </h2>
      </div>

      <ClipsSlider cards={cards} />
    </section>
  );
}
