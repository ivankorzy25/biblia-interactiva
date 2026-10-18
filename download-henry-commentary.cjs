#!/usr/bin/env node
// ============================================
// Download & Parse Matthew Henry Commentary (Spanish)
// Source: Internet Archive (public domain OCR text)
// Outputs: comentario-henry/{bookId}.json
// ============================================

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'comentario-henry');
const TXT_CACHE = path.join(__dirname, 'henry-raw.txt');
const LOG_FILE = path.join(__dirname, 'download-henry.log');
const SOURCE_URL = 'https://archive.org/download/comentario-biblico-de-matthew-henry/comentario%20biblico%20de%20Matthew%20Henry_djvu.txt';

// Book positions identified from the OCR text (start line numbers, 1-based)
// Each entry: [startLine, bookId, chapters]
const BOOK_POSITIONS = [
    [1404, 'genesis', 50],
    [5201, 'exodo', 40],
    [7590, 'levitico', 27],
    [8766, 'numeros', 36],
    [10619, 'deuteronomio', 34],
    [12336, 'josue', 24],        // OCR: "OSUE" (missing J)
    [13392, 'jueces', 21],
    [14351, 'rut', 4],
    [14577, '1samuel', 31],      // "PRIMERA DE SAMUEL"
    [15987, '2samuel', 24],      // "SEGUNDA DE SAMUEL"
    [16970, '1reyes', 22],       // "PRIMERA DE REYES"
    [18101, '2reyes', 25],       // "SEGUNDA DE REYES"
    [19274, '1cronicas', 29],    // "PRIMERA DE CRÓNICAS"
    [19878, '2cronicas', 36],    // "SEGUNDA DE CRÓNICAS"
    [20799, 'esdras', 10],
    [21138, 'nehemias', 13],
    [21619, 'ester', 10],
    [21971, 'job', 42],
    [23972, 'salmos', 150],      // "SALMOS 1 AL 75" + "SALMOS 76 AL 150" (27277)
    [30235, 'proverbios', 31],
    [31873, 'eclesiastes', 12],
    [32497, 'cantares', 8],      // "CANTAR DE LOS CANTARES DE SALOMÓN"
    [33008, 'isaias', 66],
    [36120, 'jeremias', 52],
    [38156, 'lamentaciones', 5],
    [38355, 'ezequiel', 48],
    [39762, 'daniel', 12],
    [40413, 'oseas', 14],
    [41007, 'joel', 3],
    [41739, 'amos', 9],
    [42053, 'abdias', 1],
    [42157, 'jonas', 4],
    [42397, 'miqueas', 7],
    [42696, 'nahum', 3],
    [42792, 'habacuc', 3],
    [42969, 'sofonias', 3],
    [43100, 'hageo', 2],
    [43230, 'zacarias', 14],
    [43942, 'malaquias', 4],
    [45080, 'mateo', 28],
    [48067, 'marcos', 16],
    [49190, 'lucas', 24],
    [51141, 'juan', 21],
    [53225, 'hechos', 28],       // "HECHOS DE LOS APÓSTOLES"
    [55522, 'romanos', 16],
    [57023, '1corintios', 16],   // "12 DE CORINTIOS" (OCR)
    [58190, '2corintios', 13],   // "22 DE CORINTIOS" (OCR)
    [58893, 'galatas', 6],
    [59481, 'efesios', 6],
    [60003, 'filipenses', 4],
    [60337, 'colosenses', 4],
    [60646, '1tesalonicenses', 5],
    [60945, '2tesalonicenses', 3],
    [61180, '1timoteo', 6],
    [61514, '2timoteo', 4],
    [61779, 'tito', 3],
    [61977, 'filemon', 1],
    [62074, 'hebreos', 13],
    [63154, 'santiago', 5],
    [63590, '1pedro', 5],
    [64013, '2pedro', 3],
    [64263, '1juan', 5],
    [64764, '2juan', 1],
    [64836, '3juan', 1],
    [64901, 'judas', 1],
    [65059, 'apocalipsis', 22]
];

