import { notFound }      from 'next/navigation';
import type { Metadata } from 'next';

import { fetchGraphQL }  from '@/lib/wordpress';
import { wpTags }        from '@/lib/revalidateTags';

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

  return (
    <main className="min-h-screen bg-white">
      <div className="container">
        {/* <h1 className="font-heading text-[40px] md:text-[56px] font-bold leading-[110%] text-primary mb-10">
          {page.title}
        </h1> */}
        {page.content && (
          <div
            className="article-content article-content--light max-w-[720px]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </div>
    </main>
  );
}
