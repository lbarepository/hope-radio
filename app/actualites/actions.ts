'use server';

import { fetchGraphQL }                                                        from '@/lib/wordpress';
import { GET_ACTUALITES_ARCHIVE }                                              from '@/graphql/actualites';
import type { GetActualiteArchiveData }                                        from '@/graphql/actualites';
import { transformActualitesArchive }                                          from '@/app/data/actualites/transformer';
import type { ActualiteArchiveCard, ActualitePageInfo }                        from '@/app/data/actualites/transformer';

const PAGE_SIZE = 6;

export async function loadMoreActualites(
  cursor:       string | null,
  categorySlug: string | null,
): Promise<{ cards: ActualiteArchiveCard[]; pageInfo: ActualitePageInfo }> {
  const variables: Record<string, unknown> = {
    first:        PAGE_SIZE,
    after:        cursor ?? null,
    categoryName: categorySlug ?? null,
  };

  const data = await fetchGraphQL<GetActualiteArchiveData>(GET_ACTUALITES_ARCHIVE, variables, {
    cache: 'no-store',
  });

  return transformActualitesArchive(data);
}
