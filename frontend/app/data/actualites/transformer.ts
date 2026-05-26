// Transformer : réponse WPGraphQL → ActualiteCard[]
//
// Ce fichier est le seul point autorisé à mapper la shape de l'API
// vers le type interne ActualiteCard utilisé par ActualitesSection.

import type { GetActualitesData, GetActualiteArchiveData, ActualitePageInfo, GetActualiteBySlugData } from '@/graphql/actualites';

export type { ActualitePageInfo };

export interface ActualiteArchiveCard {
  id:       string;
  title:    string;
  excerpt:  string;
  category: string;
  image: {
    url: string;
    alt: string;
  };
  uri: string;
}

const FALLBACK_ARCHIVE_IMAGE = 'https://placehold.co/744x380/72004A/FFFFFF?text=Actualite';

export interface ActualiteCard {
  title:    string;   // post_title
  excerpt:  string;   // post_excerpt strippé du HTML
  category: string;   // nom de categories.nodes[0], "" si absent
  image: {
    url: string;      // sourceUrl ou fallback placehold.co
    alt: string;
  };
  uri: string;        // lien vers le post single
}

// ── Helper ────────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE = 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite';

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// ── Transformer ───────────────────────────────────────────────────────────────

export function transformActualites(data: GetActualitesData): ActualiteCard[] {
  return data.posts.nodes.map((node) => ({
    title:    node.title,
    excerpt:  stripHtml(node.excerpt),
    category: node.categories.nodes[0]?.name ?? '',
    image: {
      url: node.featuredImage?.node.sourceUrl ?? FALLBACK_IMAGE,
      alt: node.featuredImage?.node.altText   ?? node.title,
    },
    uri: `/actualite/${node.slug}`,
  }));
}

// ── Single article ────────────────────────────────────────────────────────────

export interface ActualiteDetail {
  title:    string;
  content:  string;
  category: string;
  image: { url: string; alt: string } | null;
  uri:      string;
}

export function transformActualiteDetail(data: GetActualiteBySlugData): ActualiteDetail | null {
  const node = data.post;
  if (!node) return null;
  return {
    title:    node.title,
    content:  node.content ?? '',
    category: node.categories.nodes[0]?.name ?? '',
    image:    node.featuredImage
      ? { url: node.featuredImage.node.sourceUrl, alt: node.featuredImage.node.altText || node.title }
      : null,
    uri: node.uri,
  };
}

export function transformActualitesArchive(data: GetActualiteArchiveData): {
  cards:    ActualiteArchiveCard[];
  pageInfo: ActualitePageInfo;
} {
  const cards = data.posts.nodes.map((node) => ({
    id:       node.id,
    title:    node.title,
    excerpt:  stripHtml(node.excerpt),
    category: node.categories.nodes[0]?.name ?? '',
    image: {
      url: node.featuredImage?.node.sourceUrl ?? FALLBACK_ARCHIVE_IMAGE,
      alt: node.featuredImage?.node.altText   ?? node.title,
    },
    uri: `/actualite/${node.slug}`,
  }));
  return { cards, pageInfo: data.posts.pageInfo };
}
