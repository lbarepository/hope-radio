// ─── Équipe (CPT Animateur) ────────────────────────────────────────────────────
//
// Liste tous les animateurs publiés, récupérée automatiquement (aucun lien
// avec un bloc en particulier) pour alimenter la section « L'équipe ».

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AnimateurImageNode {
  sourceUrl: string;
  altText:   string;
}

export interface AnimateurInfosNode {
  prenom:   string | null;
  nom:      string | null;
  fonction: string | null;
  photo:    { node: AnimateurImageNode } | null;
}

export interface AnimateurNode {
  id:             string;
  title:          string;
  animateurInfos: AnimateurInfosNode | null;
}

export interface GetAnimateursData {
  animateurs: { nodes: AnimateurNode[] };
}

// ── Query ─────────────────────────────────────────────────────────────────────

export const GET_ANIMATEURS = /* GraphQL */ `
  query GetAnimateurs($first: Int!) {
    animateurs(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        title
        animateurInfos {
          prenom
          nom
          fonction
          photo {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;
