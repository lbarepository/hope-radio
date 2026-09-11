// ─── Slides du hero (option de thème "Home") ─────────────────────────────────
//
// Récupère les slides saisies à la main dans Options du thème > Home > Slides
// (répéteur ACF slides_home exposé manuellement en GraphQL, cf. acf-fields.php).

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SlideHomeImageNode {
  sourceUrl: string | null;
  altText:   string;
}

export interface SlideHomeLinkNode {
  url:    string;
  title:  string | null;
  target: string | null;
}

export interface SlideHomeItemNode {
  titre:       string | null;
  description: string | null;
  image:       SlideHomeImageNode | null;
  lien1:       SlideHomeLinkNode | null;
  lien2:       SlideHomeLinkNode | null;
}

export interface GetSlidesHomeData {
  slidesHome: SlideHomeItemNode[];
}

// ── Query ─────────────────────────────────────────────────────────────────────

export const GET_SLIDES_HOME = /* GraphQL */ `
  query GetSlidesHome {
    slidesHome {
      titre
      description
      image {
        sourceUrl
        altText
      }
      lien1 {
        url
        title
        target
      }
      lien2 {
        url
        title
        target
      }
    }
  }
`;
