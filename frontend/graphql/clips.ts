// ─── Clips à la une ────────────────────────────────────────────────────────────
//
// Récupère les N clips publiés avec image à la une et URL de vidéo (ACF),
// pour alimenter le composant ClipsSection sur la home.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ClipNode {
  title:         string;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  clipFields?: {
    clipUrl: string | null;
  } | null;
}

export interface GetClipsData {
  clips: {
    nodes: ClipNode[];
  };
}

// ── Query ─────────────────────────────────────────────────────────────────────

export const GET_CLIPS = /* GraphQL */ `
  query GetClips($first: Int!) {
    clips(first: $first, where: { status: PUBLISH }) {
      nodes {
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        clipFields {
          clipUrl
        }
      }
    }
  }
`;
