import { notFound }      from 'next/navigation';
import type { Metadata } from 'next';

import { fetchGraphQL }                                       from '@/lib/wordpress';
import { GET_EMISSION_BY_SLUG }                               from '@/graphql/emissions';
import type { GetEmissionBySlugData }                         from '@/graphql/emissions';
import { GET_GRILLE_SLOTS }                                   from '@/graphql/grille';
import type { GetGrilleSlotsData }                            from '@/graphql/grille';
import { transformEmissionDetail }                            from '@/app/data/emissions/transformer';
import EmissionDetail                                         from '@/components/emissions/EmissionDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

function getTwoWeekRange(): { dateDebut: string; dateFin: string } {
  const today = new Date();
  const end   = new Date(today);
  end.setDate(today.getDate() + 13);
  return {
    dateDebut: today.toISOString().split('T')[0],
    dateFin:   end.toISOString().split('T')[0],
  };
}

function computeHoraire(grilleData: GetGrilleSlotsData | null, slug: string): string | null {
  if (!grilleData) return null;

  const slots = grilleData.grilleSlots.filter(
    (s) => s.emission?.uri?.replace(/\/$/, '').endsWith(`/${slug}`)
  );
  if (!slots.length) return null;

  const unique = [
    ...new Map(
      slots.map((s) => [`${s.heureDebut}-${s.heureFin}`, `${s.heureDebut} > ${s.heureFin}`])
    ).values(),
  ];

  return unique.join(' · ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchGraphQL<GetEmissionBySlugData>(
      GET_EMISSION_BY_SLUG,
      { slug },
    );
    return { title: data.emission?.title ?? 'Émission' };
  } catch {
    return { title: 'Émission' };
  }
}

export default async function EmissionPage({ params }: Props) {
  const { slug } = await params;
  const { dateDebut, dateFin } = getTwoWeekRange();

  const [emissionResult, grilleResult] = await Promise.allSettled([
    fetchGraphQL<GetEmissionBySlugData>(
      GET_EMISSION_BY_SLUG,
      { slug },
      { next: { revalidate: 60 } },
    ),
    fetchGraphQL<GetGrilleSlotsData>(
      GET_GRILLE_SLOTS,
      { dateDebut, dateFin },
      { next: { revalidate: 60 } },
    ),
  ]);

  if (emissionResult.status === 'rejected') notFound();

  const emission = transformEmissionDetail(emissionResult.value);
  if (!emission) notFound();

  const grilleData = grilleResult.status === 'fulfilled' ? grilleResult.value : null;
  const horaire    = computeHoraire(grilleData, slug);

  return <EmissionDetail emission={emission} horaire={horaire} />;
}
