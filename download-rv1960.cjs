#!/usr/bin/env node
// ============================================
// Download RV1960 (Reina-Valera 1960) from bolls.life API
// Replaces biblia-data.js with authentic RV1960 text
// ============================================

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'biblia-data.js');
const LOG_FILE = path.join(__dirname, 'download-rv1960.log');
const API_BASE = 'https://bolls.life/get-chapter/RV1960';

// Book definitions matching the existing BIBLE_BOOKS structure
const BOOKS = [
    // Old Testament
    { id: 'genesis', name: 'Génesis', abbr: 'Gn', chapters: 50, testament: 'old', apiBook: 1 },
    { id: 'exodo', name: 'Éxodo', abbr: 'Ex', chapters: 40, testament: 'old', apiBook: 2 },
    { id: 'levitico', name: 'Levítico', abbr: 'Lv', chapters: 27, testament: 'old', apiBook: 3 },
    { id: 'numeros', name: 'Números', abbr: 'Nm', chapters: 36, testament: 'old', apiBook: 4 },
    { id: 'deuteronomio', name: 'Deuteronomio', abbr: 'Dt', chapters: 34, testament: 'old', apiBook: 5 },
    { id: 'josue', name: 'Josué', abbr: 'Jos', chapters: 24, testament: 'old', apiBook: 6 },
    { id: 'jueces', name: 'Jueces', abbr: 'Jue', chapters: 21, testament: 'old', apiBook: 7 },
    { id: 'rut', name: 'Rut', abbr: 'Rt', chapters: 4, testament: 'old', apiBook: 8 },
    { id: '1samuel', name: '1 Samuel', abbr: '1 S', chapters: 31, testament: 'old', apiBook: 9 },
    { id: '2samuel', name: '2 Samuel', abbr: '2 S', chapters: 24, testament: 'old', apiBook: 10 },
    { id: '1reyes', name: '1 Reyes', abbr: '1 R', chapters: 22, testament: 'old', apiBook: 11 },
    { id: '2reyes', name: '2 Reyes', abbr: '2 R', chapters: 25, testament: 'old', apiBook: 12 },
    { id: '1cronicas', name: '1 Crónicas', abbr: '1 Cr', chapters: 29, testament: 'old', apiBook: 13 },
    { id: '2cronicas', name: '2 Crónicas', abbr: '2 Cr', chapters: 36, testament: 'old', apiBook: 14 },
    { id: 'esdras', name: 'Esdras', abbr: 'Esd', chapters: 10, testament: 'old', apiBook: 15 },
    { id: 'nehemias', name: 'Nehemías', abbr: 'Neh', chapters: 13, testament: 'old', apiBook: 16 },
    { id: 'ester', name: 'Ester', abbr: 'Est', chapters: 10, testament: 'old', apiBook: 17 },
    { id: 'job', name: 'Job', abbr: 'Job', chapters: 42, testament: 'old', apiBook: 18 },
    { id: 'salmos', name: 'Salmos', abbr: 'Sal', chapters: 150, testament: 'old', apiBook: 19 },
    { id: 'proverbios', name: 'Proverbios', abbr: 'Pr', chapters: 31, testament: 'old', apiBook: 20 },
    { id: 'eclesiastes', name: 'Eclesiastés', abbr: 'Ec', chapters: 12, testament: 'old', apiBook: 21 },
    { id: 'cantares', name: 'Cantares', abbr: 'Cnt', chapters: 8, testament: 'old', apiBook: 22 },
    { id: 'isaias', name: 'Isaías', abbr: 'Is', chapters: 66, testament: 'old', apiBook: 23 },
    { id: 'jeremias', name: 'Jeremías', abbr: 'Jer', chapters: 52, testament: 'old', apiBook: 24 },
    { id: 'lamentaciones', name: 'Lamentaciones', abbr: 'Lm', chapters: 5, testament: 'old', apiBook: 25 },
    { id: 'ezequiel', name: 'Ezequiel', abbr: 'Ez', chapters: 48, testament: 'old', apiBook: 26 },
    { id: 'daniel', name: 'Daniel', abbr: 'Dn', chapters: 12, testament: 'old', apiBook: 27 },
    { id: 'oseas', name: 'Oseas', abbr: 'Os', chapters: 14, testament: 'old', apiBook: 28 },
    { id: 'joel', name: 'Joel', abbr: 'Jl', chapters: 3, testament: 'old', apiBook: 29 },
    { id: 'amos', name: 'Amós', abbr: 'Am', chapters: 9, testament: 'old', apiBook: 30 },
    { id: 'abdias', name: 'Abdías', abbr: 'Abd', chapters: 1, testament: 'old', apiBook: 31 },
    { id: 'jonas', name: 'Jonás', abbr: 'Jon', chapters: 4, testament: 'old', apiBook: 32 },
    { id: 'miqueas', name: 'Miqueas', abbr: 'Mi', chapters: 7, testament: 'old', apiBook: 33 },
    { id: 'nahum', name: 'Nahúm', abbr: 'Nah', chapters: 3, testament: 'old', apiBook: 34 },
    { id: 'habacuc', name: 'Habacuc', abbr: 'Hab', chapters: 3, testament: 'old', apiBook: 35 },
    { id: 'sofonias', name: 'Sofonías', abbr: 'Sof', chapters: 3, testament: 'old', apiBook: 36 },
    { id: 'hageo', name: 'Hageo', abbr: 'Hag', chapters: 2, testament: 'old', apiBook: 37 },
    { id: 'zacarias', name: 'Zacarías', abbr: 'Zac', chapters: 14, testament: 'old', apiBook: 38 },
    { id: 'malaquias', name: 'Malaquías', abbr: 'Mal', chapters: 4, testament: 'old', apiBook: 39 },
    // New Testament
    { id: 'mateo', name: 'Mateo', abbr: 'Mt', chapters: 28, testament: 'new', apiBook: 40 },
    { id: 'marcos', name: 'Marcos', abbr: 'Mr', chapters: 16, testament: 'new', apiBook: 41 },
    { id: 'lucas', name: 'Lucas', abbr: 'Lc', chapters: 24, testament: 'new', apiBook: 42 },
    { id: 'juan', name: 'Juan', abbr: 'Jn', chapters: 21, testament: 'new', apiBook: 43 },
    { id: 'hechos', name: 'Hechos', abbr: 'Hch', chapters: 28, testament: 'new', apiBook: 44 },
    { id: 'romanos', name: 'Romanos', abbr: 'Ro', chapters: 16, testament: 'new', apiBook: 45 },
    { id: '1corintios', name: '1 Corintios', abbr: '1 Co', chapters: 16, testament: 'new', apiBook: 46 },
    { id: '2corintios', name: '2 Corintios', abbr: '2 Co', chapters: 13, testament: 'new', apiBook: 47 },
    { id: 'galatas', name: 'Gálatas', abbr: 'Gá', chapters: 6, testament: 'new', apiBook: 48 },
    { id: 'efesios', name: 'Efesios', abbr: 'Ef', chapters: 6, testament: 'new', apiBook: 49 },
    { id: 'filipenses', name: 'Filipenses', abbr: 'Fil', chapters: 4, testament: 'new', apiBook: 50 },
    { id: 'colosenses', name: 'Colosenses', abbr: 'Col', chapters: 4, testament: 'new', apiBook: 51 },
    { id: '1tesalonicenses', name: '1 Tesalonicenses', abbr: '1 Ts', chapters: 5, testament: 'new', apiBook: 52 },
    { id: '2tesalonicenses', name: '2 Tesalonicenses', abbr: '2 Ts', chapters: 3, testament: 'new', apiBook: 53 },
    { id: '1timoteo', name: '1 Timoteo', abbr: '1 Ti', chapters: 6, testament: 'new', apiBook: 54 },
    { id: '2timoteo', name: '2 Timoteo', abbr: '2 Ti', chapters: 4, testament: 'new', apiBook: 55 },
    { id: 'tito', name: 'Tito', abbr: 'Tit', chapters: 3, testament: 'new', apiBook: 56 },
    { id: 'filemon', name: 'Filemón', abbr: 'Flm', chapters: 1, testament: 'new', apiBook: 57 },
    { id: 'hebreos', name: 'Hebreos', abbr: 'He', chapters: 13, testament: 'new', apiBook: 58 },
    { id: 'santiago', name: 'Santiago', abbr: 'Stg', chapters: 5, testament: 'new', apiBook: 59 },
    { id: '1pedro', name: '1 Pedro', abbr: '1 P', chapters: 5, testament: 'new', apiBook: 60 },
    { id: '2pedro', name: '2 Pedro', abbr: '2 P', chapters: 3, testament: 'new', apiBook: 61 },
    { id: '1juan', name: '1 Juan', abbr: '1 Jn', chapters: 5, testament: 'new', apiBook: 62 },
    { id: '2juan', name: '2 Juan', abbr: '2 Jn', chapters: 1, testament: 'new', apiBook: 63 },
    { id: '3juan', name: '3 Juan', abbr: '3 Jn', chapters: 1, testament: 'new', apiBook: 64 },
    { id: 'judas', name: 'Judas', abbr: 'Jud', chapters: 1, testament: 'new', apiBook: 65 },
    { id: 'apocalipsis', name: 'Apocalipsis', abbr: 'Ap', chapters: 22, testament: 'new', apiBook: 66 },
];

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n');
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (biblia-web RV1960 downloader)' }
        }, (res) => {
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

function cleanText(text) {
    if (!text) return '';
    // Remove HTML tags (e.g. <br>, <a> references)
    return text
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function main() {
    if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

    log('=== RV1960 Download from bolls.life ===');
    log(`Total books: ${BOOKS.length}`);

    const totalChapters = BOOKS.reduce((sum, b) => sum + b.chapters, 0);
    log(`Total chapters to fetch: ${totalChapters}`);

    const BIBLE_TEXT = {};
    let fetchedChapters = 0;
    let totalVerses = 0;
    let errors = 0;

    for (const book of BOOKS) {
        log(`Downloading ${book.name} (${book.chapters} chapters)...`);

        for (let ch = 1; ch <= book.chapters; ch++) {
            const url = `${API_BASE}/${book.apiBook}/${ch}/`;
            const key = `${book.id}_${ch}`;

            try {
                const verses = await fetchJSON(url);

                if (!Array.isArray(verses) || verses.length === 0) {
                    log(`  WARNING: ${key} - empty response`);
                    errors++;
                    continue;
                }

                BIBLE_TEXT[key] = verses.map(v => ({
                    verse: v.verse,
                    text: cleanText(v.text)
                }));

                totalVerses += verses.length;
                fetchedChapters++;

                // Rate limit: 100ms between requests
                await sleep(100);

            } catch (err) {
                log(`  ERROR: ${key} - ${err.message}`);
                errors++;

                // Retry once after 2 seconds
                await sleep(2000);
                try {
                    const verses = await fetchJSON(url);
                    if (Array.isArray(verses) && verses.length > 0) {
                        BIBLE_TEXT[key] = verses.map(v => ({
                            verse: v.verse,
                            text: cleanText(v.text)
                        }));
                        totalVerses += verses.length;
                        fetchedChapters++;
                        errors--;
                        log(`  RETRY OK: ${key}`);
                    }
                } catch (retryErr) {
                    log(`  RETRY FAILED: ${key} - ${retryErr.message}`);
                }
            }
        }

        log(`  ${book.name}: done (${fetchedChapters}/${totalChapters} total)`);
    }

    log('\n=== Generating biblia-data.js ===');

    // Build BIBLE_BOOKS array (without apiBook field)
    const booksArray = BOOKS.map(b => {
        return `  { id: '${b.id}', name: '${b.name}', abbr: '${b.abbr}', chapters: ${b.chapters}, testament: '${b.testament}' }`;
    });

    // Build output
    let output = '// Biblia Reina-Valera 1960 - Texto completo\n';
    output += '// Generado desde bolls.life API - RV1960 auténtica\n\n';
    output += '// Lista de libros de la Biblia\n';
    output += 'const BIBLE_BOOKS = [\n';
    output += ' // Antiguo Testamento\n';

    let inNT = false;
    for (const line of booksArray) {
        const book = BOOKS[booksArray.indexOf(line)];
        if (!inNT && book.testament === 'new') {
            output += ' // Nuevo Testamento\n';
            inNT = true;
        }
        output += line + ',\n';
    }

    output += '];\n\n';
    output += '// Texto bíblico completo - RV1960\n';
    output += 'const BIBLE_TEXT = {\n';

    const keys = Object.keys(BIBLE_TEXT);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const verses = BIBLE_TEXT[key];
        const versesJSON = JSON.stringify(verses);
        output += ` "${key}": ${versesJSON}`;
        if (i < keys.length - 1) output += ',';
        output += '\n';
    }

    output += '};\n';

    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
    const sizeMB = (Buffer.byteLength(output, 'utf8') / 1024 / 1024).toFixed(1);

    log(`\n=== Download Complete ===`);
    log(`Books: ${BOOKS.length}/66`);
    log(`Chapters: ${fetchedChapters}/${totalChapters}`);
    log(`Verses: ${totalVerses}`);
    log(`Errors: ${errors}`);
    log(`Output: ${OUTPUT_FILE} (${sizeMB} MB)`);
}

main().catch(err => {
    log(`FATAL: ${err.message}`);
    console.error(err);
    process.exit(1);
});
