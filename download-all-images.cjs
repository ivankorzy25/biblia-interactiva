// =============================================================
// COMPREHENSIVE IMAGE DOWNLOADER
// Downloads ALL missing images: Doré + Schnorr + Tissot + Hole + Maps
// 30s delays between requests to avoid Wikimedia 429
// Run: node download-all-images.cjs [--collection dore|schnorr|tissot|hole|maps] [--delay 30000]
// =============================================================
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const collectionFilter = args.includes('--collection') ? args[args.indexOf('--collection') + 1] : null;
const DELAY_MS = args.includes('--delay') ? parseInt(args[args.indexOf('--delay') + 1]) : 30000;

const BASE_DIR = __dirname;

// Ensure directories
['img/art/dore', 'img/art/schnorr', 'img/art/tissot', 'img/art/hole', 'img/maps'].forEach(d => {
  fs.mkdirSync(path.join(BASE_DIR, d), { recursive: true });
});

// ============================================================
// Download function with redirect support
// ============================================================
function download(url, dest) {
  return new Promise((resolve) => {
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': 'https://commons.wikimedia.org/'
      }
    };
    const u = new URL(url);
    opts.hostname = u.hostname;
    opts.path = u.pathname + (u.search || '');
    const mod = u.protocol === 'https:' ? https : http;
    mod.get(opts, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { resolve({ ok: false, status: res.statusCode }); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length > 3000) { fs.writeFileSync(dest, buf); resolve({ ok: true, size: buf.length }); }
        else resolve({ ok: false, size: buf.length, reason: 'too small' });
      });
    }).on('error', e => resolve({ ok: false, error: e.message }));
  });
}

