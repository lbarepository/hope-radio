export interface RadioNode {
  title:         string;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  radioFields?:  { lien: string | null; proxiedUrl: string | null } | null;
}

export interface GetRadiosData {
  radios: { nodes: RadioNode[] };
}

export const GET_RADIOS = /* GraphQL */ `
  query GetRadios($first: Int!) {
    radios(first: $first, where: { status: PUBLISH }) {
      nodes {
        title
        featuredImage { node { sourceUrl altText } }
        radioFields { lien proxiedUrl }
      }
    }
  }
`;
