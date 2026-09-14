import type { GetAnimateursData } from '@/graphql/animateurs';

export interface AnimateurReseaux {
  facebook:  string | null;
  instagram: string | null;
  twitter:   string | null;
  youtube:   string | null;
  tiktok:    string | null;
}

export interface AnimateurCard {
  id:       string;
  nom:      string;
  fonction: string | null;
  bio:      string | null;
  imageUrl: string;
  imageAlt: string;
  reseaux:  AnimateurReseaux;
}

const FALLBACK_IMAGE = 'https://placehold.co/240x240/E45612/FFFFFF?text=%20';

export function transformAnimateurs(data: GetAnimateursData): AnimateurCard[] {
  return data.animateurs.nodes.map((node) => {
    const infos = node.animateurInfos;
    const nom = [infos?.prenom, infos?.nom].filter(Boolean).join(' ').trim() || node.title;
    const image = infos?.photo?.node ?? null;
    const reseaux = infos?.reseauxSociaux ?? null;

    return {
      id:       node.id,
      nom,
      fonction: infos?.fonction ?? null,
      bio:      infos?.bio ?? null,
      imageUrl: image?.sourceUrl ?? FALLBACK_IMAGE,
      imageAlt: image?.altText   || nom,
      reseaux: {
        facebook:  reseaux?.facebook  || null,
        instagram: reseaux?.instagram || null,
        twitter:   reseaux?.twitter   || null,
        youtube:   reseaux?.youtube   || null,
        tiktok:    reseaux?.tiktok    || null,
      },
    };
  });
}