// Resolve thumbnail URL via Wikimedia API
function resolveThumbUrl(filename, width = 960) {
  return new Promise((resolve) => {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
    https.get(apiUrl, { headers: { 'User-Agent': 'BibliaBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) { resolve(null); return; }
          const page = Object.values(pages)[0];
          const info = page?.imageinfo?.[0];
          resolve(info?.thumburl || info?.url || null);
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

// Search Wikimedia for a Doré Bible illustration by number prefix (e.g. "028")
function searchDoreFile(prefix) {
  return new Promise((resolve) => {
    // Search Commons for Doré Bible illustrations with this number
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('"' + prefix + '" Dore Bible')}&srnamespace=6&srlimit=5&format=json`;
    https.get(apiUrl, { headers: { 'User-Agent': 'BibliaBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = json.query?.search || [];
          // Find the best match - should start with "File:NNN." or contain the prefix
          const match = results.find(r => r.title.startsWith(`File:${prefix}.`) || r.title.startsWith(`File:${prefix} `));
          if (match) {
            const fname = match.title.replace('File:', '');
            resolveThumbUrl(fname).then(resolve);
          } else {
            resolve(null);
          }
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function hasLocal(relPath) {
  const full = path.join(BASE_DIR, relPath);
  return fs.existsSync(full) && fs.statSync(full).size > 3000;
}

// ============================================================
// Build download queue from generate-all-images-data.cjs sources
// ============================================================

// Load Doré data from the generator
const genSrc = fs.readFileSync(path.join(BASE_DIR, 'generate-all-images-data.cjs'), 'utf-8');

// Parse DORE_URLS
const DORE_BASE = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const doreUrlsMatch = genSrc.match(/const DORE_URLS\s*=\s*\{([\s\S]*?)\};/);
const DORE_URLS = {};
if (doreUrlsMatch) {
  const re = /"([^"]+)":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(doreUrlsMatch[1])) !== null) {
    DORE_URLS[m[1]] = m[2];
  }
}

// Parse DORE_OT
const doreOtMatch = genSrc.match(/const DORE_OT\s*=\s*\[([\s\S]*?)\];\n/);
const DORE_OT_NUMS = [];
if (doreOtMatch) {
  const re = /\["([^"]+)",\s*"[^"]+",\s*"[^"]+"/g;
  let m;
  while ((m = re.exec(doreOtMatch[1])) !== null) {
    DORE_OT_NUMS.push(m[1]);
  }
}

// Parse DORE_NT
const doreNtMatch = genSrc.match(/const DORE_NT\s*=\s*\[([\s\S]*?)\];\n/);
const DORE_NT_ITEMS = [];
if (doreNtMatch) {
  const re = /\["([^"]+)",\s*"([^"]+)",/g;
  let m;
  while ((m = re.exec(doreNtMatch[1])) !== null) {
    DORE_NT_ITEMS.push({ id: m[1], wikiFile: m[2] });
  }
}

// Parse SCHNORR
const schnorrMatch = genSrc.match(/const SCHNORR\s*=\s*\[([\s\S]*?)\];\n/);
const SCHNORR_ITEMS = [];
if (schnorrMatch) {
  const re = /\["(schnorr_\d+)",\s*"(\d+)"/g;
  let m;
  while ((m = re.exec(schnorrMatch[1])) !== null) {
    SCHNORR_ITEMS.push({ id: m[1], num: m[2] });
  }
}

// Parse HOLE
const holeMatch = genSrc.match(/const HOLE\s*=\s*\[([\s\S]*?)\];\n/);
const HOLE_ITEMS = [];
if (holeMatch) {
  const re = /\["(hole_\d+)",\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(holeMatch[1])) !== null) {
    HOLE_ITEMS.push({ id: m[1], wikiFile: m[2] });
  }
}

// Load Tissot
const _tissotSrc = fs.readFileSync(path.join(BASE_DIR, '..', 'tissot_paintings.js'), 'utf-8');
const _tissotMatch = _tissotSrc.match(/const TISSOT_PAINTINGS\s*=\s*(\[[\s\S]*?\n\]);/);
let TISSOT_ITEMS = [];
if (_tissotMatch) {
  TISSOT_ITEMS = eval(_tissotMatch[1]);
}

async function main() {
  const queue = [];

  // 1. Doré OT (use API search to find correct filenames)
  if (!collectionFilter || collectionFilter === 'dore') {
    for (const num of DORE_OT_NUMS) {
      const localPath = `img/art/dore/dore_${num}.jpg`;
      if (hasLocal(localPath)) continue;
      // Extract filename from URL suffix to search by number prefix
      const urlSuffix = DORE_URLS[num];
      // Use the Doré number as search key for API resolution
      const searchName = urlSuffix ? urlSuffix.split('/').pop().replace('960px-', '') : null;
      queue.push({
        id: `dore_${num}`,
        // Try direct URL first, but mark for API search fallback
        url: urlSuffix ? DORE_BASE + urlSuffix : null,
        searchPrefix: num, // e.g. "028" to search "File:028."
        dest: path.join(BASE_DIR, localPath),
        collection: 'dore',
        needsSearch: true // Will search Wikimedia API if direct URL fails
      });
    }
    // Doré NT
    for (const { id, wikiFile } of DORE_NT_ITEMS) {
      const ext = wikiFile.endsWith('.png') ? 'png' : 'jpg';
      const localPath = `img/art/dore/${id}.${ext}`;
      if (hasLocal(localPath)) continue;
      queue.push({
        id,
        wikiFile, // For API resolution
        dest: path.join(BASE_DIR, localPath),
        collection: 'dore',
        needsResolve: true
      });
    }
  }

  // 2. Schnorr (needs API resolution)
  if (!collectionFilter || collectionFilter === 'schnorr') {
    for (const { id, num } of SCHNORR_ITEMS) {
      const localPath = `img/art/schnorr/${id}.png`;
      if (hasLocal(localPath)) continue;
      queue.push({
        id,
        wikiFile: `Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_${num}.png`,
        dest: path.join(BASE_DIR, localPath),
        collection: 'schnorr',
        needsResolve: true
      });
    }
  }

  // 3. Tissot
  if (!collectionFilter || collectionFilter === 'tissot') {
    for (const [id, thumbPath] of TISSOT_ITEMS) {
      const ext = thumbPath.endsWith('.png') ? 'png' : 'jpg';
      const localPath = `img/art/tissot/${id}.${ext}`;
      if (hasLocal(localPath)) continue;
      const url = thumbPath.startsWith('thumb/')
        ? `https://upload.wikimedia.org/wikipedia/commons/${thumbPath}`
        : `https://upload.wikimedia.org/wikipedia/commons/thumb/${thumbPath}`;
      queue.push({
        id,
        url,
        dest: path.join(BASE_DIR, localPath),
        collection: 'tissot'
      });
    }
  }

  // 4. Hole (needs API resolution)
  if (!collectionFilter || collectionFilter === 'hole') {
    for (const { id, wikiFile } of HOLE_ITEMS) {
      const ext = wikiFile.endsWith('.png') ? 'png' : 'jpg';
      const localPath = `img/art/hole/${id}.${ext}`;
      if (hasLocal(localPath)) continue;
      queue.push({
        id,
        wikiFile,
        dest: path.join(BASE_DIR, localPath),
        collection: 'hole',
        needsResolve: true
      });
    }
  }

  // 5. Maps
  if (!collectionFilter || collectionFilter === 'maps') {
    const mapsData = genSrc.match(/const BIBLICA_MAPS\s*=\s*\[([\s\S]*?)\];\n/);
    if (mapsData) {
      const re = /id:\s*"([^"]+)".*?fname:\s*"([^"]+)".*?url:\s*"([^"]+)"/g;
      let m;
      while ((m = re.exec(mapsData[1])) !== null) {
        const localPath = `img/maps/${m[2]}`;
        if (hasLocal(localPath)) continue;
        queue.push({
          id: m[1],
          url: m[3],
          dest: path.join(BASE_DIR, localPath),
          collection: 'maps'
        });
      }
    }
  }

  console.log(`\n=== DOWNLOAD QUEUE ===`);
  console.log(`Total to download: ${queue.length}`);
  if (collectionFilter) console.log(`Filter: ${collectionFilter}`);
  console.log(`Delay between requests: ${DELAY_MS / 1000}s`);

  const stats = { ok: 0, fail: 0 };
  const startTime = Date.now();

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const eta = i > 0 ? Math.round(((Date.now() - startTime) / i) * (queue.length - i) / 1000) : 0;
    process.stdout.write(`[${i + 1}/${queue.length}] (${elapsed}s elapsed, ~${eta}s left) ${item.id}... `);

    let url = item.url;

    // Resolve URL via API if needed
    if (item.needsResolve) {
      url = await resolveThumbUrl(item.wikiFile);
      if (!url) {
        console.log('FAIL (no URL from API)');
        stats.fail++;
        if (i < queue.length - 1) await new Promise(r => setTimeout(r, 5000));
        continue;
      }
    }

    // For Doré: try direct URL first, fall back to API search
    if (item.needsSearch) {
      // Try direct URL first
      let result = url ? await download(url, item.dest) : { ok: false };
      if (!result.ok && item.searchPrefix) {
        // Search Wikimedia API for correct filename
        process.stdout.write('(searching API) ');
        url = await searchDoreFile(item.searchPrefix);
        if (url) {
          result = await download(url, item.dest);
        }
      }
      if (result.ok) {
        console.log(`OK (${Math.round(result.size / 1024)}KB)`);
        stats.ok++;
      } else {
        console.log(`FAIL (${result.status || result.error || result.reason || 'not found'})`);
        stats.fail++;
      }
    } else {
      const result = await download(url, item.dest);
      if (result.ok) {
        console.log(`OK (${Math.round(result.size / 1024)}KB)`);
        stats.ok++;
      } else {
        console.log(`FAIL (${result.status || result.error || result.reason || 'unknown'})`);
        stats.fail++;
      }
    }

    if (i < queue.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== DONE ===`);
  console.log(`Success: ${stats.ok}, Failed: ${stats.fail}, Total: ${queue.length}`);
  console.log(`Time: ${Math.round(totalTime / 60)}m ${totalTime % 60}s`);

  // Regenerate data file after downloads
  if (stats.ok > 0) {
    console.log('\nRegenerating biblia-images-data.js...');
    require('child_process').execSync('node generate-all-images-data.cjs', { cwd: BASE_DIR, stdio: 'inherit' });
  }
}

main().catch(console.error);
