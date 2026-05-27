import type {
  GetAgendaItemsData,
  GetAgendaByCategoryData,
  GetAgendaItemBySlugData,
  AgendaItemNode,
} from '@/graphql/agenda';

export interface AgendaCard {
  id:       string;
  slug:     string;
  title:    string;
  date:     string | null;
  excerpt:  string;
  lien:     string | null;
  image:    { url: string; alt: string } | null;
  category: string | null;
}

export interface AgendaDetail {
  title:    string;
  content:  string;
  category: string;
  date:     string | null;
  lien:     string | null;
  image:    { url: string; alt: string } | null;
}

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDate(raw: string | null): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function nodeToCard(node: AgendaItemNode): AgendaCard {
  return {
    id:       node.id,
    slug:     node.slug,
    title:    node.title,
    date:     formatDate(node.agendaInfos?.dateEvenement ?? null),
    excerpt:  stripHtml(node.content),
    lien:     node.agendaInfos?.lien ?? null,
    image:    node.featuredImage
      ? { url: node.featuredImage.node.sourceUrl, alt: node.featuredImage.node.altText || node.title }
      : null,
    category: node.agendaCategories.nodes[0]?.name ?? null,
  };
}

export function transformAgendaItems(data: GetAgendaItemsData): AgendaCard[] {
  return data.agendaItems.nodes.map(nodeToCard);
}

export function transformAgendaByCategory(data: GetAgendaByCategoryData): AgendaCard[] {
  return data.agendaCategorie?.agendaItems.nodes.map(nodeToCard) ?? [];
}

export function transformAgendaDetail(data: GetAgendaItemBySlugData): AgendaDetail | null {
  const node = data.agendaItem;
  if (!node) return null;
  return {
    title:    node.title,
    content:  node.content ?? '',
    category: node.agendaCategories.nodes[0]?.name ?? '',
    date:     formatDate(node.agendaInfos?.dateEvenement ?? null),
    lien:     node.agendaInfos?.lien ?? null,
    image:    node.featuredImage
      ? { url: node.featuredImage.node.sourceUrl, alt: node.featuredImage.node.altText || node.title }
      : null,
  };
}