// Roman numeral conversion (up to 150 for Psalms)
const ROMAN_MAP = {};
(function buildRomanMap() {
    const vals = [
        ['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]
    ];
    for (let n = 1; n <= 150; n++) {
        let num = n, roman = '';
        for (const [r, v] of vals) {
            while (num >= v) { roman += r; num -= v; }
        }
        ROMAN_MAP[roman] = n;
    }
})();

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n');
}

function fetchFile(url) {
    return new Promise((resolve, reject) => {
        const doFetch = (targetUrl, redirects = 0) => {
            if (redirects > 5) return reject(new Error('Too many redirects'));
            const proto = targetUrl.startsWith('https') ? https : require('http');
            proto.get(targetUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (biblia-web commentary downloader)' }
            }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    const loc = res.headers.location.startsWith('http')
                        ? res.headers.location
                        : new URL(res.headers.location, targetUrl).href;
                    return doFetch(loc, redirects + 1);
                }
                if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
                res.on('error', reject);
            }).on('error', reject);
        };
        doFetch(url);
    });
}

function romanToArabic(roman) {
    return ROMAN_MAP[roman.trim().toUpperCase()] || null;
}

/**
 * Parse "CAPÍTULO X", "CAPITULO X", or "SALMO X" (Roman or Arabic numerals)
 */
function matchChapter(line) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(?:CAP[IÍ]TULO|SALMO)\s+([IVXLCDM]+|\d+)\s*$/i);
    if (!match) return null;
    const num = match[1];
    const arabic = parseInt(num);
    if (!isNaN(arabic)) return arabic;
    return romanToArabic(num);
}

/**
 * Parse verse range markers: "Vv. 1—5. Title" or "V. 1. Title"
 */
function matchVerseRange(line) {
    const trimmed = line.trim();
    // Match: "Vv. 1—5. Title", "V. 1. Title", "Versículos 1—7. Title", "VERSÍCULOS 1—7. Title"
    const match = trimmed.match(
        /^(?:Vv?\.\s*|[Vv]ers[ií]culos?\s+)(\d+)(?:\s*[—–,-]\s*(\d+))?\.\s*(.*)/i
    );
    if (!match) return null;
    const start = match[1];
    const end = match[2] || start;
    const title = (match[3] || '').trim();
    return { verses: start === end ? start : `${start}-${end}`, title };
}

/**
 * Parse a book's text range into chapters and sections
 */
