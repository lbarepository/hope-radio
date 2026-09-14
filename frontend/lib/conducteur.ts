// Historique des titres diffusés — lit le flux "Conducteur" du diffuseur
// (même famille de service que /api/radio-meta, mais pour l'historique plutôt
// que le titre en cours). Format XML propriétaire, non documenté : chaque
// <Evt> est un slot d'un buffer tournant, potentiellement vide (Timing
// sentinelle "30/12/1899") lorsque le buffer n'est pas encore plein.

import { XMLParser } from 'fast-xml-parser';

const CONDUCTEUR_URL = 'http://hoperadiofrance.fr/meta/Conducteur.xml';
const COVER_BASE = 'http://hoperadiofrance.fr/meta/img/';

export interface ConducteurTrack {
  id: string;
  time: string;
  titre: string;
  artiste: string;
  album: string;
  coverUrl: string | null;
}

// parseTagValue: false — Morceau est un code à zéros initiaux ("00000807") :
// le parsing numérique par défaut de fast-xml-parser le tronquerait en 807.
const parser = new XMLParser({ parseTagValue: false });

function textOf(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

// Les champs texte sont encodés en URI component (%20, %2C, …) côté diffuseur.
function decodeField(raw: string): string {
  if (!raw) return '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

interface RawEvt {
  Timing?: unknown;
  Morceau?: unknown;
  Titre?: unknown;
  Artiste?: unknown;
  Album?: unknown;
}

function parseConducteurXml(xml: string): ConducteurTrack[] {
  const data = parser.parse(xml) as { Conducteur?: { Evt?: RawEvt | RawEvt[] } };
  const events = asArray(data?.Conducteur?.Evt);

  const parsed = events
    .map((evt) => {
      const timing = textOf(evt.Timing);
      const timingMatch = timing.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
      return {
        timingMatch,
        morceau: textOf(evt.Morceau),
        titre: decodeField(textOf(evt.Titre)),
        artiste: decodeField(textOf(evt.Artiste)),
        album: decodeField(textOf(evt.Album)),
      };
    })
    .filter((t) =>
      t.titre &&
      t.timingMatch &&
      // Slot vide (buffer pas encore plein) : Timing sentinelle 30/12/1899.
      t.timingMatch[3] !== '1899',
    );
    // Pas de filtre sur le code Morceau : le flux sert de journal de diffusion
    // général (morceaux musicaux ET chroniques/rubriques de l'automate, ex.
    // "RUB02220"), toutes ces entrées doivent apparaître dans la liste.

  return parsed
    .sort((a, b) => {
      const [, dA, moA, yA, hA, miA, sA] = a.timingMatch!;
      const [, dB, moB, yB, hB, miB, sB] = b.timingMatch!;
      return `${yB}${moB}${dB}${hB}${miB}${sB}`.localeCompare(`${yA}${moA}${dA}${hA}${miA}${sA}`);
    })
    .map((t) => {
      const [full, , , , hour, minute] = t.timingMatch!;
      return {
        id: `${full}-${t.morceau || t.titre}`,
        time: `${parseInt(hour, 10)}h${minute}`,
        titre: t.titre,
        artiste: t.artiste,
        album: t.album,
        coverUrl: t.morceau ? `${COVER_BASE}${t.morceau}.jpg` : null,
      };
    });
}

export async function fetchConducteurTracks(): Promise<ConducteurTrack[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(CONDUCTEUR_URL, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    return parseConducteurXml(await res.text());
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
