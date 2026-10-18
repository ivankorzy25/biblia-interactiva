// Retry failed Doré downloads with 30s delays
const https = require('https');
const fs = require('fs');
const path = require('path');

const DELAY_MS = 30000;
const doreDir = path.join(__dirname, 'img', 'art', 'dore');

// Read the main generator to get all expected files
const genSrc = fs.readFileSync(path.join(__dirname, 'generate-images.cjs'), 'utf-8');

// Find all DORE_URLS entries
const urlMatch = genSrc.match(/const DORE_URLS\s*=\s*\{([\s\S]*?)\};/);
if (!urlMatch) { console.error('Could not parse DORE_URLS'); process.exit(1); }

const DORE_BASE = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const urls = {};
const re = /"(\w+)":\s*"([^"]+)"/g;
let m;
while ((m = re.exec(urlMatch[1])) !== null) {
  urls[m[1]] = DORE_BASE + m[2];
}

// Also check NT images
const ntMatch = genSrc.match(/const DORE_NT\s*=\s*\[([\s\S]*?)\];/);
const ntUrls = {};
if (ntMatch) {
  const ntRe = /\["(\w+)",\s*"([^"]+)"/g;
  while ((m = ntRe.exec(ntMatch[1])) !== null) {
    const ext = m[2].endsWith('.png') ? 'png' : 'jpg';
    ntUrls[m[1]] = {
      url: `https://upload.wikimedia.org/wikipedia/commons/${m[2]}`,
      ext
    };
  }
}

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
    https.get(opts, (res) => {
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
        else resolve({ ok: false, size: buf.length });
      });
    }).on('error', e => resolve({ ok: false, error: e.message }));
  });
}

async function main() {
  // Find missing/failed files
  const toRetry = [];

  for (const [num, url] of Object.entries(urls)) {
    const fname = `dore_${num}.jpg`;
    const dest = path.join(doreDir, fname);
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 5000) {
      toRetry.push({ fname, url, dest });
    }
  }

  for (const [id, info] of Object.entries(ntUrls)) {
    const fname = `${id}.${info.ext}`;
    const dest = path.join(doreDir, fname);
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 3000) {
      toRetry.push({ fname, url: info.url, dest });
    }
  }

  console.log(`Missing/failed Doré images: ${toRetry.length}`);
  console.log(`Delay between requests: ${DELAY_MS/1000}s\n`);

  let success = 0, fail = 0;
  for (let i = 0; i < toRetry.length; i++) {
    const { fname, url, dest } = toRetry[i];
    process.stdout.write(`[${i+1}/${toRetry.length}] ${fname}... `);
    const result = await download(url, dest);
    if (result.ok) {
      console.log(`OK (${Math.round(result.size/1024)}KB)`);
      success++;
    } else {
      console.log(`FAIL (${result.status || result.error})`);
      fail++;
    }
    if (i < toRetry.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }
  console.log(`\nDone: ${success} OK, ${fail} failed out of ${toRetry.length}`);
}

main().catch(console.error);
