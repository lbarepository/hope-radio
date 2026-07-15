import { fetchGraphQL } from '@/lib/wordpress';
import {
  GET_MAIN_MENU,
  GET_TOP_MENU,
  GET_SOCIAL_MENU,
  type GetMainMenuData,
  type GetTopMenuData,
  type GetSocialMenuData,
} from '@/graphql/menus';
import { GET_SITE_LOGO, type SiteLogoData } from '@/graphql/layout';
import HeaderShell from './HeaderShell';
import { wpTags } from '@/lib/revalidateTags';

export default async function Header() {
  const [mainMenuData, topMenuData, logoData, socialMenuData] = await Promise.all([
    fetchGraphQL<GetMainMenuData>(GET_MAIN_MENU, undefined, { next: { tags: [wpTags.menus] } }).catch(() => null),
    fetchGraphQL<GetTopMenuData>(GET_TOP_MENU, undefined, { next: { tags: [wpTags.menus] } }).catch(() => null),
    fetchGraphQL<SiteLogoData>(GET_SITE_LOGO, undefined, { next: { revalidate: 60, tags: [wpTags.menus] } }).catch(() => null),
    fetchGraphQL<GetSocialMenuData>(GET_SOCIAL_MENU, undefined, { next: { tags: [wpTags.menus] } }).catch(() => null),
  ]);

  const mainItems   = mainMenuData?.menuItems.nodes   ?? [];
  const topItems    = topMenuData?.menuItems.nodes    ?? [];
  const logo        = logoData?.customLogo            ?? null;
  const logoInterne = logoData?.customLogoInterne     ?? null;
  const socialItems = socialMenuData?.menuItems.nodes ?? [];

  return (
    <HeaderShell
      mainItems={mainItems}
      topItems={topItems}
      socialItems={socialItems}
      logo={logo}
      logoInterne={logoInterne}
    />
  );
}
