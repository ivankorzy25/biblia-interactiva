// Cloudflare Pages Function — /api/chat
// Proxies requests to ollama.com/api/chat preserving Authorization + streaming

export async function onRequestPost({ request }) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const auth = request.headers.get('Authorization');
  if (auth) headers.set('Authorization', auth);

  const ollamaRes = await fetch('https://ollama.com/api/chat', {
    method: 'POST',
    headers,
    body: request.body,
  });

  const resHeaders = new Headers(ollamaRes.headers);
  resHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(ollamaRes.body, {
    status: ollamaRes.status,
    headers: resHeaders,
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
