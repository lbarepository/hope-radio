// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgendaCategorie {
  id:   string;
  name: string;
  slug: string;
}

export interface GetAgendaCategoriesData {
  agendaCategories: { nodes: AgendaCategorie[] };
}

export interface AgendaItemNode {
  id:            string;
  title:         string;
  slug:          string;
  content:       string | null;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  agendaCategories: { nodes: { name: string; slug: string }[] };
  // agendaInfos sera disponible après déploiement WP (show_in_graphql sur le groupe ACF)
  agendaInfos?: {
    dateEvenement: string | null;
    lien:          string | null;
  } | null;
}

export interface GetAgendaItemsData {
  agendaItems: { nodes: AgendaItemNode[] };
}

export interface GetAgendaByCategoryData {
  agendaCategorie: {
    agendaItems: { nodes: AgendaItemNode[] };
  } | null;
}

// ─── Fragment ─────────────────────────────────────────────────────────────────

// agendaInfos (dateEvenement, lien) disponible après déploiement de acf-fields.php
// avec show_in_graphql: true sur le groupe agenda
const AGENDA_NODE_FIELDS = `
  id
  title
  slug
  content
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  agendaCategories {
    nodes {
      name
      slug
    }
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_AGENDA_CATEGORIES = `
  query GetAgendaCategories {
    agendaCategories(first: 100, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export const GET_AGENDA_ITEMS = `
  query GetAgendaItems($first: Int!) {
    agendaItems(first: $first, where: { status: PUBLISH }) {
      nodes {
        ${AGENDA_NODE_FIELDS}
      }
    }
  }
`;

export const GET_AGENDA_ITEMS_BY_CATEGORY = `
  query GetAgendaItemsByCategory($first: Int!, $categorySlug: ID!) {
    agendaCategorie(id: $categorySlug, idType: SLUG) {
      agendaItems(first: $first, where: { status: PUBLISH }) {
        nodes {
          ${AGENDA_NODE_FIELDS}
        }
      }
    }
  }
`;
