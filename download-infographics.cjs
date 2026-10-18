#!/usr/bin/env node
// ============================================
// Download Sweet Publishing Bible Illustrations
// from Wikimedia Commons (CC BY-SA 3.0)
// ============================================

const https = require('https');
const fs = require('fs');
const path = require('path');

// Map Wikimedia categories to app book IDs
const BOOK_CATEGORIES = {
    GEN: 'Book_of_Genesis_(Bible_Illustrations_by_Sweet_Media)',
    EXO: 'Book_of_Exodus_(Bible_Illustrations_by_Sweet_Media)',
    LEV: 'Book_of_Leviticus_(Bible_Illustrations_by_Sweet_Media)',
    NUM: 'Book_of_Numbers_(Bible_Illustrations_by_Sweet_Media)',
    DEU: 'Book_of_Deuteronomy_(Bible_Illustrations_by_Sweet_Media)',
    JOS: 'Book_of_Joshua_(Bible_Illustrations_by_Sweet_Media)',
    JUE: 'Book_of_Judges_(Bible_Illustrations_by_Sweet_Media)',
    RUT: 'Book_of_Ruth_(Bible_Illustrations_by_Sweet_Media)',
    '1SA': 'First_Book_of_Samuel_(Bible_Illustrations_by_Sweet_Media)',
    '2SA': 'Second_Book_of_Samuel_(Bible_Illustrations_by_Sweet_Media)',
    '1RE': 'First_Book_of_Kings_(Bible_Illustrations_by_Sweet_Media)',
    '2RE': 'Second_Book_of_Kings_(Bible_Illustrations_by_Sweet_Media)',
    '1CR': 'First_Book_of_Chronicles_(Bible_Illustrations_by_Sweet_Media)',
    '2CR': 'Second_Book_of_Chronicles_(Bible_Illustrations_by_Sweet_Media)',
    ESD: 'Book_of_Ezra_(Bible_Illustrations_by_Sweet_Media)',
    NEH: 'Book_of_Nehemiah_(Bible_Illustrations_by_Sweet_Media)',
    EST: 'Book_of_Esther_(Bible_Illustrations_by_Sweet_Media)',
    JOB: 'Book_of_Job_(Bible_Illustrations_by_Sweet_Media)',
    SAL: 'Psalms_(Bible_Illustrations_by_Sweet_Media)',
    ISA: 'Book_of_Isaiah_(Bible_Illustrations_by_Sweet_Media)',
    JER: 'Book_of_Jeremiah_(Bible_Illustrations_by_Sweet_Media)',
    EZE: 'Book_of_Ezekiel_(Bible_Illustrations_by_Sweet_Media)',
    DAN: 'Book_of_Daniel_(Bible_Illustrations_by_Sweet_Media)',
    JON: 'Book_of_Jonah_(Bible_Illustrations_by_Sweet_Media)',
    MAT: 'Gospel_of_Matthew_(Bible_Illustrations_by_Sweet_Media)',
    MAR: 'Gospel_of_Mark_(Bible_Illustrations_by_Sweet_Media)',
    LUC: 'Gospel_of_Luke_(Bible_Illustrations_by_Sweet_Media)',
    JUA: 'Gospel_of_John_(Bible_Illustrations_by_Sweet_Media)',
    HEC: 'Acts_of_the_Apostles_(Bible_Illustrations_by_Sweet_Media)',
    '1TI': 'First_Epistle_to_Timothy_(Bible_Illustrations_by_Sweet_Media)',
    '2TI': 'Second_Epistle_to_Timothy_(Bible_Illustrations_by_Sweet_Media)',
    TIT: 'Epistle_to_Titus_(Bible_Illustrations_by_Sweet_Media)',
    STG: 'Epistle_of_James_(Bible_Illustrations_by_Sweet_Media)',
    '1JN': 'First_Epistle_of_John_(Bible_Illustrations_by_Sweet_Media)',
    APO: 'Book_of_Revelation_(Bible_Illustrations_by_Sweet_Media)'
};

const BOOK_NAMES = {
    GEN: 'Génesis', EXO: 'Éxodo', LEV: 'Levítico', NUM: 'Números',
    DEU: 'Deuteronomio', JOS: 'Josué', JUE: 'Jueces', RUT: 'Rut',
    '1SA': '1 Samuel', '2SA': '2 Samuel', '1RE': '1 Reyes', '2RE': '2 Reyes',
    '1CR': '1 Crónicas', '2CR': '2 Crónicas', ESD: 'Esdras', NEH: 'Nehemías',
    EST: 'Ester', JOB: 'Job', SAL: 'Salmos', ISA: 'Isaías',
    JER: 'Jeremías', EZE: 'Ezequiel', DAN: 'Daniel', JON: 'Jonás',
    MAT: 'Mateo', MAR: 'Marcos', LUC: 'Lucas', JUA: 'Juan',
    HEC: 'Hechos', '1TI': '1 Timoteo', '2TI': '2 Timoteo',
    TIT: 'Tito', STG: 'Santiago', '1JN': '1 Juan', APO: 'Apocalipsis'
};

const OUTPUT_DIR = path.join(__dirname, 'infographics');
const DATA_FILE = path.join(__dirname, 'biblia-infographics-data.js');
const USER_AGENT = 'BibliaInteractivaBot/1.0 (biblia.kor.com.ar; educational Bible PWA)';
const DELAY_MS = 3000; // Delay between downloads to respect Wikimedia rate limits

