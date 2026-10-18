#!/usr/bin/env node
// ============================================
// Process Sweet Publishing Bible Illustrations
// Extracts from ZIP, organizes by book, generates data file
// ============================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = __dirname;
const RAW_DIR = path.join(BASE_DIR, 'infographics-raw');
const ZIP_FILE = path.join(RAW_DIR, 'sweet-610px.zip');
const EXTRACT_DIR = path.join(RAW_DIR, 'extracted');
const OUTPUT_DIR = path.join(BASE_DIR, 'infographics');
const DATA_FILE = path.join(BASE_DIR, 'biblia-infographics-data.js');

// Map Sweet Publishing book numbers to our app book IDs
// Sweet uses standard Protestant canon order (01-66)
const BOOK_NUM_TO_ID = {
    '01': 'GEN', '02': 'EXO', '03': 'LEV', '04': 'NUM', '05': 'DEU',
    '06': 'JOS', '07': 'JUE', '08': 'RUT', '09': '1SA', '10': '2SA',
    '11': '1RE', '12': '2RE', '13': '1CR', '14': '2CR', '15': 'ESD',
    '16': 'NEH', '17': 'EST', '18': 'JOB', '19': 'SAL', '20': 'PRO',
    '21': 'ECL', '22': 'CNT', '23': 'ISA', '24': 'JER', '25': 'LAM',
    '26': 'EZE', '27': 'DAN', '28': 'OSE', '29': 'JOE', '30': 'AMO',
    '31': 'ABD', '32': 'JON', '33': 'MIQ', '34': 'NAH', '35': 'HAB',
    '36': 'SOF', '37': 'HAG', '38': 'ZAC', '39': 'MAL',
    '40': 'MAT', '41': 'MAR', '42': 'LUC', '43': 'JUA', '44': 'HEC',
    '45': 'ROM', '46': '1CO', '47': '2CO', '48': 'GAL', '49': 'EFE',
    '50': 'FIL', '51': 'COL', '52': '1TS', '53': '2TS', '54': '1TI',
    '55': '2TI', '56': 'TIT', '57': 'FLM', '58': 'HEB', '59': 'STG',
    '60': '1PE', '61': '2PE', '62': '1JN', '63': '2JN', '64': '3JN',
    '65': 'JUD', '66': 'APO'
};

const BOOK_NAMES = {
    GEN: 'Génesis', EXO: 'Éxodo', LEV: 'Levítico', NUM: 'Números',
    DEU: 'Deuteronomio', JOS: 'Josué', JUE: 'Jueces', RUT: 'Rut',
    '1SA': '1 Samuel', '2SA': '2 Samuel', '1RE': '1 Reyes', '2RE': '2 Reyes',
    '1CR': '1 Crónicas', '2CR': '2 Crónicas', ESD: 'Esdras', NEH: 'Nehemías',
    EST: 'Ester', JOB: 'Job', SAL: 'Salmos', PRO: 'Proverbios',
    ECL: 'Eclesiastés', CNT: 'Cantares', ISA: 'Isaías', JER: 'Jeremías',
    LAM: 'Lamentaciones', EZE: 'Ezequiel', DAN: 'Daniel', OSE: 'Oseas',
    JOE: 'Joel', AMO: 'Amós', ABD: 'Abdías', JON: 'Jonás',
    MIQ: 'Miqueas', NAH: 'Nahúm', HAB: 'Habacuc', SOF: 'Sofonías',
    HAG: 'Hageo', ZAC: 'Zacarías', MAL: 'Malaquías',
    MAT: 'Mateo', MAR: 'Marcos', LUC: 'Lucas', JUA: 'Juan',
    HEC: 'Hechos', ROM: 'Romanos', '1CO': '1 Corintios', '2CO': '2 Corintios',
    GAL: 'Gálatas', EFE: 'Efesios', FIL: 'Filipenses', COL: 'Colosenses',
    '1TS': '1 Tesalonicenses', '2TS': '2 Tesalonicenses',
    '1TI': '1 Timoteo', '2TI': '2 Timoteo', TIT: 'Tito', FLM: 'Filemón',
    HEB: 'Hebreos', STG: 'Santiago', '1PE': '1 Pedro', '2PE': '2 Pedro',
    '1JN': '1 Juan', '2JN': '2 Juan', '3JN': '3 Juan', JUD: 'Judas',
    APO: 'Apocalipsis'
};

