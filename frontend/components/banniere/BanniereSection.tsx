import dynamic from 'next/dynamic';
import { fetchGraphQL } from '@/lib/wordpress';
import { GET_BANNIERES, type GetBannièresData } from '@/graphql/bannieres';
import { transformBannieres } from '@/app/data';

const BanniereSlider = dynamic(() => import('./BanniereSlider'));

export default async function BanniereSection() {
  let data: GetBannièresData;
  try {
    data = await fetchGraphQL<GetBannièresData>(GET_BANNIERES, {}, { next: { revalidate: 60 } });
  } catch {
    return null;
  }

  const bannieres = transformBannieres(data);
  if (!bannieres.length) return null;

  return <BanniereSlider bannieres={bannieres} />;
}
