import type { GetEmissionsData, GetEmissionBySlugData } from '@/graphql/emissions';

export interface EmissionCard {
  id:        string;
  title:     string;
  category:  string | null;
  image:     { url: string; alt: string };
  uri:       string;
  excerpt:   string | null;
  animateur: string | null;
}

export interface EmissionPageInfo {
  hasNextPage: boolean;
  endCursor:   string | null;
}

export function transformEmissions(data: GetEmissionsData): {
  cards:    EmissionCard[];
  pageInfo: EmissionPageInfo;
} {
  const cards = data.emissions.nodes.map((node) => {
    const animateurNode = node.animateurs?.[0];
    const animateur = animateurNode
      ? `${animateurNode.prenom} ${animateurNode.nom}`.trim()
      : null;
    return {
      id:       node.id,
      title:    node.title,
      category: node.emissionCategories.nodes[0]?.name ?? null,
      image: {
        url: node.featuredImage?.node.sourceUrl ?? '',
        alt: node.featuredImage?.node.altText   ?? node.title,
      },
      uri:       node.uri,
      excerpt:   node.excerpt ?? null,
      animateur,
    };
  });
  return {
    cards,
    pageInfo: {
      hasNextPage: data.emissions.pageInfo.hasNextPage,
      endCursor:   data.emissions.pageInfo.endCursor,
    },
  };
}

// ─── Single emission ──────────────────────────────────────────────────────────

export interface EmissionDetail {
  title:      string;
  slug:       string;
  uri:        string;
  content:    string;
  excerpt:    string;
  animateurs: string;
  category:   string | null;
  image:      { url: string; alt: string } | null;
}

export function transformEmissionDetail(data: GetEmissionBySlugData): EmissionDetail | null {
  const node = data.emission;
  if (!node) return null;

  const animateurs = node.animateurs
    .map((a) => `${a.prenom} ${a.nom}`.trim())
    .filter(Boolean)
    .join(', ');

  return {
    title:      node.title,
    slug:       node.slug,
    uri:        node.uri,
    content:    node.content  ?? '',
    excerpt:    node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '').trim() : '',
    animateurs,
    category:   node.emissionCategories.nodes[0]?.name ?? null,
    image:      node.featuredImage
      ? { url: node.featuredImage.node.sourceUrl, alt: node.featuredImage.node.altText || node.title }
      : null,
  };
}
