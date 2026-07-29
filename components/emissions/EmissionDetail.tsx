import Image  from 'next/image';
import { normalizeWpImageUrl }   from '@/lib/wordpress';
import ShareButton               from './ShareButton';
import PodcastEmissionItem       from './PodcastEmissionItem';
import type { EmissionDetail }   from '@/app/data/emissions/transformer';
import type { PodcastEpisode }   from '@/lib/podcasts';

interface Props {
  emission: EmissionDetail;
  horaire:  string | null;
  podcasts: PodcastEpisode[];
}

export default function EmissionDetail({ emission, horaire, podcasts }: Props) {
  const { title, animateurs, excerpt, image } = emission;

  return (
    <>
    <main className="bg-primary bg-[url('/images/slider-bg.png')] bg-repeat overflow-hidden">
      <div className="max-w-[1139px] mx-auto px-6 lg:px-8 py-16 lg:py-0 lg:min-h-[580px] flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* Image animateurs */}
        {image ? (
          <div className="relative w-full lg:w-[460px] aspect-[4/5] lg:aspect-auto lg:self-stretch shrink-0 lg:translate-x-5 lg:translate-y-8 rounded-[20px] overflow-hidden">
            <Image
              src={normalizeWpImageUrl(image.url)}
              alt={image.alt}
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        ) : (
          <div className="hidden lg:block lg:w-[460px] shrink-0" />
        )}

        {/* Bloc contenu orange */}
        <div
          className="w-full lg:flex-1 flex flex-col gap-5 rounded-[30px]"
          style={{ background: '#E45612', padding: '60px' }}
        >
          {horaire && (
            <p
              className="font-nav font-[900] leading-[110%] uppercase"
              style={{ color: '#72004A', fontSize: '28px' }}
            >
              {horaire}
            </p>
          )}

          <h1
            className="font-nav font-[900] uppercase text-white m-0"
            style={{ fontSize: '48px', lineHeight: '83%' }}
          >
            {title}
          </h1>

          {animateurs && (
            <p
              className="font-heading font-[700] uppercase"
              style={{ color: '#31251A', fontSize: '14px', lineHeight: '124%' }}
            >
              Avec {animateurs}
            </p>
          )}

          {excerpt && (
            <p
              className="text-white"
              style={{ fontSize: '12px', lineHeight: '25px', textTransform: 'capitalize', fontFamily: 'Poppins, sans-serif' }}
            >
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2">
            <ShareButton title={title} />
          </div>
        </div>

      </div>

      
    </main>
    {podcasts.length > 0 && (
      <section className="bg-[#720049] py-16">
        <div className="max-w-[980px] mx-auto px-6 lg:px-0">
          <h3 className="font-nav font-[900] text-[28px] md:text-[32px] leading-[110%] text-white uppercase mb-8">
            Podcasts disponibles
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {podcasts.map((episode) => (
              <PodcastEmissionItem key={episode.id} episode={episode} />
            ))}
          </div>
        </div>
      </section>
    )}
    </>
    
  );
}
