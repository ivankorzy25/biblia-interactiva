// =============================================================
// BIBLE IMAGES GENERATOR V2
// Doré + Schnorr von Carolsfeld + William Hole + Medhurst
// Downloads all images + generates biblia-images-data.js
// =============================================================
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Delay between downloads (30s to avoid Wikimedia 429)
const DELAY_MS = 30000;

// ============================================================
// SCHNORR VON CAROLSFELD - Die Bibel in Bildern (1860)
// 130 figurative narrative woodcuts
// ============================================================
const SCHNORR = [
  // GENESIS
  ["schnorr_008", "008", "La Caída - Adán y Eva", "genesis", [3], 6],
  ["schnorr_009", "009", "La Confrontación tras la Caída", "genesis", [3], 11],
  ["schnorr_010", "010", "Expulsión del Edén", "genesis", [3], 24],
  ["schnorr_011", "011", "Adán, Eva y su Familia", "genesis", [4], 1],
  ["schnorr_012", "012", "Caín y Abel ofrecen sacrificios", "genesis", [4], 3],
  ["schnorr_013", "013", "Caín mata a Abel", "genesis", [4], 8],
  ["schnorr_014", "014", "Caín funda la ciudad de Enoc", "genesis", [4], 17],
  ["schnorr_015", "015", "Los días de Noé", "genesis", [6], 5],
  ["schnorr_016", "016", "El Arca de Noé", "genesis", [7], 7],
  ["schnorr_017", "017", "El Diluvio", "genesis", [7], 17],
  ["schnorr_018", "018", "Noé sale del Arca", "genesis", [8], 18],
  ["schnorr_020", "020", "Noé maldice a Cam", "genesis", [9], 25],
  ["schnorr_021", "021", "La Torre de Babel", "genesis", [11], 4],
  ["schnorr_023", "023", "Abram y Melquisedec", "genesis", [14], 18],
  ["schnorr_024", "024", "Abram deja Harán", "genesis", [12], 4],
  ["schnorr_026", "026", "Huida de Sodoma y Gomorra", "genesis", [19], 15],
  ["schnorr_027", "027", "Agar e Ismael son expulsados", "genesis", [21], 14],
  ["schnorr_029", "029", "Rebeca en el pozo", "genesis", [24], 15],
  ["schnorr_030", "030", "Isaac y Rebeca se encuentran", "genesis", [24], 63],
  ["schnorr_031", "031", "Isaac bendice a Jacob", "genesis", [27], 27],
  ["schnorr_033", "033", "Jacob encuentra a Raquel", "genesis", [29], 10],
  ["schnorr_034", "034", "Jacob trabaja para Labán", "genesis", [29], 20],
  ["schnorr_035", "035", "Jacob huye de Labán", "genesis", [31], 17],
  ["schnorr_037", "037", "Reunión de Jacob y Esaú", "genesis", [33], 4],
  ["schnorr_038", "038", "Los ismaelitas compran a José", "genesis", [37], 28],
  ["schnorr_039", "039", "José y la esposa de Potifar", "genesis", [39], 12],
  ["schnorr_040", "040", "José interpreta los sueños del Faraón", "genesis", [41], 25],
  ["schnorr_041", "041", "José promovido en Egipto", "genesis", [41], 40],
  ["schnorr_042", "042", "José se revela a sus hermanos", "genesis", [45], 3],
  ["schnorr_043", "043", "Reunión de Jacob y José", "genesis", [46], 29],
  // EXODO
  ["schnorr_044", "044", "Esclavitud y matanza de inocentes", "exodo", [1], 16],
  ["schnorr_045", "045", "Moisés es encontrado", "exodo", [2], 5],
  ["schnorr_046", "046", "Moisés mata a un egipcio", "exodo", [2], 12],
  ["schnorr_048", "048", "Varas convertidas en serpientes", "exodo", [7], 10],
  ["schnorr_049", "049", "La Pascua y muerte de los primogénitos", "exodo", [12], 29],
  ["schnorr_050", "050", "El Faraón libera a los hebreos", "exodo", [12], 31],
  ["schnorr_051", "051", "El cántico de María", "exodo", [15], 20],
  ["schnorr_052", "052", "Maná y agua de la roca", "exodo", [16,17], 4],
  ["schnorr_053", "053", "Batalla contra los amalecitas", "exodo", [17], 11],
  ["schnorr_055", "055", "El becerro de oro", "exodo", [32], 4],
  ["schnorr_056", "056", "El juicio tras el becerro de oro", "exodo", [32], 27],
  // NUMEROS
  ["schnorr_058", "058", "Los espías regresan con frutos", "numeros", [13], 23],
  ["schnorr_059", "059", "La rebelión de Coré", "numeros", [16], 31],
  ["schnorr_062", "062", "El asna de Balaam", "numeros", [22], 28],
  ["schnorr_063", "063", "La elección de Josué", "numeros", [27], 18],
  // DEUTERONOMIO
  ["schnorr_064", "064", "Moisés contempla la Tierra Prometida", "deuteronomio", [34], 1],
  ["schnorr_065", "065", "Entierro de Moisés", "deuteronomio", [34], 5],
  // JOSUE
  ["schnorr_066", "066", "Rahab y los espías", "josue", [2], 4],
  ["schnorr_067", "067", "Cruce del Jordán", "josue", [3], 14],
  ["schnorr_069", "069", "La batalla de Jericó", "josue", [6], 20],
  ["schnorr_070", "070", "La caída de Hai", "josue", [8], 19],
  ["schnorr_071", "071", "El sol se detiene", "josue", [10], 12],
  ["schnorr_072", "072", "Los reyes capturados", "josue", [10], 22],
  ["schnorr_073", "073", "Repartición de la herencia tribal", "josue", [13], 7],
  // JUECES
  ["schnorr_074", "074", "Jael y Sísara", "jueces", [4], 22],
  ["schnorr_076", "076", "Gedeón elige sus soldados", "jueces", [7], 5],
  ["schnorr_077", "077", "Muerte de Abimelec", "jueces", [9], 53],
  ["schnorr_078", "078", "La hija de Jefté", "jueces", [11], 34],
  ["schnorr_079", "079", "Sansón mata un león", "jueces", [14], 6],
  ["schnorr_080", "080", "Sansón mata mil filisteos", "jueces", [15], 15],
  ["schnorr_081", "081", "Sansón y Dalila", "jueces", [16], 19],
  ["schnorr_082", "082", "Muerte de Sansón", "jueces", [16], 30],
  ["schnorr_083", "083", "Los benjaminitas toman esposas de Siló", "jueces", [21], 21],
  // RUT
  ["schnorr_084", "084", "Noemí, Rut y Orfa", "rut", [1], 14],
  ["schnorr_085", "085", "Booz encuentra a Rut", "rut", [2], 5],
  // 1 SAMUEL
  ["schnorr_088", "088", "Muerte de Elí", "1samuel", [4], 18],
  ["schnorr_089", "089", "Samuel unge a Saúl", "1samuel", [10], 1],
  ["schnorr_090", "090", "Dios rechaza a Saúl", "1samuel", [15], 26],
  ["schnorr_091", "091", "David es elegido", "1samuel", [16], 12],
  ["schnorr_092", "092", "David y Goliat", "1samuel", [17], 49],
  ["schnorr_093", "093", "Saúl ataca a David", "1samuel", [18], 11],
  ["schnorr_094", "094", "David y Jonatán", "1samuel", [20], 41],
  ["schnorr_095", "095", "David perdona la vida de Saúl", "1samuel", [24], 8],
  ["schnorr_096", "096", "David y Abigaíl", "1samuel", [25], 23],
  ["schnorr_097", "097", "Saúl y la adivina de Endor", "1samuel", [28], 14],
  ["schnorr_098", "098", "Muerte de Saúl", "1samuel", [31], 4],
  // 2 SAMUEL
  ["schnorr_099", "099", "David ungido como rey", "2samuel", [2], 4],
  ["schnorr_100", "100", "David lleva el Arca a Jerusalén", "2samuel", [6], 14],
  ["schnorr_101", "101", "David y Betsabé", "2samuel", [11], 2],
  ["schnorr_102", "102", "Natán confronta a David", "2samuel", [12], 7],
  ["schnorr_103", "103", "El hijo de David muere", "2samuel", [12], 18],
  ["schnorr_104", "104", "Simei maldice a David", "2samuel", [16], 5],
  ["schnorr_105", "105", "Muerte de Absalón", "2samuel", [18], 9],
  ["schnorr_106", "106", "David derrama el agua", "2samuel", [23], 16],
  // 1 REYES
  ["schnorr_108", "108", "Salomón es coronado rey", "1reyes", [1], 39],
  ["schnorr_109", "109", "La sabiduría de Salomón", "1reyes", [3], 25],
  ["schnorr_110", "110", "Construcción del Templo", "1reyes", [5], 5],
  ["schnorr_111", "111", "La Reina de Sabá", "1reyes", [10], 2],
  ["schnorr_112", "112", "La idolatría de Salomón", "1reyes", [11], 4],
  ["schnorr_113", "113", "Roboam y Jeroboam", "1reyes", [12], 16],
  ["schnorr_115", "115", "Elías resucita al hijo de la viuda", "1reyes", [17], 22],
  ["schnorr_116", "116", "Matanza de los profetas de Baal", "1reyes", [18], 40],
  ["schnorr_118", "118", "Muerte de Acab", "1reyes", [22], 34],
  // 2 REYES
  ["schnorr_120", "120", "Eliseo resucita al hijo de la sunamita", "2reyes", [4], 34],
  ["schnorr_121", "121", "Muerte de Jezabel", "2reyes", [9], 33],
  ["schnorr_122", "122", "Jerusalén liberada de Senaquerib", "2reyes", [19], 35],
  ["schnorr_123", "123", "Hallazgo del Libro de la Ley", "2reyes", [22], 8],
  ["schnorr_124", "124", "Caída de Jerusalén", "2reyes", [25], 9],
  // ESDRAS/NEHEMIAS
  ["schnorr_125", "125", "Regreso del exilio", "esdras", [1], 5],
  ["schnorr_126", "126", "Reconstrucción del Templo", "esdras", [3], 10],
  ["schnorr_128", "128", "Esdras lee el Libro de la Ley", "nehemias", [8], 3],
  // ESTER
  ["schnorr_129", "129", "La coronación de Ester", "ester", [2], 17],
  ["schnorr_130", "130", "Mardoqueo es honrado", "ester", [6], 11],
  // JOB
  ["schnorr_131", "131", "Mensajeros llegan a Job", "job", [1], 14],
  ["schnorr_132", "132", "La aflicción de Job", "job", [2], 7],
  ["schnorr_133", "133", "La restauración de Job", "job", [42], 10],
  // JEREMIAS/LAMENTACIONES
  ["schnorr_140", "140", "El llamado de Jeremías", "jeremias", [1], 5],
  ["schnorr_141", "141", "El lamento de Jeremías", "lamentaciones", [1], 1],
  // DANIEL
  ["schnorr_143", "143", "Daniel interpreta la escritura en la pared", "daniel", [5], 25],
  ["schnorr_160", "160", "Daniel en el foso de los leones", "daniel", [6], 16],
  // NT - EVANGELIOS
  ["schnorr_163", "163", "La Visitación", "lucas", [1], 39],
  ["schnorr_164", "164", "Nombramiento de Juan el Bautista", "lucas", [1], 63],
  ["schnorr_166", "166", "Los pastores visitan al niño", "lucas", [2], 16],
  ["schnorr_168", "168", "Simeón y Ana", "lucas", [2], 28],
  ["schnorr_169", "169", "La visita de los Reyes Magos", "mateo", [2], 11],
  ["schnorr_171", "171", "Huida a Egipto", "mateo", [2], 14],
  ["schnorr_172", "172", "Matanza de los inocentes", "mateo", [2], 16],
  ["schnorr_173", "173", "El joven Jesús en el Templo", "lucas", [2], 46],
  ["schnorr_174", "174", "Juan el Bautista", "mateo", [3], 1],
  ["schnorr_178", "178", "Los primeros discípulos", "juan", [1], 40],
  ["schnorr_179", "179", "Las bodas de Caná", "juan", [2], 1],
  ["schnorr_180", "180", "Purificación del Templo", "juan", [2], 15],
  ["schnorr_181", "181", "Nicodemo", "juan", [3], 1],
  ["schnorr_182", "182", "La mujer samaritana en el pozo", "juan", [4], 7],
  ["schnorr_183", "183", "Jesús sana a un paralítico", "marcos", [2], 3],
  ["schnorr_184", "184", "La hija de Jairo", "marcos", [5], 41],
  ["schnorr_186", "186", "El Sermón del Monte", "mateo", [5], 1],
  ["schnorr_187", "187", "Muerte de Juan el Bautista", "marcos", [6], 27],
  ["schnorr_189", "189", "Jesús perdona a la mujer adúltera", "juan", [8], 11],
  ["schnorr_190", "190", "Jesús duerme en la barca", "marcos", [4], 38],
  ["schnorr_193", "193", "Alimentación de los cinco mil", "mateo", [14], 19],
  ["schnorr_196", "196", "María y Marta", "lucas", [10], 38],
  ["schnorr_197", "197", "Parábola del buen samaritano", "lucas", [10], 30],
  ["schnorr_198", "198", "Parábola del hijo pródigo", "lucas", [15], 11],
  ["schnorr_199", "199", "El rico y Lázaro", "lucas", [16], 19],
  ["schnorr_202", "202", "Jesús resucita a Lázaro", "juan", [11], 43],
  ["schnorr_205", "205", "La entrada triunfal en Jerusalén", "mateo", [21], 8],
  ["schnorr_207", "207", "La Última Cena", "mateo", [26], 26],
  ["schnorr_208", "208", "Jesús en Getsemaní", "mateo", [26], 36],
  ["schnorr_209", "209", "El arresto de Jesús", "mateo", [26], 47],
  ["schnorr_210", "210", "Jesús ante Caifás", "mateo", [26], 57],
  ["schnorr_211", "211", "Pedro niega a Jesús", "mateo", [26], 69],
  ["schnorr_213", "213", "Pilato entrega a Jesús", "mateo", [27], 24],
  ["schnorr_214", "214", "Muerte de Judas Iscariote", "mateo", [27], 5],
  ["schnorr_215", "215", "Jesús carga la cruz", "mateo", [27], 32],
  ["schnorr_217", "217", "La sepultura de Jesús", "mateo", [27], 59],
  ["schnorr_222", "222", "El camino a Emaús", "lucas", [24], 15],
  ["schnorr_223", "223", "Tomás el incrédulo", "juan", [20], 27],
  ["schnorr_224", "224", "La pesca milagrosa", "juan", [21], 6],
  // HECHOS
  ["schnorr_227", "227", "Sanación del mendigo tullido", "hechos", [3], 6],
  ["schnorr_228", "228", "Lapidación de Esteban", "hechos", [7], 58],
  ["schnorr_229", "229", "El eunuco etíope", "hechos", [8], 30],
  ["schnorr_232", "232", "Pablo y Bernabé en Listra", "hechos", [14], 11],
  ["schnorr_233", "233", "Pablo en el Areópago", "hechos", [17], 22],
  ["schnorr_235", "235", "Pablo llega a Roma", "hechos", [28], 14],
];

