import { fetchGraphQL }                                             from '@/lib/wordpress';
import { GET_ACTUALITE_CATEGORIES, GET_ACTUALITES_ARCHIVE }        from '@/graphql/actualites';
import type { GetActualiteCategoriesData, GetActualiteArchiveData } from '@/graphql/actualites';
import { transformActualitesArchive }                              from '@/app/data/actualites/transformer';
import { loadMoreActualites }                                      from './actions';
import ActualitesClient                                            from '@/components/actualites/ActualitesClient';
import { wpTags }                                                  from '@/lib/revalidateTags';

export default async function ActualitesPage() {
  const [categoriesResult, postsResult] = await Promise.allSettled([
    fetchGraphQL<GetActualiteCategoriesData>(
      GET_ACTUALITE_CATEGORIES,
      {},
      { next: { revalidate: 60, tags: [wpTags.actualites] } },
    ),
    fetchGraphQL<GetActualiteArchiveData>(
      GET_ACTUALITES_ARCHIVE,
      { first: 6, after: null, categoryName: null },
      { next: { revalidate: 60, tags: [wpTags.actualites] } },
    ),
  ]);

  const categories =
    categoriesResult.status === 'fulfilled'
      ? categoriesResult.value.categories.nodes
      : [];

  const { cards: initialCards, pageInfo: initialPageInfo } =
    postsResult.status === 'fulfilled'
      ? transformActualitesArchive(postsResult.value)
      : { cards: [], pageInfo: { hasNextPage: false, endCursor: null } };

  return (
    <main className="bg-primary min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-0">
        <h1 className="font-nav font-[900] text-[64px] md:text-[88px] leading-[90%] text-white text-center uppercase mb-10">
          Actualités
        </h1>

        <ActualitesClient
          initialCards={initialCards}
          initialPageInfo={initialPageInfo}
          categories={categories}
          loadMore={loadMoreActualites}
        />
      </div>
    </main>
  );
}
