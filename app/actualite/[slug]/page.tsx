import { notFound }      from 'next/navigation';
import type { Metadata } from 'next';

import { fetchGraphQL }                from '@/lib/wordpress';
import { GET_ACTUALITE_BY_SLUG }       from '@/graphql/actualites';
import type { GetActualiteBySlugData } from '@/graphql/actualites';
import { transformActualiteDetail }    from '@/app/data/actualites/transformer';
import ArticleDetail                   from '@/components/actualites/ArticleDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchGraphQL<GetActualiteBySlugData>(
      GET_ACTUALITE_BY_SLUG,
      { slug },
    );
    return { title: data.post?.title ?? 'Actualité' };
  } catch {
    return { title: 'Actualité' };
  }
}

export default async function ActualitePage({ params }: Props) {
  const { slug } = await params;
  console.log('Fetching actualité with slug:', slug);
  console.log(slug)

  let data: GetActualiteBySlugData;
  try {
    data = await fetchGraphQL<GetActualiteBySlugData>(
      GET_ACTUALITE_BY_SLUG,
      { slug },
      { next: { revalidate: 60 } },
    );
  } catch {
    notFound();
  }

  const article = transformActualiteDetail(data!);
  if (!article) notFound();

  return <ArticleDetail article={article} />;
}
