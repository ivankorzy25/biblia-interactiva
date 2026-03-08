// ============================================
// BIBLIA CONTEXT - Panel Contextual + Timeline
// Muestra mapas, infografías y línea de tiempo
// debajo del texto bíblico según la lectura
// ============================================

class BibliaContext {
    constructor() {
        this.enabled = localStorage.getItem('biblia_context_enabled') !== 'false';
        this.timelineRange = { min: -4000, max: 100 };
        this.currentBookData = null;
        this.mapZoomed = false;

        this.injectHTML();
        this.bindEvents();
    }

    // ==========================================
    // INJECT HTML INTO THE READING AREA
    // ==========================================
    injectHTML() {
        const chapterContent = document.getElementById('chapterContent');
        if (!chapterContent) return;

        // Create contextual panel div
        this.panel = document.createElement('div');
        this.panel.id = 'contextPanel';
        this.panel.className = 'ctx-panel';
        this.panel.innerHTML = `
            <!-- Timeline Bar -->
            <div class="ctx-timeline-section">
                <div class="ctx-timeline-header">
                    <span class="ctx-timeline-title">\u23F3 L\u00ednea del Tiempo B\u00edblica</span>
                    <span class="ctx-timeline-era" id="ctxCurrentEra"></span>
                </div>
                <div class="ctx-timeline-bar" id="ctxTimelineBar">
                    <div class="ctx-tl-bg">
                        <div class="ctx-tl-bc" id="ctxTlBc"></div>
                        <div class="ctx-tl-ad" id="ctxTlAd"></div>
                    </div>
                    <div class="ctx-tl-periods" id="ctxTlPeriods"></div>
                    <div class="ctx-tl-marker" id="ctxTlMarker"></div>
                    <div class="ctx-tl-range" id="ctxTlRange"></div>
                    <div class="ctx-tl-events" id="ctxTlEvents"></div>
                    <div class="ctx-tl-labels" id="ctxTlLabels"></div>
                    <div class="ctx-tl-christ" id="ctxTlChrist">
                        <div class="ctx-tl-christ-line"></div>
                        <div class="ctx-tl-christ-label">Cristo</div>
                    </div>
                </div>
                <div class="ctx-timeline-info" id="ctxTimelineInfo"></div>
            </div>

            <!-- Key Events -->
            <div class="ctx-events-section" id="ctxEventsSection">
                <div class="ctx-section-title">\u26A1 Eventos Clave</div>
                <div class="ctx-events-list" id="ctxEventsList"></div>
            </div>

            <!-- Map Section -->
            <div class="ctx-map-section" id="ctxMapSection">
                <div class="ctx-section-title">\uD83D\uDDFA Mapa</div>
                <div class="ctx-map-container" id="ctxMapContainer">
                    <img id="ctxMapImg" class="ctx-map-img" alt="Mapa b\u00edblico">
                    <div class="ctx-map-title" id="ctxMapTitle"></div>
                    <button class="ctx-map-zoom" id="ctxMapZoom" title="Ampliar">\uD83D\uDD0D</button>
                </div>
            </div>

            <!-- Map Lightbox -->
            <div class="ctx-lightbox" id="ctxLightbox" style="display:none">
                <div class="ctx-lightbox-bg" id="ctxLightboxBg"></div>
                <div class="ctx-lightbox-content">
                    <img id="ctxLightboxImg" class="ctx-lightbox-img" alt="Mapa ampliado">
                    <div class="ctx-lightbox-title" id="ctxLightboxTitle"></div>
                    <button class="ctx-lightbox-close" id="ctxLightboxClose">\u2715</button>
                </div>
            </div>
        `;

        chapterContent.appendChild(this.panel);
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Map zoom
        document.getElementById('ctxMapZoom')?.addEventListener('click', () => this.openLightbox());
        document.getElementById('ctxMapContainer')?.addEventListener('click', () => this.openLightbox());
        document.getElementById('ctxLightboxClose')?.addEventListener('click', () => this.closeLightbox());
        document.getElementById('ctxLightboxBg')?.addEventListener('click', () => this.closeLightbox());

        // Hook into chapter loading - override after app init
        this.hookIntoApp();
    }

    hookIntoApp() {
        const checkApp = () => {
            if (window.bibliaApp) {
                const origLoad = window.bibliaApp.loadChapter.bind(window.bibliaApp);
                window.bibliaApp.loadChapter = (chapterNum) => {
                    origLoad(chapterNum);
                    setTimeout(() => this.update(), 50);
                };
                // If already reading, update now
                if (window.bibliaApp.currentBook) {
                    setTimeout(() => this.update(), 100);
                }
            } else {
                setTimeout(checkApp, 200);
            }
        };
        checkApp();
    }

    // ==========================================
    // UPDATE - Called when chapter changes
    // ==========================================
    update() {
        if (!this.enabled) {
            this.panel.style.display = 'none';
            return;
        }

        const app = window.bibliaApp;
        if (!app || !app.currentBook) {
            this.panel.style.display = 'none';
            return;
        }

        this.panel.style.display = 'block';
        const bookId = app.currentBook.id;
        const bookData = typeof BIBLE_TIMELINE !== 'undefined' ? BIBLE_TIMELINE.books[bookId] : null;

        if (!bookData) {
            this.panel.style.display = 'none';
            return;
        }

        this.currentBookData = bookData;
        this.renderTimeline(bookId, bookData);
        this.renderEvents(bookData);
        this.renderMap(bookId, bookData);
    }

