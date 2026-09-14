'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

import { normalizeWpImageUrl } from '@/lib/wordpress';
import type { AnimateurCard } from '@/app/data';

interface AnimateurModalProps {
  animateur: AnimateurCard;
  onClose: () => void;
}

// Les liens réseaux sociaux viennent d'un champ ACF `url` saisi par l'admin WP :
// on ne garde que les schémas http(s) avant de les rendre dans un `href`.
function safeHttpUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

const RESEAUX = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.198-4.354-2.618-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.6 5.82c-1.01-.88-1.6-2.15-1.6-3.55h-3.14v13.6c0 1.55-1.26 2.8-2.8 2.8a2.8 2.8 0 01-2.8-2.8 2.8 2.8 0 012.8-2.8c.29 0 .57.04.83.13V9.99c-.27-.04-.55-.06-.83-.06A6.14 6.14 0 000 16.07a6.14 6.14 0 006.06 6.13 6.14 6.14 0 006.13-6.13V9.03a9.3 9.3 0 005.44 1.75V7.65c-.99 0-1.94-.31-2.73-.83-.11-.07-.21-.14-.3-.22z" />
      </svg>
    ),
  },
] as const;

export default function AnimateurModal({ animateur, onClose }: AnimateurModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const liens = RESEAUX
    .map((r) => ({ ...r, href: safeHttpUrl(animateur.reseaux[r.id as keyof typeof animateur.reseaux]) }))
    .filter((r) => !!r.href);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={animateur.nom}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Carte */}
      <div
        className="relative z-10 flex flex-col md:flex-row w-full max-w-[720px] max-h-[90vh] overflow-y-auto md:overflow-visible bg-white rounded-[20px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Photo */}
        <div className="relative w-full h-[220px] md:h-auto md:w-[260px] shrink-0 bg-secondary rounded-t-[20px] md:rounded-t-none md:rounded-l-[20px] overflow-hidden">
          <Image
            src={normalizeWpImageUrl(animateur.imageUrl)}
            alt={animateur.imageAlt}
            fill
            sizes="(min-width: 768px) 260px, 100vw"
            className="object-cover object-top"
          />
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-4 p-6 md:p-8 md:pr-12">
          <div>
            <h3 className="font-nav font-[900] text-primary text-[24px] md:text-[28px] leading-[110%] m-0">
              {animateur.nom}
            </h3>
            {animateur.fonction && (
              <p className="font-nav font-[900] text-gray-900 text-[20px] md:text-[24px] leading-[110%] m-0 mt-1">
                {animateur.fonction}
              </p>
            )}
          </div>

          {animateur.bio && (
            <div
              className="font-body normal-case text-gray-700 text-[15px] leading-[160%] [&_p]:m-0 [&_p+p]:mt-3"
              // bio est du HTML riche saisi dans WP (WYSIWYG) : on le sanitise avant
              // injection pour bloquer tout <script>/attribut on* malveillant (XSS).
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(animateur.bio) }}
            />
          )}

          {liens.length > 0 && (
            <ul className="flex flex-wrap gap-3 mt-1">
              {liens.map((r) => (
                <li key={r.id}>
                  <a
                    href={r.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={r.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:bg-secondary transition-colors"
                  >
                    {r.icon}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
