import { XMLParser } from 'fast-xml-parser';

import { fetchGraphQL }             from '@/lib/wordpress';
import { GET_RSS_FEED_URL }         from '@/graphql/podcasts';
import type { GetRssFeedUrlData }   from '@/graphql/podcasts';

export interface PodcastEpisode {
  id:           string;
  title:        string;
  description:  string;
  imageUrl:     string;
  audioUrl:     string;
  pubDate:      string;
  duration:     string;
  emissionSlug: string | null;
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

function truncateToLastSentence(text: string): string {
  const firstPeriod = text.indexOf('.');
  return firstPeriod === -1 ? text : text.slice(0, firstPeriod + 1);
}

/** Formate un nombre de secondes au format d'affichage "mn:ss". */
export function formatSeconds(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Convertit une durée `itunes:duration` (secondes brutes, "mm:ss" ou "hh:mm:ss") en secondes. */
export function parseDurationToSeconds(duration: string): number {
  if (!duration) return 0;

  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0];
}

/**
 * Normalise une durée `itunes:duration` (secondes brutes, "mm:ss" ou "hh:mm:ss")
 * vers le format d'affichage "mn:ss".
 */
export function formatDuration(duration: string): string {
  if (!duration) return '';
  return formatSeconds(parseDurationToSeconds(duration));
}

/**
 * Fetch et parse le flux RSS dont l'URL est configurée dans WordPress
 * (Options du thème → Podcasts → rss_feed_url). Rien n'est persisté :
 * le flux est interrogé à chaque affichage (avec cache Next.js).
 */
export async function fetchPodcastChannel(): Promise<PodcastChannel | null> {
  try {
    const { rssFeedUrl: feedUrl } = await fetchGraphQL<GetRssFeedUrlData>(GET_RSS_FEED_URL);
    if (!feedUrl) {
      console.error('[podcasts] Champ ACF rss_feed_url non configuré (Options du thème → Podcasts)');
      return null;
    }

    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const data = parser.parse(xml);
    const channel = data?.rss?.channel;
    if (!channel) throw new Error('Flux RSS invalide : <channel> introuvable');

    const channelImageUrl =
      channel.image?.url ?? channel['itunes:image']?.['@_href'] ?? '';

    const episodes: PodcastEpisode[] = asArray(channel.item).map((item) => ({
      id:           textOf(item.guid) || item.title,
      title:        textOf(item.title),
      description:  truncateToLastSentence(textOf(item.description).replace(/<[^>]*>/g, '').trim()),
      imageUrl:     item['itunes:image']?.['@_href'] ?? channelImageUrl,
      audioUrl:     item.enclosure?.['@_url'] ?? '',
      pubDate:      textOf(item.pubDate),
      duration:     textOf(item['itunes:duration']),
      emissionSlug: textOf(item['itunes:keywords']).split(',')[0]?.trim() || null,
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

/**
 * Filtre les épisodes rattachés à une émission via le tag `itunes:keywords`
 * (docs/podcasts/podcast-emission.md).
 */
export function getEpisodesForEmission(episodes: PodcastEpisode[], slug: string): PodcastEpisode[] {
  return episodes.filter((episode) => episode.emissionSlug === slug);
}
