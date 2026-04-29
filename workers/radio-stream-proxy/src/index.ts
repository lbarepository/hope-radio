export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const upstream = await fetch('https://stream.hoperadio.fr/hoperadio', {
      headers: {
        'User-Agent': request.headers.get('User-Agent') ?? 'Mozilla/5.0',
        'Icy-MetaData': '0',
      },
      // @ts-ignore — Cloudflare-specific option, disables edge caching
      cf: { cacheEverything: false },
    });

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
};
