// Cloudflare Pages Function — /api/tts
// Voces neurales de Microsoft Edge (Read Aloud) por WebSocket, devuelve MP3.
// Body: { text, voice: "es-MX-JorgeNeural", rate: "+0%" }
// Token Sec-MS-GEC v2 portado de edge-tts (src/edge_tts/drm.py).

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM_FULL_VERSION = '143.0.3650.75';
const CHROMIUM_MAJOR = CHROMIUM_FULL_VERSION.split('.')[0];
const SEC_MS_GEC_VERSION = `2-${CHROMIUM_FULL_VERSION}`;
const WSS_URL = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;
const MAX_TEXT = 3000;
const TIMEOUT_MS = 30000;

export async function onRequestPost({ request }) {
    let input;
    try { input = await request.json(); } catch { return new Response('JSON inválido', { status: 400 }); }

    const text = String(input.text || '').trim().slice(0, MAX_TEXT);
    if (!text) return new Response('Falta el texto', { status: 400 });
    const voice = /^[a-z]{2,3}-[A-Z]{2}-[A-Za-z]+Neural$/.test(input.voice || '') ? input.voice : 'es-MX-JorgeNeural';
    const rate = /^[+-]\d{1,3}%$/.test(input.rate || '') ? input.rate : '+0%';

    try {
        const audio = await synthesize(text, voice, rate);
        return new Response(audio, {
            headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' },
        });
    } catch (err) {
        console.log('tts error', err.message);
        return new Response('TTS no disponible', { status: 503 });
    }
}

