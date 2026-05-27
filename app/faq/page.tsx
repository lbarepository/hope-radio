import type { Metadata } from 'next';

import { fetchGraphQL }    from '@/lib/wordpress';
import { GET_FAQ }         from '@/graphql/faq';
import type { GetFaqData } from '@/graphql/faq';

export const revalidate = 0;
import FaqAccordion       from '@/components/faq/FaqAccordion';

export const metadata: Metadata = { title: 'FAQ — Hope Radio' };

export default async function FaqPage() {
  let faqData: GetFaqData['faqData'] = null;
  try {
    const data = await fetchGraphQL<GetFaqData>(
      GET_FAQ,
      {},
      { cache: 'no-store' },
    );
    faqData = data.faqData;
  } catch {
    // WP indisponible — on affiche une page vide
  }

  const label       = faqData?.label       ?? '';
  const description = faqData?.description ?? '';
  const items       = faqData?.items       ?? [];

  return (
    <main className="min-h-screen py-16 bg-primary bg-[url('/images/slider-bg.png')] bg-repeat">
      <div className="max-w-[1139px] mx-auto px-6">

        <h1 className="font-nav font-bold text-[64px] md:text-[88px] leading-[90%] text-white text-center uppercase mb-10">
          FAQ
        </h1>

        {(label || description) && (
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {label && (
              <div className="md:w-1/3 font-nav font-bold text-[32px] leading-[100%] text-white uppercase">
                {label}
              </div>
            )}
            {description && (
              <div className="md:w-2/3 font-heading font-bold text-[16px] leading-[25px] text-white">
                {description}
              </div>
            )}
          </div>
        )}

        <FaqAccordion items={items} />

      </div>
    </main>
  );
}
