export interface FaqItem {
  question: string;
  reponse:  string;
}

export interface FaqData {
  label:       string | null;
  description: string | null;
  items:       FaqItem[];
}

export interface GetFaqData {
  faqData: FaqData | null;
}

export const GET_FAQ = /* GraphQL */ `
  query GetFaq {
    faqData {
      label
      description
      items {
        question
        reponse
      }
    }
  }
`;
