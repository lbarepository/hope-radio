import type { GetGrilleSlotsData } from '@/graphql/grille';

export interface EmissionSlot {
  id:         string;
  slotDate:   string;
  heureDebut: string;
  heureFin:   string;
  title:      string;
  category:   string | null;
  image:      { url: string; alt: string };
  uri:        string;
  excerpt:    string | null;
  animateur:  string | null;
}

export function transformGrilleSlots(data: GetGrilleSlotsData): EmissionSlot[] {
  return data.grilleSlots
    .filter((slot) => slot.emission !== null)
    .map((slot) => {
      const emission = slot.emission!;
      const animateur = emission.animateurs
        ?.map((a) => `${a.prenom} ${a.nom}`.trim())
        .filter(Boolean)
        .join(', ') || null;
      return {
        id:         `${slot.slotDate}-${slot.heureDebut}-${slot.heureFin}`,
        slotDate:   slot.slotDate,
        heureDebut: slot.heureDebut,
        heureFin:   slot.heureFin,
        title:      emission.title,
        category:   emission.emissionCategories.nodes[0]?.name ?? null,
        image: {
          url: emission.featuredImage?.node.sourceUrl ?? '',
          alt: emission.featuredImage?.node.altText  ?? emission.title,
        },
        uri:        emission.uri,
        excerpt:    emission.excerpt ?? null,
        animateur,
      };
    });
}
