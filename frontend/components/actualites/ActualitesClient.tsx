'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import type { ActualiteArchiveCard, ActualitePageInfo } from '@/app/data/actualites/transformer';
import type { ActualiteFilterCategory }                 from '@/graphql/actualites';
import type { loadMoreActualites }                      from '@/app/actualites/actions';
import ActualiteCard                                    from '@/components/actualites/ActualiteCard';

interface ActualitesClientProps {
  initialCards:    ActualiteArchiveCard[];
  initialPageInfo: ActualitePageInfo;
  categories:      ActualiteFilterCategory[];
  loadMore:        typeof loadMoreActualites;
}


export default function ActualitesClient({
  initialCards,
  initialPageInfo,
  categories,
  loadMore,
}: ActualitesClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cards, setCards]                   = useState<ActualiteArchiveCard[]>(initialCards);
  const [pageInfo, setPageInfo]             = useState<ActualitePageInfo>(initialPageInfo);
  const [error, setError]                   = useState<string | null>(null);
  const [isPending, startTransition]        = useTransition();
  const sentinelRef                         = useRef<HTMLDivElement>(null);
  const isLoadingRef                        = useRef(false);
  const activeCategoryRef                   = useRef<string | null>(null);

  const handleCategoryChange = (slug: string | null) => {
    activeCategoryRef.current = slug;
    setActiveCategory(slug);
    setCards([]);
    setError(null);
    setPageInfo({ hasNextPage: true, endCursor: null });
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || !pageInfo.hasNextPage || isLoadingRef.current) return;

        const categoryAtCall = activeCategoryRef.current;
        isLoadingRef.current = true;

        startTransition(async () => {
          try {
            const result = await loadMore(pageInfo.endCursor, categoryAtCall);
            if (activeCategoryRef.current !== categoryAtCall) return;
            setCards((prev) => [...prev, ...result.cards]);
            setPageInfo(result.pageInfo);
          } catch {
            setError('Impossible de charger les actualités.');
          } finally {
            isLoadingRef.current = false;
          }
        });
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pageInfo, loadMore]);

  return (
    <div>
      {/* Filtre catégories */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 mb-10">
        <div className="flex gap-3 w-max md:w-auto md:flex-wrap md:justify-center">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`shrink-0 px-[30px] pb-[5px] pt-[3px] rounded-[40px] border font-heading font-bold text-sm transition-colors cursor-pointer ${
              activeCategory === null
                ? 'bg-white text-[#E35711] border-white'
                : 'bg-transparent text-white border-white hover:bg-white/10'
            }`}
          >
            Toutes
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`shrink-0 px-[30px] pb-[5px] pt-[3px] rounded-[40px] border font-heading font-bold text-sm transition-colors cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-white text-[#E35711] border-white'
                  : 'bg-transparent text-white border-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <ActualiteCard key={card.id} card={card} />
        ))}
      </div>

      {/* États */}
      {isPending && (
        <p className="text-white text-center py-8 opacity-70">Chargement…</p>
      )}
      {error && (
        <p className="text-white text-center py-8 opacity-70">{error}</p>
      )}
      {!isPending && !error && cards.length === 0 && (
        <p className="text-white text-center py-16">
          Aucune actualité dans cette catégorie.
        </p>
      )}

      {/* Sentinel IntersectionObserver */}
      {pageInfo.hasNextPage && (
        <div ref={sentinelRef} className="h-4 mt-4" aria-hidden />
      )}
    </div>
  );
}
