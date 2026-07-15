import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse }     from 'next/server';
import { wpTags }                        from '@/lib/revalidateTags';

const ARCHIVE_PATHS_BY_POST_TYPE: Record<string, string[]> = {
  emission:      ['/emissions', '/grille', '/'],
  post:          ['/actualites', '/'],
  agenda:        ['/agenda', '/'],
  podcast:       ['/podcast', '/'],
  animateur:     ['/emissions'],
  nav_menu_item: ['/'],
  page:          ['/'],
};

const DETAIL_PATH_BY_POST_TYPE: Record<string, (slug: string) => string> = {
  emission: (slug) => `/emissions/${slug}`,
  post:     (slug) => `/actualite/${slug}`,
  agenda:   (slug) => `/agenda/${slug}`,
};

const ARCHIVE_TAGS_BY_POST_TYPE: Record<string, string[]> = {
  emission:      [wpTags.emissions, wpTags.grille],
  post:          [wpTags.actualites],
  agenda:        [wpTags.agendaList],
  podcast:       [wpTags.podcasts],
  animateur:     [wpTags.emissions],
  clip:          [wpTags.clips],
  radio:         [wpTags.radios],
  nav_menu_item: [wpTags.menus],
};

const DETAIL_TAG_BY_POST_TYPE: Record<string, (slug: string) => string> = {
  emission: wpTags.emission,
  post:     wpTags.actualite,
  agenda:   wpTags.agendaItem,
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET_KEY) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let postType = 'page';
  let slug: string | undefined;
  let uri: string | undefined;
  try {
    const body = await request.json();
    if (typeof body.postType === 'string') postType = body.postType;
    if (typeof body.slug === 'string') slug = body.slug;
    if (typeof body.uri === 'string') uri = body.uri;
  } catch {
    // body vide ou malformé → on revalide / par défaut
  }

  const paths = new Set(ARCHIVE_PATHS_BY_POST_TYPE[postType] ?? ['/']);
  const detailPath = slug ? DETAIL_PATH_BY_POST_TYPE[postType]?.(slug) : undefined;
  if (detailPath) paths.add(detailPath);
  if (postType === 'page' && uri) paths.add(uri);
  for (const path of paths) revalidatePath(path);

  // revalidatePath ne force pas les fetch() encore "frais" (next.revalidate) à se
  // relancer : seul revalidateTag purge immédiatement le Data Cache correspondant.
  const tags = new Set(ARCHIVE_TAGS_BY_POST_TYPE[postType] ?? []);
  const detailTag = slug ? DETAIL_TAG_BY_POST_TYPE[postType]?.(slug) : undefined;
  if (detailTag) tags.add(detailTag);
  if (postType === 'page' && uri) tags.add(wpTags.page(uri));
  for (const tag of tags) revalidateTag(tag, 'max');

  return NextResponse.json({ revalidated: true, paths: [...paths], tags: [...tags] });
}