// Build Schnorr URL: consistent pattern
function schnorrUrl(num) {
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${schnorrHash(num)}/Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_${num}.png/960px-Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_${num}.png`;
}

// We don't know the hash paths, so use the Wikimedia API to resolve them
function schnorrApiUrl(num) {
  const fname = `Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_${num}.png`;
  return `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fname)}&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`;
}

// ============================================================
// WILLIAM HOLE - Life of Jesus (c. 1906)
// ============================================================
const HOLE = [
  ["hole_001", "Joseph_and_Mary_arrive_at_Bethlehem.jpg", "José y María llegan a Belén", "lucas", [2], 4],
  ["hole_014", "The_Sermon_on_the_Mount_-_William_Brassey_Hole.jpg", "El Sermón del Monte", "mateo", [5], 1],
  ["hole_009", "Hole_calming_a_storm.jpg", "Jesús calma la tempestad", "marcos", [4], 39],
  ["hole_010", "Hole_Feeding_the_multitude.jpg", "Alimentación de la multitud", "mateo", [14], 19],
  ["hole_020", "Entry_into_Jerusalem_-_William_Brassey_Hole.jpg", "Entrada triunfal en Jerusalén", "mateo", [21], 8],
  ["hole_017", "William_Hole_Jesus_Casts_Out_The_Money_Changers.jpg", "Jesús expulsa a los cambistas", "juan", [2], 15],
  ["hole_023", "JesusPilate.jpg", "Jesús ante Pilato", "mateo", [27], 11],
  ["hole_026", "The_submission_of_Coniah_to_Nebuchadnezzar_-_W.B._Hole.jpg", "Conías ante Nabucodonosor", "2reyes", [24], 12],
];

// ============================================================
// DOWNLOAD FUNCTION
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
        else resolve({ ok: false, size: buf.length });
      });
    }).on('error', e => resolve({ ok: false, error: e.message }));
  });
}

// Resolve thumbnail URL via Wikimedia API
function resolveThumbUrl(filename) {
  return new Promise((resolve) => {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`;
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

