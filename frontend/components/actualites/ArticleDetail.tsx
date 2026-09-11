import Image from 'next/image';
import Link  from 'next/link';
import { normalizeWpImageUrl, isExternalUrl } from '@/lib/wordpress';
import type { ActualiteDetail } from '@/app/data/actualites/transformer';

const BUTTON_CN = 'font-button font-semibold inline-flex items-center justify-center self-start rounded-[30px] bg-secondary text-white text-sm h-[44px] px-6 whitespace-nowrap hover:bg-secondary/90 transition-colors no-underline';

// N'autorise que les liens http(s), relatifs ou ancres — rejette javascript:, data:, vbscript:, etc.
function isSafeHref(url: string): boolean {
  return /^(https?:\/\/|\/|#)/i.test(url.trim());
}

interface Props {
  article: ActualiteDetail;
}

export default function ArticleDetail({ article }: Props) {
  return (
    <main className="bg-primary min-h-screen py-16">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {article.image && (
            <div className="relative w-full lg:w-[465px] lg:h-[465px] aspect-square lg:aspect-auto shrink-0 rounded-[20px] overflow-hidden">
              <Image
                src={normalizeWpImageUrl(article.image.url)}
                alt={article.image.alt}
                fill
                className="object-cover"
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
            {article.lien && isSafeHref(article.lien) && (
              isExternalUrl(article.lien) ? (
                <a
                  href={article.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={BUTTON_CN}
                >
                  En savoir plus
                </a>
              ) : (
                <Link href={article.lien} className={BUTTON_CN}>
                  En savoir plus
                </Link>
              )
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
