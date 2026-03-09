// biblia-youversion.js — Videos de YouVersion con reproductor embebido
// Integración para biblia.kor.com.ar

// youtubeId: ID de YouTube cuando está disponible (embed directo)
// coleccionUrl: URL de colección YouVersion (Lumo, etc.)
// id: ID de video YouVersion (fallback)
const YOUVERSION_VIDEOS = {
  genesis: [
    { id: 25449, youtubeId: 'HQMKA6w5ZZM', titulo: "Génesis 1-11", capDesde: 1, capHasta: 11, coleccion: "BibleProject" },
    { id: 25424, titulo: "Génesis 12-50", capDesde: 12, capHasta: 50, coleccion: "BibleProject" },
    { id: 27513, titulo: "Panorama de Génesis (Parte 1)", capDesde: 1, capHasta: 11, coleccion: "Serie de la Torá" },
    { id: 27514, titulo: "Panorama de Génesis (Parte 2)", capDesde: 12, capHasta: 50, coleccion: "Serie de la Torá" },
  ],
  exodo: [
    { id: 25450, titulo: "Éxodo 1-18", capDesde: 1, capHasta: 18, coleccion: "BibleProject" },
    { id: 25427, titulo: "Éxodo 19-40", capDesde: 19, capHasta: 40, coleccion: "BibleProject" },
    { id: 27515, titulo: "Panorama de Éxodo (Parte 1)", capDesde: 1, capHasta: 18, coleccion: "Serie de la Torá" },
    { id: 27516, titulo: "Panorama de Éxodo (Parte 2)", capDesde: 19, capHasta: 40, coleccion: "Serie de la Torá" },
  ],
  levitico: [
    { id: 25435, titulo: "Levítico", capDesde: 1, capHasta: 27, coleccion: "BibleProject" },
    { id: 27517, titulo: "Panorama de Levítico", capDesde: 1, capHasta: 27, coleccion: "Serie de la Torá" },
  ],
  numeros: [
    { id: 25440, titulo: "Números", capDesde: 1, capHasta: 36, coleccion: "BibleProject" },
    { id: 27519, titulo: "Panorama de Números", capDesde: 1, capHasta: 36, coleccion: "Serie de la Torá" },
  ],
  deuteronomio: [
    { id: 27520, titulo: "Panorama de Deuteronomio", capDesde: 1, capHasta: 34, coleccion: "Serie de la Torá" },
  ],
  josue: [
    { id: 25419, titulo: "Josué", capDesde: 1, capHasta: 24, coleccion: "BibleProject" },
  ],
  jueces: [
    { id: 25455, titulo: "Jueces", capDesde: 1, capHasta: 21, coleccion: "BibleProject" },
  ],
  rut: [
    { id: 25456, titulo: "Rut", capDesde: 1, capHasta: 4, coleccion: "BibleProject" },
  ],
  '1samuel': [
    { id: 25457, titulo: "1 Samuel", capDesde: 1, capHasta: 31, coleccion: "BibleProject" },
  ],
  '2samuel': [
    { id: 25460, titulo: "2 Samuel", capDesde: 1, capHasta: 24, coleccion: "BibleProject" },
  ],
  '1reyes': [
    { id: 25461, titulo: "1 y 2 Reyes", capDesde: 1, capHasta: 22, coleccion: "BibleProject" },
  ],
  '2reyes': [
    { id: 25461, titulo: "1 y 2 Reyes", capDesde: 1, capHasta: 25, coleccion: "BibleProject" },
  ],
  esdras: [
    { id: 25463, titulo: "Esdras y Nehemías", capDesde: 1, capHasta: 10, coleccion: "BibleProject" },
  ],
  nehemias: [
    { id: 25463, titulo: "Esdras y Nehemías", capDesde: 1, capHasta: 13, coleccion: "BibleProject" },
  ],
  ester: [
    { id: 25464, titulo: "Ester", capDesde: 1, capHasta: 10, coleccion: "BibleProject" },
  ],
  job: [
    { id: 25465, titulo: "Job", capDesde: 1, capHasta: 42, coleccion: "BibleProject" },
  ],
  salmos: [
    { id: 25084, titulo: "Salmos", capDesde: 1, capHasta: 150, coleccion: "BibleProject" },
  ],
  proverbios: [
    { id: 25466, titulo: "Proverbios", capDesde: 1, capHasta: 31, coleccion: "BibleProject" },
  ],
  eclesiastes: [
    { id: 25467, titulo: "Eclesiastés", capDesde: 1, capHasta: 12, coleccion: "BibleProject" },
  ],
  cantares: [
    { id: 25468, titulo: "Cantar de los Cantares", capDesde: 1, capHasta: 8, coleccion: "BibleProject" },
  ],
  isaias: [
    { id: 25469, titulo: "Isaías 1-39", capDesde: 1, capHasta: 39, coleccion: "BibleProject" },
    { id: 25470, titulo: "Isaías 40-66", capDesde: 40, capHasta: 66, coleccion: "BibleProject" },
  ],
  jeremias: [
    { id: 25471, titulo: "Jeremías", capDesde: 1, capHasta: 52, coleccion: "BibleProject" },
  ],
  lamentaciones: [
    { id: 25250, titulo: "Lamentaciones", capDesde: 1, capHasta: 5, coleccion: "BibleProject" },
  ],
  ezequiel: [
    { id: 25472, titulo: "Ezequiel 1-33", capDesde: 1, capHasta: 32, coleccion: "BibleProject" },
    { id: 25473, titulo: "Ezequiel 34-48", capDesde: 33, capHasta: 48, coleccion: "BibleProject" },
  ],
  mateo: [
    { id: 25490, titulo: "Mateo 1-13", capDesde: 1, capHasta: 13, coleccion: "BibleProject" },
    { id: 25492, titulo: "Mateo 14-28", capDesde: 14, capHasta: 28, coleccion: "BibleProject" },
    { id: null, titulo: "Mateo — Dramatización completa", capDesde: 1, capHasta: 28, coleccion: "Proyecto Lumo", coleccionUrl: "https://www.bible.com/es/videos/collections/19-mateo" },
  ],
  marcos: [
    { id: 25493, titulo: "Marcos", capDesde: 1, capHasta: 16, coleccion: "BibleProject" },
    { id: null, titulo: "Marcos — Dramatización completa", capDesde: 1, capHasta: 16, coleccion: "Proyecto Lumo", coleccionUrl: "https://www.bible.com/es/videos/collections/20-marcos" },
  ],
  lucas: [
    { id: 25348, titulo: "Lucas 1-9", capDesde: 1, capHasta: 9, coleccion: "BibleProject" },
    { id: 25359, titulo: "Lucas 10-24", capDesde: 10, capHasta: 24, coleccion: "BibleProject" },
    { id: 25669, youtubeId: 'cZ_C8oar-rc', titulo: "Jesús — Película completa", capDesde: 1, capHasta: 24, coleccion: "Jesús (2h 08m)" },
    { id: null, titulo: "Lucas — Dramatización completa", capDesde: 1, capHasta: 24, coleccion: "Proyecto Lumo", coleccionUrl: "https://www.bible.com/es/videos/collections/21-lucas" },
  ],
  juan: [
    { id: 25152, titulo: "Juan 13-21", capDesde: 13, capHasta: 21, coleccion: "BibleProject" },
    { id: null, titulo: "Juan — Dramatización completa", capDesde: 1, capHasta: 21, coleccion: "Proyecto Lumo", coleccionUrl: "https://www.bible.com/es/videos/collections/18-juan" },
  ],
  hechos: [
    { id: 25495, titulo: "Hechos 1-12", capDesde: 1, capHasta: 12, coleccion: "BibleProject" },
    { id: 25496, titulo: "Hechos 13-28", capDesde: 13, capHasta: 28, coleccion: "BibleProject" },
  ],
  romanos: [
    { id: 25062, titulo: "Romanos 1-4", capDesde: 1, capHasta: 4, coleccion: "BibleProject" },
    { id: 25065, titulo: "Romanos 5-16", capDesde: 5, capHasta: 16, coleccion: "BibleProject" },
  ],
  '1corintios': [
    { id: 25497, titulo: "1 Corintios", capDesde: 1, capHasta: 16, coleccion: "BibleProject" },
  ],
  '2corintios': [
    { id: 25498, titulo: "2 Corintios", capDesde: 1, capHasta: 13, coleccion: "BibleProject" },
  ],
  galatas: [
    { id: 25499, titulo: "Gálatas", capDesde: 1, capHasta: 6, coleccion: "BibleProject" },
  ],
  efesios: [
    { id: 25500, titulo: "Efesios", capDesde: 1, capHasta: 6, coleccion: "BibleProject" },
  ],
  filipenses: [
    { id: 25501, titulo: "Filipenses", capDesde: 1, capHasta: 4, coleccion: "BibleProject" },
  ],
  colosenses: [
    { id: 25502, titulo: "Colosenses", capDesde: 1, capHasta: 4, coleccion: "BibleProject" },
  ],
  '1tesalonicenses': [
    { id: 25491, titulo: "1 Tesalonicenses", capDesde: 1, capHasta: 5, coleccion: "BibleProject" },
  ],
  '2tesalonicenses': [
    { id: 25484, titulo: "2 Tesalonicenses", capDesde: 1, capHasta: 3, coleccion: "BibleProject" },
  ],
  '1timoteo': [
    { id: 25503, titulo: "1 Timoteo", capDesde: 1, capHasta: 6, coleccion: "BibleProject" },
  ],
  '2timoteo': [
    { id: 25504, titulo: "2 Timoteo", capDesde: 1, capHasta: 4, coleccion: "BibleProject" },
  ],
  tito: [
    { id: 25505, titulo: "Tito", capDesde: 1, capHasta: 3, coleccion: "BibleProject" },
  ],
  filemon: [
    { id: 25506, titulo: "Filemón", capDesde: 1, capHasta: 1, coleccion: "BibleProject" },
  ],
  hebreos: [
    { id: 25507, titulo: "Hebreos", capDesde: 1, capHasta: 13, coleccion: "BibleProject" },
  ],
  santiago: [
    { id: 25508, titulo: "Santiago", capDesde: 1, capHasta: 5, coleccion: "BibleProject" },
  ],
  '1pedro': [
    { id: 25509, titulo: "1 Pedro", capDesde: 1, capHasta: 5, coleccion: "BibleProject" },
  ],
};