// ============================================================
// MAIN
// ============================================================
async function main() {
  const artDir = path.join(__dirname, 'img', 'art');
  const schnorrDir = path.join(artDir, 'schnorr');
  const holeDir = path.join(artDir, 'hole');
  const doreDir = path.join(artDir, 'dore');
  fs.mkdirSync(schnorrDir, { recursive: true });
  fs.mkdirSync(holeDir, { recursive: true });
  fs.mkdirSync(doreDir, { recursive: true });

  // Collect what needs downloading
  const toDownload = [];

  // 1. Schnorr images
  console.log('=== Resolving Schnorr URLs via Wikimedia API ===');
  for (const [id, num, title, book, chapters, verseHint] of SCHNORR) {
    const fname = `${id}.png`;
    const dest = path.join(schnorrDir, fname);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 3000) continue;

    const wikiFile = `Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_${num}.png`;
    toDownload.push({
      id, wikiFile, fname, dest,
      subdir: 'schnorr',
      title, book, chapters, verseHint,
      artist: "Julius Schnorr von Carolsfeld, 1860"
    });
  }

  // 2. Hole images
  for (const [id, wikiFile, title, book, chapters, verseHint] of HOLE) {
    const ext = wikiFile.endsWith('.png') ? 'png' : (wikiFile.endsWith('.gif') ? 'gif' : 'jpg');
    const fname = `${id}.${ext}`;
    const dest = path.join(holeDir, fname);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 3000) continue;
    toDownload.push({
      id, wikiFile, fname, dest,
      subdir: 'hole',
      title, book, chapters, verseHint,
      artist: "William Brassey Hole, c. 1906"
    });
  }

  // 3. Failed Doré images (from v1 run)
  // Read existing generate-images.cjs to get the list
  const doreFiles = fs.readdirSync(doreDir);
  const existingDore = new Set(doreFiles.filter(f => fs.statSync(path.join(doreDir, f)).size > 3000).map(f => f));
  console.log(`Existing valid Doré files: ${existingDore.size}`);

  console.log(`\nTotal to download: ${toDownload.length}`);
  console.log(`Delay between requests: ${DELAY_MS/1000}s\n`);

  // Resolve URLs via API and download
  let success = 0, fail = 0;
  for (let i = 0; i < toDownload.length; i++) {
    const item = toDownload[i];
    process.stdout.write(`[${i+1}/${toDownload.length}] ${item.fname}... `);

    // Resolve URL
    const thumbUrl = await resolveThumbUrl(item.wikiFile);
    if (!thumbUrl) {
      console.log('FAIL (no URL from API)');
      fail++;
      if (i < toDownload.length - 1) await new Promise(r => setTimeout(r, 5000));
      continue;
    }

    // Download
    const result = await download(thumbUrl, item.dest);
    if (result.ok) {
      console.log(`OK (${Math.round(result.size/1024)}KB)`);
      success++;
    } else {
      console.log(`FAIL (${result.status || result.error || 'small file'})`);
      fail++;
    }

    if (i < toDownload.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n=== Done: ${success} OK, ${fail} failed out of ${toDownload.length} ===`);
}

main().catch(console.error);
