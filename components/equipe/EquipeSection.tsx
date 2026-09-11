import { fetchGraphQL }        from '@/lib/wordpress';
import { transformAnimateurs } from '@/app/data';
import type { AnimateurCard }  from '@/app/data';
import { GET_ANIMATEURS }      from '@/graphql/animateurs';
import type { GetAnimateursData } from '@/graphql/animateurs';
import EquipeSlider            from './EquipeSlider';
import { wpTags }              from '@/lib/revalidateTags';

// Correspond au bloc WordPress hope-radio/equipe : les animateurs (CPT
// Animateur) sont récupérés automatiquement, sans lien direct avec le bloc.

interface EquipeSectionProps {
  title?: string;
  count?: number;
}

export default async function EquipeSection({
  title = "L'équipe",
  count = 20,
}: EquipeSectionProps) {
  let animateurs: AnimateurCard[] = [];
  try {
    const data = await fetchGraphQL<GetAnimateursData>(
      GET_ANIMATEURS,
      { first: count },
      { next: { revalidate: 60, tags: [wpTags.animateurs] } },
    );
    animateurs = transformAnimateurs(data);
  } catch {
    // WP indisponible — section masquée
  }

  if (animateurs.length === 0) return null;

  return (
    <section className="w-full py-16 bg-primary overflow-hidden">
      <div className="container">
        <h2 className="font-nav font-[900] text-white text-[32px] md:text-[48px] leading-[83%] uppercase mb-10">
          {title}
        </h2>
      </div>

      <EquipeSlider animateurs={animateurs} />
    </section>
  );
}
