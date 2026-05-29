import type { MenuItem, TopMenuItem } from './menus';

export interface FooterContact {
  aPropos:   string | null;
  adresse:   string | null;
  telephone: string | null;
  email:     string | null;
  copyright: string | null;
}

export interface FooterTitles {
  titreColonne1:   string | null;
  titreNewsletter: string | null;
}

export interface GetFooterContactResponse {
  footerData: FooterContact | null;
}

export interface GetFooterTitlesResponse {
  footerData: FooterTitles | null;
}

export interface FooterMenu<T> {
  name: string;
  menuItems: { nodes: T[] };
}

export interface GetPartenairesMenuData {
  menus: { nodes: FooterMenu<MenuItem>[] };
}

export interface GetPlusInfosMenuData {
  menus: { nodes: FooterMenu<MenuItem>[] };
}

export interface GetFooterSocialMenuData {
  menus: { nodes: FooterMenu<TopMenuItem>[] };
}

export interface GetFooterLegalMenuData {
  menus: { nodes: FooterMenu<MenuItem>[] };
}

export const GET_FOOTER_CONTACT = /* GraphQL */ `
  query GetFooterContact {
    footerData {
      aPropos
      adresse
      telephone
      email
      copyright
    }
  }
`;

export const GET_FOOTER_TITLES = /* GraphQL */ `
  query GetFooterTitles {
    footerData {
      titreColonne1
      titreNewsletter
    }
  }
`;

export const GET_PARTENAIRES_MENU = /* GraphQL */ `
  query GetPartenairesMenu {
    menus(where: { location: PARTENAIRES }) {
      nodes {
        name
        menuItems {
          nodes {
            id
            label
            url
          }
        }
      }
    }
  }
`;

export const GET_PLUS_INFOS_MENU = /* GraphQL */ `
  query GetPlusInfosMenu {
    menus(where: { location: PLUS_INFOS }) {
      nodes {
        name
        menuItems {
          nodes {
            id
            label
            url
          }
        }
      }
    }
  }
`;

export const GET_FOOTER_LEGAL_MENU = /* GraphQL */ `
  query GetFooterLegalMenu {
    menus(where: { location: FOOTER_LEGAL }) {
      nodes {
        menuItems {
          nodes {
            id
            label
            url
          }
        }
      }
    }
  }
`;

export const GET_FOOTER_SOCIAL_MENU = /* GraphQL */ `
  query GetFooterSocialMenu {
    menus(where: { location: RESEAUX_SOCIAUX }) {
      nodes {
        name
        menuItems {
          nodes {
            id
            label
            url
            topMenuIcon {
              sourceUrl
              altText
            }
            topMenuIconInterne {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;
