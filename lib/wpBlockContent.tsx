import type { ReactNode } from 'react';

import EquipeSection from '@/components/equipe/EquipeSection';

/**
 * Remplace les blocs Gutenberg custom par leur vrai composant React dans le
 * HTML rendu (`content`) des pages WordPress génériques (app/[...slug]).
 *
 * Pourquoi : côté WordPress, le render.php de chaque bloc custom n'affiche
 * qu'un placeholder admin (voir CLAUDE.md — principe headless). Ce
 * placeholder ne doit jamais atteindre le visiteur. Mais ce site n'expose
 * pas encore `editorBlocks` via WPGraphQL (schéma structuré des blocs), donc
 * on ne peut pas savoir "quel bloc, où" autrement qu'en repérant, dans le
 * HTML déjà rendu, le marqueur `data-hope-radio-block="<slug>"` que chaque
 * render.php doit poser sur son élément racine (sans <div> imbriqué à
 * l'intérieur — la regex s'arrête au premier `</div>` fermant).
 *
 * Pour brancher un nouveau bloc : ajouter son slug + son composant dans
 * BLOCK_COMPONENTS. Un bloc sans entrée ici reste affiché tel quel (son
 * placeholder admin resterait visible sur le site public — à éviter).
 */
const BLOCK_COMPONENTS: Record<string, (attrs: Record<string, string>) => ReactNode> = {
  equipe: (attrs) => <EquipeSection title={attrs.titre} />,
};

const BLOCK_MARKER_RE = /<div[^>]*\sdata-hope-radio-block="([a-z0-9-]+)"[^>]*>[\s\S]*?<\/div>/g;
const ATTR_RE = /data-([a-z0-9-]+)="([^"]*)"/g;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseAttrs(openingAndInnerHtml: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let m: RegExpExecArray | null;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(openingAndInnerHtml))) {
    if (m[1] === 'hope-radio-block') continue;
    const key = m[1].replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
    attrs[key] = decodeHtmlEntities(m[2]);
  }
  return attrs;
}

export type ContentSegment =
  | { key: string; type: 'html'; html: string }
  | { key: string; type: 'block'; node: ReactNode };

/**
 * Découpe le HTML d'une page WordPress en segments : HTML classique (rendu
 * via dangerouslySetInnerHTML) et blocs custom reconnus (remplacés par leur
 * composant React réel, rendu en dehors du conteneur "article" pour
 * pouvoir être plein écran).
 */
export function splitWpContent(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  let key = 0;

  BLOCK_MARKER_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BLOCK_MARKER_RE.exec(html))) {
    const [full, slug] = match;
    const renderer = BLOCK_COMPONENTS[slug];
    if (!renderer) continue;

    const before = html.slice(lastIndex, match.index);
    if (before.trim()) {
      segments.push({ key: `html-${key++}`, type: 'html', html: before });
    }

    segments.push({ key: `block-${slug}-${key++}`, type: 'block', node: renderer(parseAttrs(full)) });
    lastIndex = match.index + full.length;
  }

  const rest = html.slice(lastIndex);
  if (rest.trim()) {
    segments.push({ key: `html-${key++}`, type: 'html', html: rest });
  }

  return segments;
}
