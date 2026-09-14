import { fetchGraphQL }                                           from '@/lib/wordpress';
import { GET_EMISSION_CATEGORIES, GET_EMISSIONS_ALL }             from '@/graphql/emissions';
import type { GetEmissionCategoriesData, GetEmissionsData }       from '@/graphql/emissions';
import { GET_ANIMATEURS }                                         from '@/graphql/animateurs';
import type { GetAnimateursData }                                 from '@/graphql/animateurs';
import { transformEmissions, transformAnimateurs }                from '@/app/data';
import type { AnimateurCard }                                     from '@/app/data';
import { loadMoreEmissions }                                      from './actions';
import EmissionsClient                                            from '@/components/emissions/EmissionsClient';
import { wpTags }                                                 from '@/lib/revalidateTags';

export default async function EmissionsPage() {
  const [categoriesResult, emissionsResult, animateursResult] = await Promise.allSettled([
    fetchGraphQL<GetEmissionCategoriesData>(
      GET_EMISSION_CATEGORIES,
      {},
      { next: { revalidate: 60, tags: [wpTags.emissions] } },
    ),
    fetchGraphQL<GetEmissionsData>(
      GET_EMISSIONS_ALL,
      { first: 4, after: null },
      { next: { revalidate: 60, tags: [wpTags.emissions] } },
    ),
    fetchGraphQL<GetAnimateursData>(
      GET_ANIMATEURS,
      { first: 50 },
      { next: { revalidate: 60, tags: [wpTags.animateurs] } },
    ),
  ]);

  const categories =
    categoriesResult.status === 'fulfilled'
      ? categoriesResult.value.emissionCategories.nodes
      : [];

  const { cards: initialCards, pageInfo: initialPageInfo } =
    emissionsResult.status === 'fulfilled'
      ? transformEmissions(emissionsResult.value)
      : { cards: [], pageInfo: { hasNextPage: false, endCursor: null } };

  const equipe: AnimateurCard[] =
    animateursResult.status === 'fulfilled' ? transformAnimateurs(animateursResult.value) : [];

  return (
    <main className="bg-secondary min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-0">
        <h1 className="font-nav font-[900] text-[64px] md:text-[88px] leading-[90%] text-white text-center uppercase mb-10">
          Émissions
        </h1>

        <EmissionsClient
          initialCards={initialCards}
          initialPageInfo={initialPageInfo}
          categories={categories}
          loadMore={loadMoreEmissions}
          equipe={equipe}
        />
      </div>
    </main>
  );
}