    // ==========================================
    // TIMELINE BAR
    // ==========================================
    renderTimeline(bookId, bookData) {
        const min = this.timelineRange.min;
        const max = this.timelineRange.max;
        const total = max - min;

        // Position of year 0 (Christ)
        const christPos = ((0 - min) / total) * 100;

        // BC / AD background sections
        const bcEl = document.getElementById('ctxTlBc');
        const adEl = document.getElementById('ctxTlAd');
        bcEl.style.width = christPos + '%';
        adEl.style.left = christPos + '%';
        adEl.style.width = (100 - christPos) + '%';

        // Christ marker
        const christEl = document.getElementById('ctxTlChrist');
        christEl.style.left = christPos + '%';

        // Book range highlight
        const rangeEl = document.getElementById('ctxTlRange');
        const startPos = ((bookData.yearStart - min) / total) * 100;
        const endPos = ((bookData.yearEnd - min) / total) * 100;
        const width = Math.max(endPos - startPos, 0.8);
        rangeEl.style.left = startPos + '%';
        rangeEl.style.width = width + '%';

        // Current era label
        const eraEl = document.getElementById('ctxCurrentEra');
        const startLabel = bookData.yearStart < 0
            ? Math.abs(bookData.yearStart) + ' a.C.'
            : bookData.yearStart + ' d.C.';
        const endLabel = bookData.yearEnd < 0
            ? Math.abs(bookData.yearEnd) + ' a.C.'
            : bookData.yearEnd + ' d.C.';
        eraEl.textContent = `${startLabel} \u2014 ${endLabel}`;

        // Period blocks
        this.renderPeriods(min, total);

        // Event dots on timeline
        this.renderTimelineDots(bookData, min, total);

        // Year labels
        this.renderYearLabels(min, max, total);

        // Info text
        const infoEl = document.getElementById('ctxTimelineInfo');
        infoEl.textContent = bookData.period;
    }

    renderPeriods(min, total) {
        const container = document.getElementById('ctxTlPeriods');
        if (!container) return;
        let html = '';

        BIBLE_TIMELINE.periods.forEach(p => {
            const left = ((p.yearStart - min) / total) * 100;
            const end = (p.yearEnd || 100);
            const width = ((end - p.yearStart) / total) * 100;
            html += `<div class="ctx-tl-period" style="left:${left}%;width:${width}%;background:${p.color}" title="${p.label}"></div>`;
        });

        container.innerHTML = html;
    }

    renderTimelineDots(bookData, min, total) {
        const container = document.getElementById('ctxTlEvents');
        if (!container) return;

        let html = '';
        (bookData.keyEvents || []).forEach(ev => {
            const pos = ((ev.year - min) / total) * 100;
            html += `<div class="ctx-tl-dot" style="left:${pos}%" title="${ev.event} (${ev.year < 0 ? Math.abs(ev.year) + ' a.C.' : ev.year + ' d.C.'})"></div>`;
        });

        container.innerHTML = html;
    }

    renderYearLabels(min, max, total) {
        const container = document.getElementById('ctxTlLabels');
        if (!container) return;

        const labels = [-4000, -3000, -2000, -1000, 0, 100];
        let html = '';

        labels.forEach(year => {
            const pos = ((year - min) / total) * 100;
            const label = year === 0 ? '0' : year < 0 ? Math.abs(year) : year;
            html += `<span class="ctx-tl-label" style="left:${pos}%">${label}</span>`;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // KEY EVENTS LIST
    // ==========================================
    renderEvents(bookData) {
        const section = document.getElementById('ctxEventsSection');
        const list = document.getElementById('ctxEventsList');
        const events = bookData.keyEvents || [];

        if (events.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        let html = '';
        events.forEach(ev => {
            const yearLabel = ev.year < 0
                ? `${Math.abs(ev.year)} a.C.`
                : `${ev.year} d.C.`;
            const isBC = ev.year < 0;
            html += `
                <div class="ctx-event-chip">
                    <span class="ctx-event-year ${isBC ? 'ctx-year-bc' : 'ctx-year-ad'}">${yearLabel}</span>
                    <span class="ctx-event-text">${ev.event}</span>
                </div>
            `;
        });
        list.innerHTML = html;
    }

    // ==========================================
    // MAP
    // ==========================================
    renderMap(bookId, bookData) {
        const section = document.getElementById('ctxMapSection');
        const img = document.getElementById('ctxMapImg');
        const title = document.getElementById('ctxMapTitle');

        // Find matching map
        const maps = BIBLE_TIMELINE.maps;
        let mapData = null;

        // First try to find map by region
        for (const key in maps) {
            if (maps[key].books.includes(bookId)) {
                mapData = maps[key];
                break;
            }
        }

        // Fallback to region match
        if (!mapData && bookData.mapRegion && maps[bookData.mapRegion]) {
            mapData = maps[bookData.mapRegion];
        }

        if (!mapData) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        img.src = mapData.url;
        img.alt = mapData.title;
        title.textContent = mapData.title;
        this.currentMapData = mapData;
    }

    // ==========================================
    // LIGHTBOX
    // ==========================================
    openLightbox() {
        if (!this.currentMapData) return;
        const lightbox = document.getElementById('ctxLightbox');
        const img = document.getElementById('ctxLightboxImg');
        const title = document.getElementById('ctxLightboxTitle');

        img.src = this.currentMapData.url;
        title.textContent = this.currentMapData.title;
        lightbox.style.display = 'flex';
    }

    closeLightbox() {
        document.getElementById('ctxLightbox').style.display = 'none';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.bibliaContext = new BibliaContext();
});