const YV_COLECCION_COLORES = {
  'BibleProject':      { bg: '#e8f0fe', border: '#4a86e8', icon: '▶' },
  'Serie de la Torá':  { bg: '#fef7e0', border: '#f4b400', icon: '✡' },
  'Proyecto Lumo':     { bg: '#fce8e6', border: '#ea4335', icon: '🎬' },
  'Jesús (2h 08m)':    { bg: '#e6f4ea', border: '#34a853', icon: '✝' },
};

// ==========================================
// DATA ACCESS
// ==========================================
function getYouVersionVideos(bookId, chapter) {
  const lista = YOUVERSION_VIDEOS[bookId] || [];
  return lista.filter(v => chapter >= v.capDesde && chapter <= v.capHasta);
}

// ==========================================
// CHAPTER-END SECTION (cards al pie del cap.)
// ==========================================
function renderYouVersionSection(bookId, chapter) {
  const section = document.getElementById('youversionSection');
  if (!section) return;

  const videos = getYouVersionVideos(bookId, chapter);

  if (videos.length === 0) {
    section.innerHTML = '';
    section.style.display = 'none';
    return;
  }

  const cards = videos.map((v, i) => {
    const color = YV_COLECCION_COLORES[v.coleccion] || { bg: '#f1f3f4', border: '#9aa0a6', icon: '▶' };
    return `
      <button class="yv-card" onclick="event.stopPropagation(); yvOpenPlayer(${i}, '${bookId}', ${chapter})"
              style="--yv-bg:${color.bg}; --yv-border:${color.border};">
        <span class="yv-icon">${color.icon}</span>
        <span class="yv-info">
          <span class="yv-titulo">${v.titulo}</span>
          <span class="yv-coleccion">${v.coleccion}</span>
        </span>
        <span class="yv-arrow">▶</span>
      </button>`;
  }).join('');

  section.innerHTML = `
    <div class="yv-header">
      <span class="yv-header-icon">🎥</span>
      Videos sobre este pasaje
    </div>
    <div class="yv-grid">${cards}</div>`;
  section.style.display = 'block';
}

