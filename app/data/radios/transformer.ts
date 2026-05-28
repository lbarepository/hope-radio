import type { GetRadiosData } from '@/graphql/radios';

export interface RadioCard {
  title:      string;
  imageUrl:   string;
  imageAlt:   string;
  streamUrl:  string;
}

const FALLBACK_IMAGE = 'https://placehold.co/289x400/72004A/FFFFFF?text=Radio';

export function transformRadios(data: GetRadiosData): RadioCard[] {
  return data.radios.nodes
    .filter((node) => !!(node.radioFields?.proxiedUrl ?? node.radioFields?.lien))
    .map((node) => ({
      title:     node.title,
      imageUrl:  node.featuredImage?.node.sourceUrl ?? FALLBACK_IMAGE,
      imageAlt:  node.featuredImage?.node.altText   ?? node.title,
      streamUrl: (node.radioFields?.proxiedUrl ?? node.radioFields?.lien)!,
    }));
}
