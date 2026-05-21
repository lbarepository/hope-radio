// ─── Actualités (Posts natifs) ────────────────────────────────────────────────
//
// Récupère les N derniers posts publiés avec leur image à la une et leurs
// catégories, pour alimenter le composant ActualitesSection sur la home.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ActualiteImageNode {
  sourceUrl: string;
  altText:   string;
}

export interface ActualiteCategoryNode {
  name: string;
  slug: string;
}

export interface ActualiteNode {
  title:         string;
  excerpt:       string | null;   // HTML brut — stripper via stripHtml()
  slug:          string;
  uri:           string;
  featuredImage: { node: ActualiteImageNode } | null;
  categories:    { nodes: ActualiteCategoryNode[] };
}

export interface GetActualitesData {
  posts: {
    nodes: ActualiteNode[];
  };
}

// ── Query ─────────────────────────────────────────────────────────────────────

export const GET_ACTUALITES = /* GraphQL */ `
  query GetActualites($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        title
        excerpt
        slug
        uri
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// ─── Archive Actualités (paginée + filtrable) ──────────────────────────────

export interface ActualiteArchiveNode {
  id:            string;
  databaseId:    number;
  title:         string;
  uri:           string;
  slug:          string;
  excerpt:       string | null;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  categories:    { nodes: { name: string; slug: string }[] };
}

export interface ActualitePageInfo {
  hasNextPage: boolean;
  endCursor:   string | null;
}

export interface GetActualiteArchiveData {
  posts: {
    pageInfo: ActualitePageInfo;
    nodes:    ActualiteArchiveNode[];
  };
}

export interface ActualiteFilterCategory {
  id:   string;
  name: string;
  slug: string;
}

export interface GetActualiteCategoriesData {
  categories: { nodes: ActualiteFilterCategory[] };
}

export const GET_ACTUALITE_CATEGORIES = /* GraphQL */ `
  query GetActualiteCategories {
    categories(first: 100, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export const GET_ACTUALITES_ARCHIVE = /* GraphQL */ `
  query GetActualitesArchive($first: Int!, $after: String, $categoryName: String) {
    posts(
      first: $first
      after: $after
      where: { status: PUBLISH, categoryName: $categoryName }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        uri
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
