import type { GetClipsData } from '@/graphql/clips';

export interface ClipCard {
  title:    string;
  imageUrl: string;
  imageAlt: string;
  clipUrl:  string;
}

const FALLBACK_IMAGE = 'https://placehold.co/400x600/72004A/FFFFFF?text=Clip';

export function transformClips(data: GetClipsData): ClipCard[] {
  return data.clips.nodes
    .filter((node) => !!node.clipFields?.clipUrl)
    .map((node) => ({
      title:    node.title,
      imageUrl: node.featuredImage?.node.sourceUrl ?? FALLBACK_IMAGE,
      imageAlt: node.featuredImage?.node.altText   ?? node.title,
      clipUrl:  node.clipFields!.clipUrl!,
    }));
}
