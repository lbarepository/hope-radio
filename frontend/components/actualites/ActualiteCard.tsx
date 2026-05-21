import Image from 'next/image';
import Link  from 'next/link';

import type { ActualiteArchiveCard } from '@/app/data/actualites/transformer';

interface ActualiteCardProps {
  card: ActualiteArchiveCard;
}

export default function ActualiteCard({ card }: ActualiteCardProps) {
  return (
    <article className="rounded-[20px] overflow-hidden bg-white flex flex-col">
      <div className="relative w-full aspect-[4/3]">
        {card.image.url ? (
          <Image
            src={card.image.url}
            alt={card.image.alt}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary" />
        )}
      </div>

      <div className="flex flex-col gap-3 p-5 flex-grow">
        <h2 className="font-heading font-bold text-[20px] leading-[110%] text-black m-0">
          {card.title}
        </h2>

        {card.excerpt && (
          <p className="font-body text-[12px] leading-[20px] text-[#0A0B0A] lowercase line-clamp-3 m-0">
            {card.excerpt}
          </p>
        )}

        <div className="mt-auto pt-2">
          <Link
            href={card.uri}
            className="inline-block bg-primary px-6 py-2 rounded-full font-heading text-sm font-bold text-white no-underline hover:bg-secondary transition-colors"
          >
            Découvrir
          </Link>
        </div>
      </div>
    </article>
  );
}
