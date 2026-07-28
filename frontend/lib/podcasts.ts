import { XMLParser } from 'fast-xml-parser';

export interface PodcastEpisode {
  id:       string;
  title:    string;
  imageUrl: string;
  audioUrl: string;
  pubDate:  string;
  duration: string;
}

export interface PodcastChannel {
  title:    string;
  imageUrl: string;
  episodes: PodcastEpisode[];
}

const parser = new XMLParser({
  ignoreAttributes:    false,
  attributeNamePrefix: '@_',
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function textOf(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && '#text' in value) {
    return String((value as { '#text': unknown })['#text']);
  }
  return '';
}

/**
 * Fetch et parse le flux RSS configuré via RSS_FEED_URL. Rien n'est
 * persisté : le flux est interrogé à chaque affichage (avec cache Next.js).
 */
export async function fetchPodcastChannel(): Promise<PodcastChannel | null> {
  const feedUrl = process.env.RSS_FEED_URL;
  if (!feedUrl) {
    console.error('[podcasts] RSS_FEED_URL non configurée');
    return null;
  }

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const data = parser.parse(xml);
    const channel = data?.rss?.channel;
    if (!channel) throw new Error('Flux RSS invalide : <channel> introuvable');

    const channelImageUrl =
      channel.image?.url ?? channel['itunes:image']?.['@_href'] ?? '';

    const episodes: PodcastEpisode[] = asArray(channel.item).map((item) => ({
      id:       textOf(item.guid) || item.title,
      title:    textOf(item.title),
      imageUrl: item['itunes:image']?.['@_href'] ?? channelImageUrl,
      audioUrl: item.enclosure?.['@_url'] ?? '',
      pubDate:  textOf(item.pubDate),
      duration: textOf(item['itunes:duration']),
    }));

    return {
      title:    textOf(channel.title),
      imageUrl: channelImageUrl,
      episodes,
    };
  } catch (err) {
    console.error('[podcasts] échec du fetch/parse du flux RSS :', err);
    return null;
  }
}
