// Transformer : réponse WPGraphQL → HeroSlide[]
//
// Ce fichier est le seul point de la codebase autorisé à mapper la shape
// de l'API vers le type interne HeroSlide utilisé par HeroSlider.
// Les mocks (mock-slides-home.ts) restent fidèles à la réponse API brute.

import type { GetSlidesHomeData, SlideHomeLinkNode } from '@/graphql/hero';
import { normalizeWpImageUrl } from '@/lib/wordpress';

export interface HeroSlideLink {
  url:    string;
  label:  string | null;
  target: string | null;
}

export interface HeroSlide {
  id:          string;
  title:       string;
  description: string;
  imageUrl:    string | null;
  link1:       HeroSlideLink | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function transformLink(link: SlideHomeLinkNode | null): HeroSlideLink | null {
  if (!link?.url) return null;
  return {
    url:    link.url,
    label:  link.title  ?? null,
    target: link.target ?? null,
  };
}

// ── Transformer principal ─────────────────────────────────────────────────────

export function transformSlidesHome(data: GetSlidesHomeData): HeroSlide[] {
  return data.slidesHome.map((item, index) => ({
    id:          `slide-home-${index}`,
    title:       item.titre ?? '',
    description: item.description ?? '',
    imageUrl:    item.image?.sourceUrl ? normalizeWpImageUrl(item.image.sourceUrl) : null,
    link1:       transformLink(item.lien1),
  }));
}
