import Link from 'next/link';
import Image from 'next/image';
import { fetchGraphQL, normalizeMenuUrl, isExternalUrl } from '@/lib/wordpress';
import {
  GET_FOOTER_CONTACT,
  GET_FOOTER_TITLES,
  GET_PARTENAIRES_MENU,
  GET_PLUS_INFOS_MENU,
  GET_FOOTER_SOCIAL_MENU,
  GET_FOOTER_LEGAL_MENU,
  type GetFooterContactResponse,
  type GetFooterTitlesResponse,
  type GetPartenairesMenuData,
  type GetPlusInfosMenuData,
  type GetFooterSocialMenuData,
  type GetFooterLegalMenuData,
} from '@/graphql/footer';

export default async function Footer() {
  const [contactRes, titlesRes, partenairesRes, plusInfosRes, socialRes, legalRes] = await Promise.all([
    fetchGraphQL<GetFooterContactResponse>(GET_FOOTER_CONTACT).catch(() => null),
    fetchGraphQL<GetFooterTitlesResponse>(GET_FOOTER_TITLES).catch(() => null),
    fetchGraphQL<GetPartenairesMenuData>(GET_PARTENAIRES_MENU).catch(() => null),
    fetchGraphQL<GetPlusInfosMenuData>(GET_PLUS_INFOS_MENU).catch(() => null),
    fetchGraphQL<GetFooterSocialMenuData>(GET_FOOTER_SOCIAL_MENU).catch(() => null),
    fetchGraphQL<GetFooterLegalMenuData>(GET_FOOTER_LEGAL_MENU).catch(() => null),
  ]);

  const footer          = contactRes?.footerData ?? null;
  const titles          = titlesRes?.footerData  ?? null;
  const partenairesMenu = partenairesRes?.menus.nodes[0] ?? null;
  const plusInfosMenu   = plusInfosRes?.menus.nodes[0]   ?? null;
  const sociauxMenu     = socialRes?.menus.nodes[0]      ?? null;
  const partenaires     = partenairesMenu?.menuItems.nodes ?? [];
  const plusInfos       = plusInfosMenu?.menuItems.nodes   ?? [];
  const sociaux         = sociauxMenu?.menuItems.nodes     ?? [];
  const legalLinks      = legalRes?.menus.nodes[0]?.menuItems.nodes ?? [];

  return (
    <footer className="bg-white">
      <div className="container pb-12 pt-10 md:pt-[60px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-10">

          {/* Colonne 1 — Infos Hope Radio */}
          <div className="flex flex-col gap-3">
            <p className="font-heading text-[14px] font-bold leading-[124%] text-primary">
              {titles?.titreColonne1 ?? 'Hope Radio'}
            </p>
            {footer?.aPropos && (
              <div className="font-poppins text-[12px] leading-[140%] text-black">
                {footer.aPropos}
              </div>
            )}
            {footer?.adresse && (
              <div className="font-heading text-[12px] font-bold leading-[116%] text-[#31251A]">
                {footer.adresse} <br />
                {footer?.telephone && (
                  <>
                    {footer.telephone}
                    <br />
                  </>
                )}
                {footer?.email && (
                  <a
                    href={`mailto:${footer.email}`}
                    className="font-heading text-[12px] font-bold leading-[116%] text-[#31251A] hover:underline"
                  >
                    {footer.email}
                  </a>
                )}
              </div>
            )}
          
           
            
          </div>

          {/* Colonne 2 — Menu Partenaires */}
          <div className="flex flex-col gap-3">
            <p className="font-heading text-[14px] font-bold leading-[124%] text-primary">
              {partenairesMenu?.name ?? 'Partenaires'}
            </p>
            <ul className="flex flex-col">
              {partenaires.map((item) => (
                <li key={item.id}>
                  <Link
                    href={normalizeMenuUrl(item.url)}
                    className="font-poppins text-[14px] font-bold leading-[140%] text-black hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Menu Plus d'infos */}
          <div className="flex flex-col gap-3">
            <p className="font-heading text-[14px] font-bold leading-[124%] text-primary">
              {plusInfosMenu?.name ?? "Plus d'infos"}
            </p>
            <ul className="flex flex-col">
              {plusInfos.map((item) => (
                <li key={item.id}>
                  <Link
                    href={normalizeMenuUrl(item.url)}
                    className="font-poppins text-[14px] font-bold leading-[140%] text-black hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 — Newsletter + Réseaux sociaux */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-heading text-[14px] font-bold leading-[124%] text-primary">
                {titles?.titreNewsletter ?? 'Inscription newsletter'}
              </p>
              <form className="flex justify-between gap-2 bg-gray-100">
                <input
                  type="email"
                  placeholder="Renseignez votre email"
                  className="rounded border-gray-200 px-3 py-2 text-[12px] w-10/12 outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-[12px] font-bold cursor-pointer font-bold hover:opacity-90"
                >
                  OK
                </button>
              </form>
            </div>

            {sociaux.length > 0 && (
              <div className="flex flex-col gap-3">
              
                <ul className="flex flex-wrap gap-3">
                  {sociaux.map((item) => {
                    const icone = item.topMenuIconInterne ?? item.topMenuIcon;
                    if (!icone?.sourceUrl) return null;
                    const external = isExternalUrl(item.url);
                    return (
                      <li key={item.id}>
                        <Link
                          href={normalizeMenuUrl(item.url)}
                          aria-label={item.label}
                          className="flex items-center"
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          <Image
                            src={icone.sourceUrl}
                            alt={icone.altText || item.label}
                            width={24}
                            height={24}
                            className="h-[24px] w-[24px] shrink-0"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Barre copyright */}
      <div className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <p className="text-[12px] font-normal leading-[20px] text-black">
            {footer?.copyright ?? '© Tous droits réservés.'}
          </p>
          {legalLinks.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {legalLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={normalizeMenuUrl(item.url)}
                    className="text-[12px] font-normal leading-[20px] text-black hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
