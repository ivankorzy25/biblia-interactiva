// Cloudflare Worker — Ollama API Proxy
// Forwards requests to ollama.com/api/chat adding the user's auth header
// Deploy: wrangler deploy --name ollama-proxy ollama-proxy-worker.js

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    // Map /api/chat -> ollama.com/api/chat, /api/tags -> ollama.com/api/tags
    const targetPath = url.pathname;
    const targetUrl = `https://ollama.com${targetPath}`;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const auth = request.headers.get('Authorization');
    if (auth) headers.set('Authorization', auth);

    const ollamaRes = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: request.body,
    });

    // Stream the response back with CORS headers
    const responseHeaders = new Headers(ollamaRes.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(ollamaRes.body, {
      status: ollamaRes.status,
      headers: responseHeaders,
    });
  },
};