function main() {
    console.log('🎨 Processing Sweet Publishing Bible Illustrations');
    console.log('='.repeat(50));

    // Step 1: Check ZIP exists
    if (!fs.existsSync(ZIP_FILE)) {
        console.error('❌ ZIP file not found:', ZIP_FILE);
        process.exit(1);
    }
    console.log('✅ ZIP file found:', (fs.statSync(ZIP_FILE).size / 1024 / 1024).toFixed(1), 'MB');

    // Step 2: Extract ZIP
    if (!fs.existsSync(EXTRACT_DIR)) {
        fs.mkdirSync(EXTRACT_DIR, { recursive: true });
    }

    console.log('\n📦 Extracting ZIP...');
    try {
        execSync(`unzip -o -q "${ZIP_FILE}" -d "${EXTRACT_DIR}"`, { stdio: 'inherit' });
    } catch (e) {
        // Try 7z on Windows
        try {
            execSync(`7z x "${ZIP_FILE}" -o"${EXTRACT_DIR}" -y`, { stdio: 'inherit' });
        } catch (e2) {
            // Try PowerShell
            execSync(`powershell -Command "Expand-Archive -Path '${ZIP_FILE.replace(/\//g, '\\')}' -DestinationPath '${EXTRACT_DIR.replace(/\//g, '\\')}' -Force"`, { stdio: 'inherit' });
        }
    }

    // Step 3: Find all JPG files
    console.log('\n🔍 Scanning extracted files...');
    const allJpgs = findJpgs(EXTRACT_DIR);
    console.log(`   Found ${allJpgs.length} JPG files`);

    // Step 4: Organize by book
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const allData = {};
    let totalCopied = 0;
    let totalSkipped = 0;

    for (const jpgPath of allJpgs) {
        const filename = path.basename(jpgPath);
        const parsed = parseFilename(filename);
        if (!parsed) continue;

        const { bookNum, chapter, verse } = parsed;
        const bookId = BOOK_NUM_TO_ID[bookNum];
        if (!bookId) continue;

        const bookName = BOOK_NAMES[bookId] || bookId;
        const bookDir = path.join(OUTPUT_DIR, bookId.toLowerCase());
        if (!fs.existsSync(bookDir)) fs.mkdirSync(bookDir, { recursive: true });

        const destName = `${bookId.toLowerCase()}_${chapter}_${verse}.jpg`;
        const destPath = path.join(bookDir, destName);
        const relativePath = `infographics/${bookId.toLowerCase()}/${destName}`;

        if (!fs.existsSync(destPath)) {
            fs.copyFileSync(jpgPath, destPath);
            totalCopied++;
        } else {
            totalSkipped++;
        }

        if (!allData[bookId]) allData[bookId] = [];
        allData[bookId].push({
            title: `${bookName} ${chapter}:${verse}`,
            chapter: parseInt(chapter),
            seq: parseInt(verse),
            local: relativePath
        });
    }

    // Sort each book's images
    for (const bookId of Object.keys(allData)) {
        allData[bookId].sort((a, b) => a.chapter - b.chapter || a.seq - b.seq);
        // Remove duplicates
        allData[bookId] = allData[bookId].filter((item, idx, arr) =>
            idx === 0 || item.chapter !== arr[idx - 1].chapter || item.seq !== arr[idx - 1].seq
        );
    }

    // Step 5: Generate data file
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

    // Stats
    const totalImages = Object.values(allData).reduce((sum, arr) => sum + arr.length, 0);
    const totalBooks = Object.keys(allData).length;

    console.log('\n📊 Results:');
    console.log(`   ${totalCopied} images copied, ${totalSkipped} already existed`);
    console.log(`   ${totalBooks} books with infographics`);
    console.log(`   ${totalImages} total illustrations`);
    console.log(`\n   Data file: ${DATA_FILE}`);

    // Per-book breakdown
    console.log('\n📖 Per-book breakdown:');
    const sortedBooks = Object.entries(allData).sort((a, b) => {
        const numA = Object.entries(BOOK_NUM_TO_ID).find(([_, v]) => v === a[0])?.[0] || '99';
        const numB = Object.entries(BOOK_NUM_TO_ID).find(([_, v]) => v === b[0])?.[0] || '99';
        return numA.localeCompare(numB);
    });
    for (const [bookId, images] of sortedBooks) {
        console.log(`   ${BOOK_NAMES[bookId] || bookId}: ${images.length} ilustraciones`);
    }

    console.log('\n✅ Done!');
}

function findJpgs(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findJpgs(fullPath));
        } else if (entry.name.toLowerCase().endsWith('.jpg') || entry.name.toLowerCase().endsWith('.jpeg')) {
            results.push(fullPath);
        }
    }
    return results;
}

function parseFilename(filename) {
    // Pattern: "01_Ge_01_01_RG.jpg" or similar
    // BookNum_Abbrev_Chapter_Verse_Suffix.jpg
    const m = filename.match(/^(\d{2})_\w+_(\d{2,3})_(\d{2,3}).*\.jpe?g$/i);
    if (m) {
        return {
            bookNum: m[1],
            chapter: parseInt(m[2]).toString(),
            verse: parseInt(m[3]).toString()
        };
    }
    return null;
}

main();
