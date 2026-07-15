import { notFound }      from 'next/navigation';
import type { Metadata } from 'next';

import { fetchGraphQL }             from '@/lib/wordpress';
import { GET_AGENDA_ITEM_BY_SLUG }  from '@/graphql/agenda';
import type { GetAgendaItemBySlugData } from '@/graphql/agenda';
import { transformAgendaDetail }    from '@/app/data/agenda/transformer';
import ArticleDetail                from '@/components/actualites/ArticleDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchGraphQL<GetAgendaItemBySlugData>(
      GET_AGENDA_ITEM_BY_SLUG,
      { slug },
    );
    return { title: data.agendaItem?.title ?? 'Agenda' };
  } catch {
    return { title: 'Agenda' };
  }
}

export default async function AgendaItemPage({ params }: Props) {
  const { slug } = await params;

  let data: GetAgendaItemBySlugData;
  try {
    data = await fetchGraphQL<GetAgendaItemBySlugData>(
      GET_AGENDA_ITEM_BY_SLUG,
      { slug },
      { next: { revalidate: 60 } },
    );
  } catch {
    notFound();
  }

  const item = transformAgendaDetail(data!);
  if (!item) notFound();

  return (
    <ArticleDetail
      article={{
        title:    item.title,
        content:  item.content,
        category: item.category,
        image:    item.image,
        uri:      `/agenda/${slug}`,
      }}
    />
  );
}