// All collected data for the JS file
const allData = {};

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
            });
        });
        req.on('error', reject);
        req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) { resolve(true); return; } // Skip existing
        const file = fs.createWriteStream(dest);
        const doRequest = (reqUrl) => {
            https.get(reqUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    doRequest(res.headers.location);
                    return;
                }
                if (res.statusCode !== 200) {
                    file.close();
                    fs.unlinkSync(dest);
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(true); });
            }).on('error', (err) => {
                file.close();
                if (fs.existsSync(dest)) fs.unlinkSync(dest);
                reject(err);
            });
        };
        doRequest(url);
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Parse chapter and sequence from filename
function parseFilename(title) {
    // Pattern: "Book of X Chapter Y-Z (Bible Illustrations...)"
    const m = title.match(/Chapter\s+(\d+)-(\d+)/i);
    if (m) return { chapter: parseInt(m[1]), seq: parseInt(m[2]) };
    return { chapter: 0, seq: 0 };
}

async function getFilesForCategory(category) {
    const files = [];
    let gcmcontinue = null;

    do {
        let url = `https://commons.wikimedia.org/w/api.php?action=query`
            + `&generator=categorymembers`
            + `&gcmtitle=Category:${encodeURIComponent(category)}`
            + `&gcmtype=file`
            + `&gcmlimit=500`
            + `&prop=imageinfo`
            + `&iiprop=url|size|mime`
            + `&format=json`;

        if (gcmcontinue) {
            url += `&gcmcontinue=${gcmcontinue}`;
        }

        const data = await fetchJSON(url);
        const pages = data.query?.pages || {};

        for (const page of Object.values(pages)) {
            const info = page.imageinfo?.[0];
            if (!info) continue;
            // Only JPG files
            if (!info.mime || !info.mime.includes('jpeg')) continue;

            files.push({
                title: page.title.replace('File:', ''),
                url: info.url,
                width: info.width,
                height: info.height,
                size: info.size
            });
        }

        gcmcontinue = data.continue?.gcmcontinue || null;
    } while (gcmcontinue);

    return files;
}

async function processBook(bookId) {
    const category = BOOK_CATEGORIES[bookId];
    const bookName = BOOK_NAMES[bookId];
    const bookDir = path.join(OUTPUT_DIR, bookId.toLowerCase());

    if (!fs.existsSync(bookDir)) fs.mkdirSync(bookDir, { recursive: true });

    console.log(`\n📖 ${bookName} (${bookId}) — Fetching file list...`);
    const files = await getFilesForCategory(category);
    console.log(`   Found ${files.length} illustrations`);

    const bookData = [];
    let downloaded = 0;
    let skipped = 0;

    for (const file of files) {
        const { chapter, seq } = parseFilename(file.title);
        const safeName = `${bookId.toLowerCase()}_${chapter}_${seq}.jpg`;
        const localPath = path.join(bookDir, safeName);
        const relativePath = `infographics/${bookId.toLowerCase()}/${safeName}`;

        try {
            if (fs.existsSync(localPath)) {
                skipped++;
            } else {
                // Retry up to 3 times on 429
                let success = false;
                for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                        await downloadFile(file.url, localPath);
                        success = true;
                        downloaded++;
                        break;
                    } catch (dlErr) {
                        if (dlErr.message.includes('429') && attempt < 2) {
                            const wait = (attempt + 1) * 10000;
                            console.log(`   ⏳ Rate limited, waiting ${wait/1000}s...`);
                            await sleep(wait);
                        } else {
                            throw dlErr;
                        }
                    }
                }
                await sleep(DELAY_MS);
            }

            bookData.push({
                title: `${bookName} ${chapter}:${seq}`,
                chapter,
                seq,
                local: relativePath,
                url: file.url
            });
        } catch (err) {
            console.log(`   ⚠ Error: ${safeName} — ${err.message}`);
        }
    }

    // Sort by chapter then sequence
    bookData.sort((a, b) => a.chapter - b.chapter || a.seq - b.seq);
    allData[bookId] = bookData;

    console.log(`   ✅ ${downloaded} downloaded, ${skipped} already existed`);
}

async function generateDataFile() {
    let js = `// ============================================\n`;
    js += `// BIBLE INFOGRAPHICS DATA\n`;
    js += `// Sweet Publishing / unfoldingWord (CC BY-SA 3.0)\n`;
    js += `// Auto-generated — do not edit manually\n`;
    js += `// ============================================\n\n`;
    js += `const BIBLE_INFOGRAPHICS = ${JSON.stringify(allData, null, 2)};\n\n`;
    js += `if (typeof window !== 'undefined') {\n`;
    js += `    window.BIBLE_INFOGRAPHICS = BIBLE_INFOGRAPHICS;\n`;
    js += `}\n`;

    fs.writeFileSync(DATA_FILE, js);

    const totalImages = Object.values(allData).reduce((sum, arr) => sum + arr.length, 0);
    const totalBooks = Object.keys(allData).length;
    console.log(`\n📊 Data file generated: ${DATA_FILE}`);
    console.log(`   ${totalBooks} books, ${totalImages} total infographics`);
}

async function main() {
    console.log('🎨 Sweet Publishing Bible Illustrations Downloader');
    console.log('=' .repeat(50));

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const bookIds = Object.keys(BOOK_CATEGORIES);

    // Process books sequentially to respect rate limits
    for (const id of bookIds) {
        await processBook(id);
        console.log(`⏳ Pausing 3s before next book...`);
        await sleep(3000);
    }

    await generateDataFile();

    console.log('\n✅ All done!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
