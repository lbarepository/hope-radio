import { notFound }      from 'next/navigation';
import type { Metadata } from 'next';

import { fetchGraphQL }   from '@/lib/wordpress';
import { wpTags }         from '@/lib/revalidateTags';
import { splitWpContent } from '@/lib/wpBlockContent';

interface WpPage {
  title:   string;
  content: string | null;
}

interface GetPageByUriData {
  pageBy: WpPage | null;
}

const GET_PAGE_BY_URI = /* GraphQL */ `
  query GetPageByUri($uri: String!) {
    pageBy(uri: $uri) {
      title
      content
    }
  }
`;

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uri = '/' + slug.join('/');
  try {
    const data = await fetchGraphQL<GetPageByUriData>(
      GET_PAGE_BY_URI,
      { uri },
      { next: { tags: [wpTags.page(uri)] } },
    );
    return { title: data.pageBy?.title ?? 'Hope Radio' };
  } catch {
    return { title: 'Hope Radio' };
  }
}

export default async function WpPage({ params }: Props) {
  const { slug } = await params;
  const uri = '/' + slug.join('/');

  let page: WpPage | null = null;
  try {
    const data = await fetchGraphQL<GetPageByUriData>(
      GET_PAGE_BY_URI,
      { uri },
      { next: { tags: [wpTags.page(uri)] } },
    );
    page = data.pageBy;
  } catch {
    // WP indisponible
  }

  if (!page) notFound();

  // Les blocs Gutenberg custom reconnus (ex. hope-radio/equipe) sont extraits
  // du HTML et rendus par leur vrai composant React, en dehors du conteneur
  // "article" (pour pouvoir être plein écran) — voir lib/wpBlockContent.
  const segments = page.content ? splitWpContent(page.content) : [];

  return (
    <main className="min-h-screen bg-white">
      {/* <div className="container">
        <h1 className="font-heading text-[40px] md:text-[56px] font-bold leading-[110%] text-primary mb-10">
          {page.title}
        </h1>
      </div> */}
      {segments.map((segment) =>
        segment.type === 'html' ? (
          <div key={segment.key} className="container">
            <div
              className="article-content article-content--light max-w-[720px]"
              dangerouslySetInnerHTML={{ __html: segment.html }}
            />
          </div>
        ) : (
          <div key={segment.key}>{segment.node}</div>
        ),
      )}
    </main>
  );
}
