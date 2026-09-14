// ─── Équipe (CPT Animateur) ────────────────────────────────────────────────────
//
// Liste tous les animateurs publiés, récupérée automatiquement (aucun lien
// avec un bloc en particulier) pour alimenter la section « L'équipe ».

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AnimateurImageNode {
  sourceUrl: string;
  altText:   string;
}

export interface AnimateurReseauxSociauxNode {
  facebook:  string | null;
  instagram: string | null;
  twitter:   string | null;
  youtube:   string | null;
  tiktok:    string | null;
}

export interface AnimateurInfosNode {
  prenom:         string | null;
  nom:            string | null;
  fonction:       string | null;
  bio:            string | null;
  photo:          { node: AnimateurImageNode } | null;
  reseauxSociaux: AnimateurReseauxSociauxNode | null;
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
          bio
          photo {
            node {
              sourceUrl
              altText
            }
          }
          reseauxSociaux {
            facebook
            instagram
            twitter
            youtube
            tiktok
          }
        }
      }
    }
  }
`;
