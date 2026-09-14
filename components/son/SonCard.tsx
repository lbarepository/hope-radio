import Image from 'next/image';

import type { ConducteurTrack } from '@/lib/conducteur';

interface SonCardProps {
  track: ConducteurTrack;
}

export default function SonCard({ track }: SonCardProps) {
  return (
    <article className="flex items-stretch gap-4 md:gap-6">

      {/* Pochette */}
      <div className="relative shrink-0 rounded-[20px] overflow-hidden w-[110px] h-[110px] md:w-[180px] md:h-[180px] bg-brand-violet">
        {track.coverUrl && (
          <Image
            src={track.coverUrl}
            alt={`${track.titre} — ${track.artiste}`}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 110px, 180px"
          />
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col justify-center gap-1 md:gap-2 rounded-[20px] bg-white flex-grow p-5 md:p-10 min-w-0">
        <p className="font-nav font-[900] text-lg md:text-[28px] leading-[110%] text-primary m-0">
          {track.time}
        </p>
        <h2 className="font-nav font-[900] text-2xl md:text-[40px] leading-[95%] text-[#31251A] m-0">
          {track.titre}
        </h2>
        {track.artiste && (
          <p className="font-heading text-sm md:text-base font-bold leading-[124%] text-[#31251A] m-0">
            {track.artiste}
          </p>
        )}
      </div>
    </article>
  );
}