// ==========================================
// VIDEO PLAYER PANEL
// ==========================================

// currentBookId/chapter guardados para reabrir lista desde el panel (window scope para acceso cross-file)
window._yvCurrentBookId = null;
window._yvCurrentChapter = null;

function yvOpenFromVerseMenu(bookId, chapter) {
  window._yvCurrentBookId = bookId;
  window._yvCurrentChapter = chapter;
  const videos = getYouVersionVideos(bookId, chapter);
  if (videos.length === 0) return;
  if (videos.length === 1) {
    yvPlayVideo(videos[0]);
  } else {
    yvShowList(videos, bookId, chapter);
  }
}

function yvOpenPlayer(idx, bookId, chapter) {
  const videos = getYouVersionVideos(bookId, chapter);
  if (!videos[idx]) return;
  window._yvCurrentBookId = bookId;
  window._yvCurrentChapter = chapter;
  yvPlayVideo(videos[idx]);
}

function yvShowList(videos, bookId, chapter) {
  const panel = document.getElementById('videoPanel');
  const body  = document.getElementById('videoPanelBody');
  const title = document.getElementById('videoPanelTitle');

  title.textContent = 'Videos relacionados';

  const cards = videos.map((v, i) => {
    const color = YV_COLECCION_COLORES[v.coleccion] || { bg: '#f1f3f4', border: '#9aa0a6', icon: '▶' };
    return `
      <button class="vp-list-card" onclick="yvOpenPlayer(${i}, '${bookId}', ${chapter})"
              style="--yv-border:${color.border}">
        <span class="vp-list-icon">${color.icon}</span>
        <span class="vp-list-info">
          <span class="vp-list-titulo">${v.titulo}</span>
          <span class="vp-list-col">${v.coleccion}</span>
        </span>
        <span class="vp-list-play">▶</span>
      </button>`;
  }).join('');

  body.innerHTML = `<div class="vp-list">${cards}</div>`;
  panel.classList.add('active');
  panel.classList.remove('expanded');
}

