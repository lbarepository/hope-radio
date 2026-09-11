import dynamic from 'next/dynamic';
import { fetchGraphQL } from '@/lib/wordpress';
import { GET_SLIDES_HOME, type GetSlidesHomeData } from '@/graphql/hero';
import { transformSlidesHome } from '@/app/data';
import { wpTags } from '@/lib/revalidateTags';

const HeroSlider = dynamic(() => import('./HeroSlider'));

export default async function HeroSection() {
  let data: GetSlidesHomeData;
  try {
    data = await fetchGraphQL<GetSlidesHomeData>(
      GET_SLIDES_HOME,
      {},
      { next: { revalidate: 60, tags: [wpTags.slidesHome] } },
    );
  } catch {
    return null;
  }

  const slides = transformSlidesHome(data);
  if (!slides.length) return null;

  return <HeroSlider slides={slides} />;
}
