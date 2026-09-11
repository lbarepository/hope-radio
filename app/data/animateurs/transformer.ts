import type { GetAnimateursData } from '@/graphql/animateurs';

export interface AnimateurCard {
  id:       string;
  nom:      string;
  fonction: string | null;
  imageUrl: string;
  imageAlt: string;
}

const FALLBACK_IMAGE = 'https://placehold.co/240x240/E45612/FFFFFF?text=%20';

export function transformAnimateurs(data: GetAnimateursData): AnimateurCard[] {
  return data.animateurs.nodes.map((node) => {
    const infos = node.animateurInfos;
    const nom = [infos?.prenom, infos?.nom].filter(Boolean).join(' ').trim() || node.title;
    const image = infos?.photo?.node ?? node.featuredImage?.node ?? null;

    return {
      id:       node.id,
      nom,
      fonction: infos?.fonction ?? null,
      imageUrl: image?.sourceUrl ?? FALLBACK_IMAGE,
      imageAlt: image?.altText   || nom,
    };
  });
}
