import { fetchGraphQL }      from '@/lib/wordpress';
import { transformRadios }   from '@/app/data';
import type { RadioCard }    from '@/app/data';
import { GET_RADIOS }        from '@/graphql/radios';
import type { GetRadiosData } from '@/graphql/radios';
import RadiosSlider          from './RadiosSlider';

interface RadiosSectionProps {
  count?: number;
}

export default async function RadiosSection({ count = 20 }: RadiosSectionProps) {
  let cards: RadioCard[] = [];
  try {
    const data = await fetchGraphQL<GetRadiosData>(
      GET_RADIOS,
      { first: count },
      { next: { revalidate: 60 } },
    );
    cards = transformRadios(data);
  } catch {
    // WP indisponible — section masquée
  }

  if (cards.length === 0) return null;

  return (
    <section className="w-full py-12 overflow-hidden" style={{ background: '#72004A' }}>
      <div className="container ">
        <h2
          className="text-white  font-nav font-[900] text-[48px] leading-[83%] uppercase mb-8"
         
        >
          Nos autres radios
        </h2>
      </div>
      <RadiosSlider cards={cards} />
    </section>
  );
}
