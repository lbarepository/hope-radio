import Image from 'next/image';
import { normalizeWpImageUrl } from '@/lib/wordpress';
import type { ActualiteDetail } from '@/app/data/actualites/transformer';

interface Props {
  article: ActualiteDetail;
}

export default function ArticleDetail({ article }: Props) {
  return (
    <main className="bg-primary min-h-screen py-16">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {article.image && (
            <div className="w-full lg:w-[465px] shrink-0">
              <Image
                src={normalizeWpImageUrl(article.image.url)}
                alt={article.image.alt}
                width={465}
                height={310}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col" style={{ gap: '30px' }}>
            {article.category && (
              <span className="font-heading font-bold text-[14px] leading-[124%] text-secondary uppercase">
                {article.category}
              </span>
            )}
            <h1 className="font-heading font-bold text-[32px] leading-[100%] text-white m-0">
              {article.title}
            </h1>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

        </div>
      </div>
    </main>
  );
}