// Busca el YouTube ID via Piped API (no requiere key, CORS abierto)
// Cachea en sessionStorage para no repetir búsquedas
async function fetchYouTubeId(titulo) {
  const cacheKey = `yv_yt_${titulo}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached === 'null' ? null : cached;

  const query = `Proyecto Biblia ${titulo}`;
  const apis = [
    `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`,
    `https://pipedapi.tokhmi.xyz/search?q=${encodeURIComponent(query)}&filter=videos`,
    `https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title`,
  ];

  for (const url of apis) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.items || []);
      for (const item of items) {
        // Piped returns url="/watch?v=ID", Invidious returns videoId directly
        const id = item.videoId || (item.url || '').replace('/watch?v=', '').split('&')[0];
        if (id && id.length === 11) {
          sessionStorage.setItem(cacheKey, id);
          return id;
        }
      }
    } catch (_) { /* try next */ }
  }

  sessionStorage.setItem(cacheKey, 'null');
  return null;
}

function yvBuildPlayer(iframeSrc, isYouTube, externalUrl, backBtn) {
  return `
    <div class="vp-player-wrap">
      <iframe class="vp-iframe"
        src="${iframeSrc}"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
    <div class="vp-footer">
      ${backBtn}
      ${!isYouTube ? `<a class="vp-external-btn" href="${externalUrl}" target="_blank" rel="noopener noreferrer">Abrir en YouVersion ↗</a>` : ''}
    </div>`;
}

function yvBackBtn() {
  return (window._yvCurrentBookId && getYouVersionVideos(window._yvCurrentBookId, window._yvCurrentChapter).length > 1)
    ? `<button class="vp-back" onclick="yvShowList(getYouVersionVideos('${window._yvCurrentBookId}', ${window._yvCurrentChapter}), '${window._yvCurrentBookId}', ${window._yvCurrentChapter})">← Volver</button>`
    : '';
}

