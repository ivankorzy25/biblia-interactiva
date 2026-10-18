// Cloudflare Pages Function — /api/chat
// IA del Asistente Bíblico con las claves de Ollama Cloud del servidor:
// primero la cuenta Pro; si falla o se queda sin crédito, rota por las cuentas gratis.
// Solo usuarios con sesión de Firebase (Authorization: Bearer <ID token>).
//
// Secretos del proyecto Pages:
//   OLLAMA_KEY_PRO    clave de la suscripción Pro
//   OLLAMA_KEYS_FREE  claves gratis separadas por coma

const FIREBASE_PROJECT = 'biblia-kor';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const OLLAMA_URL = 'https://ollama.com/api/chat';

// Modelos por plan, en orden de preferencia (los gratis no tienen acceso a los de Pro)
const PRO_MODELS = ['deepseek-v4-pro', 'kimi-k3', 'gemma4:31b'];
const FREE_MODELS = ['gemma4:31b', 'nemotron-3-super'];

const MAX_BODY_CHARS = 200000;
const MAX_MESSAGES = 40;
const MAX_PREDICT = 8192;
const HEADERS_TIMEOUT_MS = 45000;
const RATE_LIMIT = 60;          // pedidos por usuario
const RATE_WINDOW_SEC = 600;    // cada 10 minutos

const cooldowns = new Map();    // clave -> timestamp hasta el que no se usa
let freeCursor = 0;
let jwks = null;                // { keys: Map(kid -> CryptoKey), until }

export async function onRequestPost({ request, env }) {
    const auth = request.headers.get('Authorization') || '';
    // La versión vieja de la app mandaba la API key de Ollama del usuario (no es un JWT)
    if (auth && auth.split('.').length !== 3) {
        return new Response('Hay una versión nueva de la Biblia. Recargá la página para seguir usando el asistente.', {
            status: 426,
            headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
        });
    }

    const uid = await verifyFirebaseToken(auth);
    if (!uid) return json(401, { error: 'Iniciá sesión para usar el asistente.' });

    if (await isRateLimited(request, uid)) {
        return json(429, { error: 'Hiciste muchas consultas seguidas. Esperá unos minutos y volvé a intentar.' });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return json(413, { error: 'La consulta es demasiado larga.' });

    let input;
    try { input = JSON.parse(raw); } catch { return json(400, { error: 'JSON inválido' }); }

    const messages = sanitizeMessages(input.messages);
    if (!messages) return json(400, { error: 'Mensajes inválidos' });

    const opts = input.options || {};
    const options = {
        num_predict: clamp(parseInt(opts.num_predict) || 4096, 1, MAX_PREDICT),
        temperature: clamp(Number.isFinite(+opts.temperature) ? +opts.temperature : 0.7, 0, 1.5),
    };

    for (const { key, models, tier } of keyOrder(env)) {
        let allQuota = true;
        let nextKey = false;

        for (const model of models) {
            const res = await callOllama(key, { model, messages, options, stream: true, think: false });

            if (res && res.ok) {
                return new Response(res.body, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/x-ndjson',
                        'Cache-Control': 'no-store',
                        'X-Biblia-IA': `${tier}:${model}`,
                    },
                });
            }

            const status = res ? res.status : 0;
            const detail = res ? await res.text().catch(() => '') : 'timeout';
            console.log(`ollama ${tier} ${model} -> ${status} ${detail.slice(0, 160)}`);

            if (status === 401) { setCooldown(key, 3600); nextKey = true; break; }
            if (status === 429) {
                // "too many concurrent requests" es momentáneo; cualquier otro 429 es límite de uso
                if (!/concurrent/i.test(detail)) setCooldown(key, 900);
                nextKey = true; break;
            }
            if (status !== 402) allQuota = false;
            // 402/403/404/5xx/timeout: ese modelo no está disponible con esta clave, probar el siguiente
        }

        if (!nextKey && allQuota) setCooldown(key, 900);
    }

    return json(503, { error: 'El asistente está con mucha demanda en este momento. Probá de nuevo en unos minutos.' });
}

