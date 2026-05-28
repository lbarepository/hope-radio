const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const { pathname } = new URL(request.url);
    // @ts-ignore — Cloudflare-specific cf object
    const country: string = (request as any).cf?.country ?? 'FR';

    if (pathname === '/stream-config') {
      return new Response(JSON.stringify({ country }), {
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // Allowlist of authorized streaming hostnames.
    // Add a new entry here each time a radio station uses a different stream host.
    const ALLOWED_STREAM_HOSTS = new Set([
      'stream.hoperadio.fr',
    ]);

    let streamUrl: string;
    const customStream = new URL(request.url).searchParams.get('stream');
    if (customStream) {
      let parsed: URL;
      try { parsed = new URL(customStream); } catch {
        return new Response('Bad Request', { status: 400 });
      }
      if (parsed.protocol !== 'https:' || !ALLOWED_STREAM_HOSTS.has(parsed.hostname.toLowerCase())) {
        return new Response('Forbidden', { status: 403 });
      }
      streamUrl = parsed.toString();
    } else {
      streamUrl = country === 'CH'
        ? 'https://stream.hoperadio.fr/hoperadio-suisse'
        : 'https://stream.hoperadio.fr/hoperadio';
    }

    const upstream = await fetch(streamUrl, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') ?? 'Mozilla/5.0',
        'Icy-MetaData': '0',
      },
      redirect: 'manual',
      // @ts-ignore — Cloudflare-specific option, disables edge caching
      cf: { cacheEverything: false },
    });

    // Refuse to follow redirects — re-validate Location if needed to prevent allowlist bypass.
    if (upstream.status >= 300 && upstream.status < 400) {
      return new Response('Bad Gateway', { status: 502 });
    }

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