async function yvPlayVideo(video) {
  const panel = document.getElementById('videoPanel');
  const body  = document.getElementById('videoPanelBody');
  const title = document.getElementById('videoPanelTitle');

  title.textContent = video.titulo;
  panel.classList.add('active');

  const externalUrl = video.coleccionUrl
    ? video.coleccionUrl
    : (video.id ? `https://www.bible.com/es/videos/${video.id}` : '');

  // 1. YouTube ID ya conocido
  if (video.youtubeId) {
    const src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&hl=es&rel=0`;
    body.innerHTML = yvBuildPlayer(src, true, externalUrl, yvBackBtn());
    return;
  }

  // 2. Colección Lumo u otro link externo — abre directamente
  if (video.coleccionUrl) {
    body.innerHTML = yvBuildPlayer(video.coleccionUrl, false, video.coleccionUrl, yvBackBtn());
    return;
  }

  // 3. BibleProject / Serie de la Torá — buscar YouTube ID dinámicamente
  if (video.coleccion === 'BibleProject' || video.coleccion === 'Serie de la Torá') {
    body.innerHTML = `
      <div class="vp-searching">
        <div class="vp-spinner"></div>
        <span>Buscando video en YouTube…</span>
      </div>
      <div class="vp-footer">${yvBackBtn()}</div>`;

    const ytId = await fetchYouTubeId(video.titulo);
    if (ytId) {
      video.youtubeId = ytId; // cache en objeto para reusar
      const src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&hl=es&rel=0`;
      body.innerHTML = yvBuildPlayer(src, true, externalUrl, yvBackBtn());
      return;
    }
  }

  // 4. Fallback: YouVersion page en iframe
  body.innerHTML = yvBuildPlayer(externalUrl, false, externalUrl, yvBackBtn());
}

// ==========================================
// VERSE MENU — video buttons inline
// ==========================================
function yvUpdateMenuVideos(bookId, chapter) {
  const slot = document.getElementById('yvMenuSlot');
  if (!slot) return;

  const videos = getYouVersionVideos(bookId, chapter);

  if (videos.length === 0) {
    slot.innerHTML = '';
    return;
  }

  const colores = YV_COLECCION_COLORES;
  const divider = `<div class="verse-action-divider"></div>`;
  const label   = `<div class="yv-menu-label">&#127902; Videos relacionados</div>`;

  const btns = videos.map((v, i) => {
    const c = colores[v.coleccion] || { icon: '▶' };
    return `<button class="verse-action-btn yv-menu-btn"
      onclick="event.stopPropagation(); document.getElementById('verseActions').classList.remove('active'); yvOpenPlayer(${i},'${bookId}',${chapter})">
      <span class="yv-menu-icon">${c.icon}</span>
      <span class="yv-menu-text">
        <span class="yv-menu-titulo">${v.titulo}</span>
        <span class="yv-menu-col">${v.coleccion}</span>
      </span>
    </button>`;
  }).join('');

  slot.innerHTML = divider + label + btns;
}

// ==========================================
// PANEL CONTROLS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Close button
  document.getElementById('videoPanelClose')?.addEventListener('click', () => {
    const panel = document.getElementById('videoPanel');
    panel.classList.remove('active', 'expanded');
    // Clear iframe to stop playback
    const iframe = panel.querySelector('iframe');
    if (iframe) iframe.src = '';
  });

  // Expand/shrink toggle
  document.getElementById('videoPanelExpand')?.addEventListener('click', () => {
    document.getElementById('videoPanel').classList.toggle('expanded');
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('videoPanel');
    if (panel?.classList.contains('active') &&
        !panel.contains(e.target) &&
        !e.target.closest('.yv-menu-btn') &&
        !e.target.closest('.yv-card')) {
      panel.classList.remove('active', 'expanded');
      const iframe = panel.querySelector('iframe');
      if (iframe) iframe.src = '';
    }
  });
});
