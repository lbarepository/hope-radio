'use client';

import { useState } from 'react';

import type { AnimateurCard } from '@/app/data';
import AnimateurModal         from '@/components/equipe/AnimateurModal';

interface AnimateurNom {
  prenom: string | null;
  nom:    string | null;
}

interface AnimateurNamesInlineProps {
  noms:   AnimateurNom[];
  equipe: AnimateurCard[];
}

// Le champ ACF `animateurs` d'une émission n'est qu'un répétable prénom/nom
// (pas de relation vers le CPT `animateur`) : on retrouve la fiche complète
// en comparant les noms, insensible à la casse/aux accents.
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

export default function AnimateurNamesInline({ noms, equipe }: AnimateurNamesInlineProps) {
  const [selected, setSelected] = useState<AnimateurCard | null>(null);

  const entries = noms
    .map((n) => `${n.prenom ?? ''} ${n.nom ?? ''}`.trim())
    .filter(Boolean)
    .map((fullName) => ({
      fullName,
      match: equipe.find((a) => normalize(a.nom) === normalize(fullName)) ?? null,
    }));

  if (entries.length === 0) return null;

  return (
    <>
      {entries.map((entry, i) => (
        <span key={`${entry.fullName}-${i}`}>
          {entry.match ? (
            <button
              type="button"
              onClick={() => setSelected(entry.match)}
              className="bg-transparent border-0 p-0 m-0 cursor-pointer underline-offset-2 hover:underline focus-visible:underline"
            >
              {entry.fullName}
            </button>
          ) : (
            entry.fullName
          )}
          {i < entries.length - 1 && ', '}
        </span>
      ))}

      {selected && (
        <AnimateurModal animateur={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