async function synthesize(text, voice, rate) {
    const url = `${WSS_URL}&ConnectionId=${uuidHex()}&Sec-MS-GEC=${generateSecMsGec()}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`;
    const res = await fetch(url, {
        headers: {
            'Upgrade': 'websocket',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR}.0.0.0`,
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': `muid=${uuidHex().toUpperCase()};`,
        },
    });
    const ws = res.webSocket;
    if (!ws) throw new Error(`handshake ${res.status}`);
    ws.accept();

    const chunks = [];
    const done = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS);
        ws.addEventListener('message', (ev) => {
            if (typeof ev.data === 'string') {
                if (ev.data.includes('Path:turn.end')) { clearTimeout(timer); resolve(); }
                return;
            }
            const buf = new Uint8Array(ev.data);
            if (buf.length < 2) return;
            const headerLen = (buf[0] << 8) | buf[1];
            const header = new TextDecoder().decode(buf.subarray(2, 2 + headerLen));
            if (header.includes('Path:audio') && header.includes('audio/mpeg')) {
                chunks.push(buf.subarray(2 + headerLen));
            }
        });
        ws.addEventListener('close', () => { clearTimeout(timer); resolve(); });
        ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('websocket')); });
    });

    const stamp = new Date().toUTCString().replace(/^(\w+), (\d+) (\w+) (\d+) /, '$1 $3 $2 $4 ') + '+0000 (Coordinated Universal Time)';
    ws.send(
        `X-Timestamp:${stamp}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},' +
        '"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n'
    );
    const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>" +
        `<voice name='${voice}'><prosody pitch='+0Hz' rate='${rate}' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
    ws.send(`X-RequestId:${uuidHex()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${stamp}Z\r\nPath:ssml\r\n\r\n${ssml}`);

    await done;
    try { ws.close(); } catch {}
    if (!chunks.length) throw new Error('sin audio');

    const total = chunks.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return out;
}

function escapeXml(s) {
    return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function uuidHex() {
    return crypto.randomUUID().replace(/-/g, '');
}

// ==========================================
// Sec-MS-GEC v2 (SHA-256 con estado y constantes propias + CS64)
// ==========================================
const WIN_EPOCH = 11644473600;
const SHA_INITIAL = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
const SHA_STATE = [0xFD9FBEA2, 0x91243CE7, 0xBE499094, 0xCD2E1E0A, 0x6C006F49, 0x04BD35AB, 0xFEB0A7E4, 0x03EFFBD2];
const SHA_SCHEDULE = [0xEB24BF9E, 0x1558691F, 0xA0C09EE2, 0x0CFA32BA, 0xA622EE8C, 0xD1DD9491, 0xC0DD25A0,
    0xF9E70AB6, 0xF0C31573, 0x7058CE4E, 0x7188E606, 0x00E5AB33, 0xD258B060, 0x72766564];
const K = [
    0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
    0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
    0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
    0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
    0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
    0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
    0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
    0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2,
];
const SHA_ADJUSTMENT = 0xC9DC06A7;
const K_BLOCK = K.slice(0, 14).concat([SHA_ADJUSTMENT], K.slice(15));
const SIGMA0_ADJ = 0x059C0B80;
const SIGMA1_ADJ = 0x000B92C0;
const CS64_COEFFICIENTS = [
    [0xE82E91B1, 0xB32700D0], [0x44DE24C6, 0x88DFF51D], [0x3BEB65BC, 0x29514038], [0xC89C5933, 0xB328CBDF],
    [0x8D1EC211, 0xD405B4D5], [0x314EF5D5, 0x26E55F3C], [0xE92491B1, 0x607801C6], [0xF0A5B9D5, 0x82B2C1FB],
    [0x06064CF3, 0xFA51A3DA], [0xDA79FA60, 0x207CC464], [0xBED20560, 0x3C3C74F3], [0x89F9C9F8, 0xD2D14B61],
    [0x35FA38C6, 0xBB04A2C1], [0xCB49E3C6, 0xC5626167],
];
const CS64_FACTOR = 0x82893933;
const CS64_ADJ0 = 0xF2F90B1A;
const CS64_ADJ1 = 0x0B1A0000;

const u32 = (x) => x >>> 0;
const rotr = (x, n) => u32((x >>> n) | (x << (32 - n)));
const rol16 = (x) => u32((x << 16) | (x >>> 16));
const mul = (a, b) => u32(Math.imul(a, b));
const sigma0 = (x) => u32(rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3));
const sigma1 = (x) => u32(rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10));

function shaRounds(state, w, firstRound = 0) {
    let [a, b, c, d, e, f, g, h] = state;
    const k = firstRound === 14 ? K_BLOCK : K;
    for (let i = firstRound; i < 64; i++) {
        const t1 = u32(h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + (g ^ (e & (f ^ g))) + k[i] + w[i]);
        const t2 = u32((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) | (c & (a | b))));
        h = g; g = f; f = e; e = u32(d + t1); d = c; c = b; b = a; a = u32(t1 + t2);
    }
    return [a, b, c, d, e, f, g, h];
}

function expandSchedule(w, first = 16) {
    for (let i = first; i < 64; i++) {
        w.push(u32(sigma1(w[i - 2]) + w[i - 7] + sigma0(w[i - 15]) + w[i - 16]));
    }
}

function beWord(bytes, off, len = 4) {
    let v = 0;
    for (let i = 0; i < len; i++) v = (v * 256) + (bytes[off + i] || 0);
    return u32(v);
}

function shaInit(data7) {
    const w = new Array(14).fill(0);
    w.push(beWord(data7, 0, 3));
    w.push(beWord(data7, 3, 4));
    for (let i = 16; i < 30; i++) {
        let v = SHA_SCHEDULE[i - 16];
        if (i - 2 >= 14) v += i === 16 ? u32(sigma1(w[i - 2]) ^ SIGMA1_ADJ) : sigma1(w[i - 2]);
        if (i - 7 >= 14) v += w[i - 7];
        if (i - 15 >= 14) v += i === 29 ? u32(sigma0(w[i - 15]) ^ SIGMA0_ADJ) : sigma0(w[i - 15]);
        w.push(u32(v));
    }
    w.push(u32(sigma1(w[28]) + w[23] + sigma0(w[15]) + w[14] + SHA_ADJUSTMENT - K[14]));
    expandSchedule(w, 31);
    const working = shaRounds(SHA_STATE, w, 14);
    return SHA_INITIAL.map((x, i) => u32(x + working[i]));
}

function shaDigest(data) {
    const length = 57 + data.length;
    const zeros = (((55 - length) % 64) + 64) % 64;
    const padded = new Uint8Array(data.length - 7 + 1 + zeros + 8);
    padded.set(data.subarray(7), 0);
    padded[data.length - 7] = 0x80;
    const bits = length * 8;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 8, Math.floor(bits / 0x100000000));
    view.setUint32(padded.length - 4, u32(bits));

    let state = shaInit(data.subarray(0, 7));
    for (let off = 0; off < padded.length; off += 64) {
        const w = [];
        for (let i = 0; i < 16; i++) w.push(view.getUint32(off + i * 4));
        expandSchedule(w);
        const working = shaRounds(state, w);
        state = state.map((x, i) => u32(x + working[i]));
    }
    const out = new Uint8Array(32);
    const ov = new DataView(out.buffer);
    state.forEach((x, i) => ov.setUint32(i * 4, x));
    return out;
}

function cs64Digest(data, digest) {
    const dv = new DataView(digest.buffer, digest.byteOffset);
    const keyA = u32(dv.getUint32(0, true) | 1);
    const keyB = u32(dv.getUint32(4, true) | 1);
    const factors = [mul(keyA, CS64_FACTOR), mul(keyB, CS64_FACTOR)];
    const terms = CS64_COEFFICIENTS.map(([coef], i) => mul(coef, factors[i % 2]));
    const offsets = CS64_COEFFICIENTS.map(([, offset]) => offset);

    const src = new Uint8Array(1 + data.length);
    src.set(data, 1);
    const padded = new Uint8Array(Math.ceil(src.length / 4) * 4);
    padded.set(src);
    const pv = new DataView(padded.buffer);
    const words = [];
    for (let i = 0; i < padded.length; i += 4) words.push(pv.getUint32(i, true));
    if (words.length % 2) words.push(0);

    words.forEach((word, i) => {
        let term = mul(word, i % 2 === 0 ? keyA : keyB);
        let offset = mul(rol16(word), i % 2 === 0 ? 0xEF0569FB : 0xC31713DB);
        if (i === 0) {
            term = u32(term + mul(CS64_ADJ0, factors[0]));
            offset = u32(offset + CS64_ADJ1);
        }
        terms.push(term);
        offsets.push(offset);
    });

    let swapAcc = 0, swapLast = 0, state = 0, acc = 0;
    for (let i = 0; i < terms.length; i += 2) {
        const x = terms[i], y = terms[i + 1];
        let t = rol16(u32(offsets[i] + x));
        let q = mul(t, 0x76F50F34);
        swapAcc = u32(swapAcc + u32(mul(rol16(q), 0xC3EFEA97) + q));
        t = rol16(u32(offsets[i + 1] + y));
        q = mul(t, 0x1881CE3C);
        swapLast = u32(mul(rol16(q), 0x35BD1EC9) + q);
        swapAcc = u32(swapAcc + swapLast);

        state = u32(mul(state, keyA) + x);
        state = mul(rol16(state), 0xCF98B111);
        state = mul(rol16(state), 0x87085B9F);
        state = mul(rol16(state), 0x12CEB96D);
        state = mul(rol16(state), 0x257E1D83);
        acc = u32(acc + state);
        t = u32(mul(state, keyB) + y);
        t = mul(rol16(t), 0xA27416F5);
        t = mul(rol16(t), 0xD38396FF);
        state = mul(rol16(mul(rol16(t), 0x7C932B89)), 0xBFA49F69);
        acc = u32(acc + state);
    }
    return [u32(swapLast ^ state), u32(swapAcc ^ acc)];
}

const hex = (bytes) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

export function generateSecMsGec(unixSeconds = Date.now() / 1000) {
    let ticks = unixSeconds + WIN_EPOCH;
    ticks -= ticks % 300;
    const data = new TextEncoder().encode(`${BigInt(ticks * 1e7)}${TRUSTED_CLIENT_TOKEN}`);
    const digest = shaDigest(data);
    const [lo, hi] = cs64Digest(data, digest);
    const cs = new Uint8Array(8);
    const cv = new DataView(cs.buffer);
    cv.setUint32(0, lo, true);
    cv.setUint32(4, hi, true);
    return `${hex(cs)}-${hex(digest)}`;
}