// Pro primero; después las gratis empezando por una distinta en cada pedido para repartir la carga.
// Las que están en espera van al final, por si todas fallan.
function keyOrder(env) {
    const pro = (env.OLLAMA_KEY_PRO || '').trim();
    const free = (env.OLLAMA_KEYS_FREE || '').split(',').map(k => k.trim()).filter(Boolean);
    const start = free.length ? freeCursor++ % free.length : 0;
    const rotated = free.slice(start).concat(free.slice(0, start));

    const list = [];
    if (pro) list.push({ key: pro, models: PRO_MODELS, tier: 'pro' });
    rotated.forEach((key) => list.push({ key, models: FREE_MODELS, tier: `free${free.indexOf(key) + 1}` }));

    const now = Date.now();
    const ready = list.filter(k => !(cooldowns.get(k.key) > now));
    const waiting = list.filter(k => cooldowns.get(k.key) > now);
    return ready.concat(waiting);
}

function setCooldown(key, seconds) {
    cooldowns.set(key, Date.now() + seconds * 1000);
}

async function callOllama(key, body) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), HEADERS_TIMEOUT_MS);
    try {
        return await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify(body),
            signal: ctrl.signal,
        });
    } catch {
        return null;
    } finally {
        clearTimeout(timer);
    }
}

function sanitizeMessages(list) {
    if (!Array.isArray(list) || list.length === 0) return null;
    const out = [];
    for (const m of list.slice(-MAX_MESSAGES)) {
        if (!m || !['system', 'user', 'assistant'].includes(m.role) || typeof m.content !== 'string') return null;
        out.push({ role: m.role, content: m.content });
    }
    return out;
}

// ==========================================
// FIREBASE ID TOKEN (RS256)
// ==========================================
async function verifyFirebaseToken(header) {
    const token = (header || '').replace(/^Bearer\s+/i, '');
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
        const head = JSON.parse(b64urlText(parts[0]));
        const claims = JSON.parse(b64urlText(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        if (head.alg !== 'RS256' || !head.kid) return null;
        if (claims.aud !== FIREBASE_PROJECT || claims.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT}`) return null;
        if (!claims.sub || claims.exp < now || claims.iat > now + 300) return null;

        const key = await getSigningKey(head.kid);
        if (!key) return null;
        const ok = await crypto.subtle.verify(
            'RSASSA-PKCS1-v1_5', key, b64urlBytes(parts[2]),
            new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
        );
        return ok ? claims.sub : null;
    } catch {
        return null;
    }
}

async function getSigningKey(kid) {
    if (!jwks || jwks.until < Date.now() || !jwks.keys.has(kid)) {
        const res = await fetch(JWKS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } });
        const data = await res.json();
        const keys = new Map();
        for (const jwk of data.keys || []) {
            keys.set(jwk.kid, await crypto.subtle.importKey(
                'jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
                { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
            ));
        }
        jwks = { keys, until: Date.now() + 3600 * 1000 };
    }
    return jwks.keys.get(kid) || null;
}

function b64urlBytes(s) {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '='));
    return Uint8Array.from(bin, c => c.charCodeAt(0));
}

function b64urlText(s) {
    return new TextDecoder().decode(b64urlBytes(s));
}

// ==========================================
// LÍMITE POR USUARIO (aproximado, por datacenter)
// ==========================================
async function isRateLimited(request, uid) {
    try {
        const slot = Math.floor(Date.now() / 1000 / RATE_WINDOW_SEC);
        const cacheKey = `${new URL(request.url).origin}/__rl/${encodeURIComponent(uid)}/${slot}`;
        const hit = await caches.default.match(cacheKey);
        const count = hit ? parseInt(await hit.text()) || 0 : 0;
        if (count >= RATE_LIMIT) return true;
        await caches.default.put(cacheKey, new Response(String(count + 1), {
            headers: { 'Cache-Control': `max-age=${RATE_WINDOW_SEC}` },
        }));
    } catch {}
    return false;
}

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}

function json(status, data) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
}
