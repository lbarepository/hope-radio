import { revalidatePath }         from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const ARCHIVE_PATHS_BY_POST_TYPE: Record<string, string[]> = {
  emission:    ['/emissions', '/grille', '/'],
  post:        ['/actualites', '/'],
  agenda:      ['/agenda', '/'],
  podcast:     ['/podcast', '/'],
  animateur:   ['/emissions'],
  page:        ['/'],
};

const DETAIL_PATH_BY_POST_TYPE: Record<string, (slug: string) => string> = {
  emission: (slug) => `/emissions/${slug}`,
  post:     (slug) => `/actualite/${slug}`,
  agenda:   (slug) => `/agenda/${slug}`,
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

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths: [...paths] });
}
