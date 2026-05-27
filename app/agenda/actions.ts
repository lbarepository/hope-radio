'use server';

import { fetchGraphQL }                                from '@/lib/wordpress';
import { GET_AGENDA_ITEMS, GET_AGENDA_ITEMS_BY_CATEGORY } from '@/graphql/agenda';
import type { GetAgendaItemsData, GetAgendaByCategoryData } from '@/graphql/agenda';
import { transformAgendaItems, transformAgendaByCategory } from '@/app/data/agenda/transformer';
import type { AgendaCard } from '@/app/data/agenda/transformer';

const MAX_ITEMS = 100;

export async function loadAgendaByCategory(
  categorySlug: string | null,
): Promise<AgendaCard[]> {
  if (!categorySlug) {
    const data = await fetchGraphQL<GetAgendaItemsData>(
      GET_AGENDA_ITEMS,
      { first: MAX_ITEMS },
      { cache: 'no-store' },
    );
    return transformAgendaItems(data);
  }

  const data = await fetchGraphQL<GetAgendaByCategoryData>(
    GET_AGENDA_ITEMS_BY_CATEGORY,
    { first: MAX_ITEMS, categorySlug },
    { cache: 'no-store' },
  );
  return transformAgendaByCategory(data);
}