function parseBookRange(lines, startLine, endLine, bookId, maxChapters) {
    const bookData = {};
    let currentChapter = null;
    let currentKey = null;
    let currentSection = null;
    let introBuffer = '';
    let sectionTextBuffer = '';
    let linesSinceChapter = 0;
    let foundFirstChapter = false;

    // For single-chapter books, auto-create chapter 1 context
    const isSingleChapter = maxChapters === 1;
    if (isSingleChapter) {
        currentChapter = 1;
        currentKey = `${bookId}_1`;
        bookData[currentKey] = { intro: '', sections: [] };
        foundFirstChapter = true;
    }

    for (let i = startLine; i < endLine && i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Check for chapter heading
        const chapterNum = matchChapter(trimmed);
        if (chapterNum !== null && chapterNum > 0 && chapterNum <= maxChapters) {
            // Save previous state
            finishSection();
            finishChapter();

            currentChapter = chapterNum;
            currentKey = `${bookId}_${currentChapter}`;
            currentSection = null;
            introBuffer = '';
            sectionTextBuffer = '';
            linesSinceChapter = 0;
            foundFirstChapter = true;

            if (!bookData[currentKey]) {
                bookData[currentKey] = { intro: '', sections: [] };
            }
            continue;
        }

        if (!foundFirstChapter || !currentChapter || !currentKey) continue;
        linesSinceChapter++;

        // Check for verse range section header
        const verseMatch = matchVerseRange(trimmed);
        if (verseMatch) {
            finishSection();
            currentSection = {
                verses: verseMatch.verses,
                title: verseMatch.title,
                text: ''
            };
            sectionTextBuffer = '';
            continue;
        }

        // Skip page numbers (standalone short numbers)
        if (/^\d{1,4}$/.test(trimmed)) continue;

        // Skip OCR garbage (lines that are mostly non-letter characters)
        if (trimmed.length < 4) continue;
        const letterRatio = (trimmed.match(/[a-záéíóúñüA-ZÁÉÍÓÚÑÜ]/g) || []).length / trimmed.length;
        if (letterRatio < 0.5 && trimmed.length < 30) continue;

        // Accumulate text
        if (currentSection) {
            sectionTextBuffer += (sectionTextBuffer ? ' ' : '') + trimmed;
        } else if (linesSinceChapter <= 4) {
            // First few lines = chapter summary/intro
            introBuffer += (introBuffer ? ' ' : '') + trimmed;
        } else {
            // No section header found, create default section
            currentSection = { verses: '1', title: '', text: '' };
            sectionTextBuffer = trimmed;
        }
    }

    finishSection();
    finishChapter();

    function finishSection() {
        if (currentSection && sectionTextBuffer && currentKey && bookData[currentKey]) {
            currentSection.text = sectionTextBuffer.trim();
            if (currentSection.text.length > 30) {
                bookData[currentKey].sections.push({ ...currentSection });
            }
        }
        sectionTextBuffer = '';
    }

    function finishChapter() {
        if (currentKey && bookData[currentKey]) {
            if (introBuffer.trim()) {
                bookData[currentKey].intro = introBuffer.trim();
            }
            // Remove chapters with no content
            if (!bookData[currentKey].intro && bookData[currentKey].sections.length === 0) {
                delete bookData[currentKey];
            }
        }
        introBuffer = '';
    }

    return bookData;
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Clear log
    if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

    log('=== Matthew Henry Commentary Download & Parse ===');
    log(`Source: ${SOURCE_URL}`);
    log(`Output: ${OUTPUT_DIR}`);

    // Step 1: Download or use cached text
    let text;
    if (fs.existsSync(TXT_CACHE)) {
        log(`Using cached text: ${TXT_CACHE}`);
        text = fs.readFileSync(TXT_CACHE, 'utf8');
    } else {
        log('Downloading from Internet Archive...');
        text = await fetchFile(SOURCE_URL);
        fs.writeFileSync(TXT_CACHE, text, 'utf8');
        log(`Downloaded: ${(text.length / 1024 / 1024).toFixed(1)} MB`);
    }

    const lines = text.split('\n');
    log(`Total lines: ${lines.length}`);

    // Step 2: Parse each book using known line positions
    let totalBooks = 0;
    let totalChapters = 0;
    let totalSections = 0;

    for (let b = 0; b < BOOK_POSITIONS.length; b++) {
        const [startLine, bookId, maxChapters] = BOOK_POSITIONS[b];
        // End line = start of next book (or end of file)
        const endLine = b + 1 < BOOK_POSITIONS.length ? BOOK_POSITIONS[b + 1][0] : lines.length;

        // Special case: Salmos spans two sections (SALMOS 1 AL 75 at 23972 + SALMOS 76 AL 150 at 27277)
        // Both are captured in the range [23972, 30235) since proverbios starts at 30235

        const bookData = parseBookRange(lines, startLine - 1, endLine - 1, bookId, maxChapters);
        const chapters = Object.keys(bookData).length;
        const sections = Object.values(bookData).reduce((sum, ch) => sum + ch.sections.length, 0);

        if (chapters > 0) {
            const outFile = path.join(OUTPUT_DIR, `${bookId}.json`);
            fs.writeFileSync(outFile, JSON.stringify(bookData, null, 2), 'utf8');
            log(`  ${bookId}: ${chapters}/${maxChapters} chapters, ${sections} sections`);
            totalBooks++;
            totalChapters += chapters;
            totalSections += sections;
        } else {
            log(`  WARNING: ${bookId} - no chapters found`);
        }
    }

    log('\n=== Parse Complete ===');
    log(`Books: ${totalBooks}/66`);
    log(`Chapters: ${totalChapters}`);
    log(`Sections: ${totalSections}`);
    log(`JSON files: ${OUTPUT_DIR}`);
}

main().catch(err => {
    log(`FATAL: ${err.message}`);
    console.error(err);
    process.exit(1);
});
