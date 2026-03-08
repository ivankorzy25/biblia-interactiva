// ============================================
// BIBLIA CONTEXT - Panel Contextual + Timeline
// Interactive, clear historical context
// Shows book, chapter, period, map, events
// Reacts to verse selection
// ============================================

class BibliaContext {
    constructor() {
        this.enabled = localStorage.getItem('biblia_context_enabled') !== 'false';
        this.timelineRange = { min: -4000, max: 100 };
        this.currentBookData = null;
        this.currentBookId = null;
        this.currentMapData = null;
        this.collapsed = localStorage.getItem('biblia_context_collapsed') === 'true';

        this.injectHTML();
        this.bindEvents();
    }

    // ==========================================
    // INJECT HTML
    // ==========================================
    injectHTML() {
        const chapterContent = document.getElementById('chapterContent');
        if (!chapterContent) return;

        this.panel = document.createElement('div');
        this.panel.id = 'contextPanel';
        this.panel.className = 'ctx-panel';
        this.panel.innerHTML = `
            <!-- Current Book/Chapter Context Header -->
            <div class="ctx-current-header">
                <div class="ctx-book-badge">
                    <div class="ctx-book-icon bc" id="ctxBookIcon"></div>
                    <div>
                        <div class="ctx-book-name" id="ctxBookName"></div>
                        <div class="ctx-book-detail" id="ctxBookDetail"></div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                    <span class="ctx-era-badge bc" id="ctxEraBadge"></span>
                    <button class="ctx-toggle-btn" id="ctxToggle" title="Mostrar/ocultar contexto">\u25BC</button>
                </div>
            </div>

            <div id="ctxCollapsible">
                <!-- Timeline -->
                <div class="ctx-timeline-section">
                    <div class="ctx-timeline-title">\u23F3 L\u00ednea del Tiempo</div>
                    <div class="ctx-timeline-wrap">
                        <div class="ctx-timeline-bar" id="ctxTimelineBar">
                            <div class="ctx-tl-bg">
                                <div class="ctx-tl-bc" id="ctxTlBc"></div>
                                <div class="ctx-tl-ad" id="ctxTlAd"></div>
                            </div>
                            <span class="ctx-tl-era-label bc-label">Antes de Cristo</span>
                            <span class="ctx-tl-era-label ad-label">d.C.</span>
                            <div class="ctx-tl-periods" id="ctxTlPeriods"></div>
                            <div class="ctx-tl-range" id="ctxTlRange">
                                <div class="ctx-tl-range-fill"></div>
                                <div class="ctx-tl-range-border"></div>
                            </div>
                            <span class="ctx-tl-range-label" id="ctxTlRangeLabel"></span>
                            <div class="ctx-tl-events" id="ctxTlEvents"></div>
                            <div class="ctx-tl-labels" id="ctxTlLabels"></div>
                            <div class="ctx-tl-christ" id="ctxTlChrist">
                                <div class="ctx-tl-christ-line"></div>
                                <div class="ctx-tl-christ-label">Cristo</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Verse Context Indicator (appears on verse select) -->
                <div class="ctx-verse-indicator" id="ctxVerseIndicator">
                    <span class="ctx-verse-ref" id="ctxVerseRef"></span>
                    <span class="ctx-verse-context" id="ctxVerseContext"></span>
                    <span class="ctx-verse-period-tag bc" id="ctxVersePeriod"></span>
                </div>

                <!-- Key Events -->
                <div class="ctx-events-section" id="ctxEventsSection">
                    <div class="ctx-section-title">\u26A1 Eventos Clave del Per\u00edodo</div>
                    <div class="ctx-events-list" id="ctxEventsList"></div>
                </div>

                <!-- Map Section -->
                <div class="ctx-map-section" id="ctxMapSection">
                    <div class="ctx-section-title">\uD83D\uDDFA Mapa Hist\u00f3rico</div>
                    <div class="ctx-map-container" id="ctxMapContainer">
                        <img id="ctxMapImg" class="ctx-map-img" alt="Mapa b\u00edblico">
                        <div class="ctx-map-title" id="ctxMapTitle"></div>
                        <button class="ctx-map-zoom" id="ctxMapZoom" title="Ampliar">\uD83D\uDD0D</button>
                    </div>
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

        // Apply collapsed state
        if (this.collapsed) {
            document.getElementById('ctxCollapsible').style.display = 'none';
            document.getElementById('ctxToggle').textContent = '\u25B6';
        }
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Map zoom
        document.getElementById('ctxMapZoom')?.addEventListener('click', (e) => { e.stopPropagation(); this.openLightbox(); });
        document.getElementById('ctxMapContainer')?.addEventListener('click', () => this.openLightbox());
        document.getElementById('ctxLightboxClose')?.addEventListener('click', () => this.closeLightbox());
        document.getElementById('ctxLightboxBg')?.addEventListener('click', () => this.closeLightbox());

        // Collapse toggle
        document.getElementById('ctxToggle')?.addEventListener('click', () => this.toggleCollapse());

        // Escape key closes lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLightbox();
        });

        // Hook into chapter loading and verse selection
        this.hookIntoApp();
    }

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        localStorage.setItem('biblia_context_collapsed', this.collapsed);
        const el = document.getElementById('ctxCollapsible');
        const btn = document.getElementById('ctxToggle');
        if (this.collapsed) {
            el.style.display = 'none';
            btn.textContent = '\u25B6';
        } else {
            el.style.display = 'block';
            btn.textContent = '\u25BC';
        }
    }

    hookIntoApp() {
        const checkApp = () => {
            if (window.bibliaApp) {
                // Hook loadChapter
                const origLoad = window.bibliaApp.loadChapter.bind(window.bibliaApp);
                window.bibliaApp.loadChapter = (chapterNum) => {
                    origLoad(chapterNum);
                    setTimeout(() => this.update(), 50);
                };

                // Hook verse selection
                const origShowActions = window.bibliaApp.showVerseActions?.bind(window.bibliaApp);
                if (origShowActions) {
                    window.bibliaApp.showVerseActions = (verseEl, event) => {
                        origShowActions(verseEl, event);
                        setTimeout(() => this.onVerseSelected(), 50);
                    };
                }

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
    // ON VERSE SELECTED
    // ==========================================
    onVerseSelected() {
        const app = window.bibliaApp;
        if (!app || !app.selectedVerse || !this.currentBookData) return;

        const { bookName, chapter, verse } = app.selectedVerse;
        const bookData = this.currentBookData;

        const indicator = document.getElementById('ctxVerseIndicator');
        const refEl = document.getElementById('ctxVerseRef');
        const contextEl = document.getElementById('ctxVerseContext');
        const periodEl = document.getElementById('ctxVersePeriod');

        // Show the verse reference
        refEl.textContent = `${bookName} ${chapter}:${verse}`;

        // Find the closest event to this chapter's estimated year
        const totalChapters = app.currentBook?.chapters || 1;
        const yearRange = bookData.yearEnd - bookData.yearStart;
        const estimatedYear = bookData.yearStart + (yearRange * ((chapter - 1) / Math.max(totalChapters - 1, 1)));
        const yearLabel = estimatedYear < 0
            ? `~${Math.abs(Math.round(estimatedYear))} a.C.`
            : `~${Math.round(estimatedYear)} d.C.`;

        // Find period
        const period = this.findPeriod(estimatedYear);
        const periodName = period ? period.label : bookData.period;

        contextEl.textContent = `${yearLabel} \u2022 ${periodName}`;

        // Period tag
        periodEl.textContent = bookData.era === 'bc' ? 'Antiguo Testamento' : 'Nuevo Testamento';
        periodEl.className = `ctx-verse-period-tag ${bookData.era}`;

        indicator.classList.add('active');
    }

    findPeriod(year) {
        if (typeof BIBLE_TIMELINE === 'undefined') return null;
        return BIBLE_TIMELINE.periods.find(p =>
            year >= p.yearStart && year <= (p.yearEnd || 100)
        );
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
        this.currentBookId = bookId;

        // Hide verse indicator when chapter changes
        document.getElementById('ctxVerseIndicator')?.classList.remove('active');

        this.renderHeader(app, bookData);
        this.renderTimeline(bookId, bookData);
        this.renderEvents(bookData);
        this.renderMap(bookId, bookData);
    }

    // ==========================================
    // HEADER - Book name, chapter, period, era
    // ==========================================
    renderHeader(app, bookData) {
        const bookName = app.currentBook.name;
        const chapter = app.currentChapter;
        const isBC = bookData.era === 'bc';

        // Book icon
        const iconEl = document.getElementById('ctxBookIcon');
        iconEl.className = `ctx-book-icon ${isBC ? 'bc' : 'ad'}`;
        // Use first 2 letters of book
        const abbr = bookName.substring(0, 2).toUpperCase();
        iconEl.textContent = abbr;

        // Book name
        document.getElementById('ctxBookName').textContent = `${bookName} ${chapter}`;

        // Detail line: period + year range
        const startLabel = bookData.yearStart < 0
            ? Math.abs(bookData.yearStart) + ' a.C.'
            : bookData.yearStart + ' d.C.';
        const endLabel = bookData.yearEnd < 0
            ? Math.abs(bookData.yearEnd) + ' a.C.'
            : bookData.yearEnd + ' d.C.';
        document.getElementById('ctxBookDetail').textContent = `${bookData.period} \u2022 ${startLabel} \u2014 ${endLabel}`;

        // Era badge
        const eraBadge = document.getElementById('ctxEraBadge');
        eraBadge.className = `ctx-era-badge ${isBC ? 'bc' : 'ad'}`;
        eraBadge.textContent = isBC ? 'Antes de Cristo' : 'Despu\u00e9s de Cristo';
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
        document.getElementById('ctxTlChrist').style.left = christPos + '%';

        // Book range highlight
        const rangeEl = document.getElementById('ctxTlRange');
        const startPos = ((bookData.yearStart - min) / total) * 100;
        const endPos = ((bookData.yearEnd - min) / total) * 100;
        const width = Math.max(endPos - startPos, 1.2);
        rangeEl.style.left = startPos + '%';
        rangeEl.style.width = width + '%';

        // Range label (book name on the bar)
        const rangeLabel = document.getElementById('ctxTlRangeLabel');
        const app = window.bibliaApp;
        const bookName = app?.currentBook?.name || bookId;
        rangeLabel.textContent = bookName;
        rangeLabel.style.left = (startPos + width / 2) + '%';
        rangeLabel.style.top = '14px';
        // Hide label if range is too narrow
        rangeLabel.style.display = width > 3 ? 'block' : 'none';

        // Periods
        this.renderPeriods(bookData, min, total);

        // Event dots
        this.renderTimelineDots(bookData, min, total);

        // Year labels
        this.renderYearLabels(min, max, total);
    }

    renderPeriods(bookData, min, total) {
        const container = document.getElementById('ctxTlPeriods');
        if (!container) return;

        // Find which period the book belongs to
        const activePeriodId = BIBLE_TIMELINE.periods.find(p =>
            bookData.yearStart >= p.yearStart && bookData.yearStart <= (p.yearEnd || 100)
        )?.id;

        let html = '';
        BIBLE_TIMELINE.periods.forEach(p => {
            const left = ((p.yearStart - min) / total) * 100;
            const end = (p.yearEnd || 100);
            const w = ((end - p.yearStart) / total) * 100;
            const isActive = p.id === activePeriodId;
            html += `<div class="ctx-tl-period ${isActive ? 'active-period' : ''}" style="left:${left}%;width:${w}%;background:${p.color}" title="${p.label}">
                <span class="ctx-tl-period-name">${p.label}</span>
            </div>`;
        });

        container.innerHTML = html;
    }

    renderTimelineDots(bookData, min, total) {
        const container = document.getElementById('ctxTlEvents');
        if (!container) return;

        let html = '';
        (bookData.keyEvents || []).forEach(ev => {
            const pos = ((ev.year - min) / total) * 100;
            const yearStr = ev.year < 0
                ? Math.abs(ev.year) + ' a.C.'
                : ev.year + ' d.C.';
            html += `<div class="ctx-tl-dot" style="left:${pos}%">
                <div class="ctx-tl-dot-tip">${ev.event} (${yearStr})</div>
            </div>`;
        });

        container.innerHTML = html;
    }

    renderYearLabels(min, max, total) {
        const container = document.getElementById('ctxTlLabels');
        if (!container) return;

        const labels = [
            { year: -4000, text: '4000 a.C.' },
            { year: -3000, text: '3000' },
            { year: -2000, text: '2000' },
            { year: -1000, text: '1000' },
            { year: 0, text: '0' },
            { year: 100, text: '100 d.C.' }
        ];
        let html = '';

        labels.forEach(l => {
            const pos = ((l.year - min) / total) * 100;
            html += `<span class="ctx-tl-label" style="left:${pos}%">${l.text}</span>`;
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

        const maps = BIBLE_TIMELINE.maps;
        let mapData = null;

        // Find map by book list first
        for (const key in maps) {
            if (maps[key].books.includes(bookId)) {
                mapData = maps[key];
                break;
            }
        }

        // Fallback to region
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
        document.getElementById('ctxLightboxImg').src = this.currentMapData.url;
        document.getElementById('ctxLightboxTitle').textContent = this.currentMapData.title;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        document.getElementById('ctxLightbox').style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.bibliaContext = new BibliaContext();
});
