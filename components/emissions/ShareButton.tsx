'use client';

import { useState } from 'react';

interface Props {
  title: string;
}

const NETWORKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    color: '#000000',
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    href: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: 'copy',
    label: 'Copier le lien',
    color: '#6B7280',
    href: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
      </svg>
    ),
  },
] as const;

export default function ShareButton({ title }: Props) {
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return typeof window !== 'undefined' ? window.location.href : '';
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNetwork(href: ((url: string, title: string) => string) | null) {
    if (!href) { handleCopy(); return; }
    window.open(href(getUrl(), title), '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  return (
    <>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen(true)}
        className="font-button font-semibold inline-flex items-center gap-3 rounded-[30px] border border-white bg-transparent text-white text-sm h-[50px] px-6 whitespace-nowrap hover:bg-primary hover:border-primary transition-colors cursor-pointer"
      >
        Partager
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.9296 15.654C11.1923 14.7853 9.45491 13.9166 7.69042 13.048C6.76746 14.2152 5.57304 14.8396 4.05287 14.7853C2.91274 14.731 1.96263 14.2967 1.1754 13.4823C-0.45336 11.7721 -0.371922 9.08465 1.31113 7.48304C3.07561 5.79999 6.03452 5.88143 7.69042 8.0531C8.23334 7.78164 8.77626 7.51019 9.29203 7.23873C10.4322 6.66866 11.5994 6.0986 12.7396 5.52853C12.8753 5.44709 12.9024 5.3928 12.8753 5.22993C12.2781 2.75964 13.8797 0.397948 16.3771 0.0450512C18.6845 -0.307846 20.9105 1.45664 21.1005 3.79119C21.3448 6.3972 19.2546 8.56888 16.6486 8.37886C15.4813 8.29742 14.5041 7.80879 13.744 6.91297C13.6897 6.83154 13.6082 6.77725 13.5539 6.69581C11.7895 7.56448 10.0521 8.43315 8.31478 9.32896C8.55909 10.1705 8.55909 10.9849 8.31478 11.7992C10.0793 12.6679 11.8166 13.5366 13.5539 14.4324C14.3683 13.3737 15.427 12.7765 16.73 12.6951C17.7616 12.6408 18.7117 12.9122 19.5261 13.5366C21.2091 14.8124 21.7249 17.0927 20.7205 18.9115C19.7161 20.7574 17.5715 21.5989 15.617 20.9474C13.7711 20.3231 12.1966 18.2328 12.9024 15.6811L12.9296 15.654Z" fill="white"/>
        </svg>
      </button>

      {/* Dialog de partage */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Carte */}
          <div
            className="relative z-10 bg-white rounded-[20px] p-8 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <h2 className="font-nav font-[900] text-primary text-xl uppercase mb-6" style={{ paddingRight: '20px', lineHeight: '1.2' }}>
              Partager l&apos;émission {title}
            </h2>

            {/* Réseaux */}
            <ul className="flex flex-col gap-3">
              {NETWORKS.map((network) => (
                <li key={network.id}>
                  <button
                    onClick={() => handleNetwork(network.href)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-[12px] hover:bg-gray-50 transition-colors cursor-pointer text-left"
                  >
                    <span
                      className="w-10 h-10 flex items-center justify-center rounded-full text-white shrink-0"
                      style={{ background: network.color }}
                    >
                      {network.icon}
                    </span>
                    <span className="font-heading font-semibold text-sm text-gray-800">
                      {network.id === 'copy' && copied ? 'Lien copié !' : network.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Bouton fermer */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setOpen(false)}
                className="font-button font-semibold inline-flex items-center gap-2 rounded-[30px] border border-gray-300 bg-transparent text-gray-500 text-sm h-[44px] px-6 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
