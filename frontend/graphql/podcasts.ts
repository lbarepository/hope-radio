// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetRssFeedUrlData {
  rssFeedUrl: string | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_RSS_FEED_URL = `
  query GetRssFeedUrl {
    rssFeedUrl
  }
`;
