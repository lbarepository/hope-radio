import { fetchGraphQL }                                     from '@/lib/wordpress';
import { GET_AGENDA_CATEGORIES, GET_AGENDA_ITEMS }          from '@/graphql/agenda';
import type { GetAgendaCategoriesData, GetAgendaItemsData } from '@/graphql/agenda';
import { transformAgendaItems }                             from '@/app/data/agenda/transformer';
import { loadAgendaByCategory }                             from './actions';
import AgendaSlider                                         from '@/components/agenda/AgendaSlider';
import { wpTags }                                           from '@/lib/revalidateTags';

export default async function AgendaPage() {
  const [categoriesResult, itemsResult] = await Promise.allSettled([
    fetchGraphQL<GetAgendaCategoriesData>(
      GET_AGENDA_CATEGORIES,
      {},
      { next: { revalidate: 60, tags: [wpTags.agendaList] } },
    ),
    fetchGraphQL<GetAgendaItemsData>(
      GET_AGENDA_ITEMS,
      { first: 100 },
      { next: { revalidate: 60, tags: [wpTags.agendaList] } },
    ),
  ]);

  const categories =
    categoriesResult.status === 'fulfilled'
      ? categoriesResult.value.agendaCategories.nodes
      : [];

  const initialItems =
    itemsResult.status === 'fulfilled'
      ? transformAgendaItems(itemsResult.value)
      : [];

  return (
    <main className="min-h-screen py-16" style={{ background: '#72004A' }}>
      <div className="max-w-[1139px] mx-auto">
        <h1 className="font-nav font-bold text-[64px] md:text-[88px] leading-[90%] text-white text-center uppercase mb-10">
          Agenda
        </h1>
      </div>

      <AgendaSlider
        initialItems={initialItems}
        categories={categories}
        loadByCategory={loadAgendaByCategory}
      />
    </main>
  );
}
