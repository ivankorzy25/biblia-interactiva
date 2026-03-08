// ============================================
// BIBLIA CONTEXT - Panel Contextual Histórico
// Timeline interactiva + Panel IA lateral
// Genera contexto histórico con IA
// ============================================

class BibliaContext {
    constructor() {
        this.API_URL = '/v1/chat/completions';
        this.TOKEN = 'a981079aa9900cdacdd68a89da4370db0faf6e729584fdd520cac2e643f24701';
        this.timelineRange = { min: -4000, max: 100 };
        this.currentBookData = null;
        this.currentBookId = null;
        this.sidebarOpen = false;
        this.isLoading = false;
        this.cache = {};

        this.injectPanel();
        this.injectSidebar();
        this.bindEvents();
    }

    // ==========================================
    // INJECT TIMELINE PANEL (below verses)
    // ==========================================
    injectPanel() {
        const chapterContent = document.getElementById('chapterContent');
        if (!chapterContent) return;

        this.panel = document.createElement('div');
        this.panel.id = 'contextPanel';
        this.panel.className = 'ctx-panel';
        this.panel.innerHTML = `
            <!-- Header -->
            <div class="ctx-header">
                <div class="ctx-book-badge">
                    <div class="ctx-book-icon bc" id="ctxBookIcon"></div>
                    <div>
                        <div class="ctx-book-name" id="ctxBookName"></div>
                        <div class="ctx-book-detail" id="ctxBookDetail"></div>
                    </div>
                </div>
                <span class="ctx-era-badge bc" id="ctxEraBadge"></span>
            </div>

            <!-- Timeline Bar -->
            <div class="ctx-timeline-section">
                <div class="ctx-timeline-bar" id="ctxTimelineBar">
                    <div class="ctx-tl-bg">
                        <div class="ctx-tl-bc" id="ctxTlBc"></div>
                        <div class="ctx-tl-ad" id="ctxTlAd"></div>
                    </div>
                    <span class="ctx-tl-era-label bc-label">A.C.</span>
                    <span class="ctx-tl-era-label ad-label">D.C.</span>
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

            <!-- Context Action Buttons (AI-powered) -->
            <div class="ctx-actions" id="ctxActions"></div>

            <!-- Key Events -->
            <div class="ctx-events-section" id="ctxEventsSection">
                <div class="ctx-events-list" id="ctxEventsList"></div>
            </div>
        `;

        chapterContent.appendChild(this.panel);
    }

    // ==========================================
    // INJECT LEFT SIDEBAR (historical context)
    // ==========================================
    injectSidebar() {
        this.sidebar = document.createElement('div');
        this.sidebar.id = 'ctxSidebar';
        this.sidebar.className = 'sidebar sidebar-left';
        this.sidebar.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-title" id="ctxSidebarTitle">\uD83D\uDCDC Contexto Hist\u00f3rico</div>
                <button class="sidebar-close" id="ctxSidebarClose">\u2715</button>
            </div>
            <div class="sidebar-body" id="ctxSidebarBody">
                <div class="sidebar-empty">
                    <div class="sidebar-empty-icon">\uD83C\uDFDB</div>
                    Selecciona un evento o per\u00edodo en la l\u00ednea de tiempo para ver el contexto hist\u00f3rico
                </div>
            </div>
        `;
        document.body.appendChild(this.sidebar);
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        document.getElementById('ctxSidebarClose')?.addEventListener('click', () => this.closeSidebar());

        // Close sidebar on overlay click
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                if (this.sidebarOpen) this.closeSidebar();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarOpen) this.closeSidebar();
        });

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

                // Hook verse selection
                const origShowActions = window.bibliaApp.showVerseActions?.bind(window.bibliaApp);
                if (origShowActions) {
                    window.bibliaApp.showVerseActions = (verseEl, event) => {
                        origShowActions(verseEl, event);
                        setTimeout(() => this.onVerseSelected(), 50);
                    };
                }

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
    // UPDATE - on chapter change
    // ==========================================
    update() {
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

        this.renderHeader(app, bookData);
        this.renderTimeline(bookId, bookData);
        this.renderActions(app, bookData);
        this.renderEvents(bookData);
    }

    // ==========================================
    // HEADER
    // ==========================================
    renderHeader(app, bookData) {
        const bookName = app.currentBook.name;
        const chapter = app.currentChapter;
        const isBC = bookData.era === 'bc';

        const iconEl = document.getElementById('ctxBookIcon');
        iconEl.className = `ctx-book-icon ${isBC ? 'bc' : 'ad'}`;
        iconEl.textContent = bookName.substring(0, 2).toUpperCase();

        document.getElementById('ctxBookName').textContent = `${bookName} ${chapter}`;

        const startLabel = bookData.yearStart < 0 ? Math.abs(bookData.yearStart) + ' a.C.' : bookData.yearStart + ' d.C.';
        const endLabel = bookData.yearEnd < 0 ? Math.abs(bookData.yearEnd) + ' a.C.' : bookData.yearEnd + ' d.C.';
        document.getElementById('ctxBookDetail').textContent = `${bookData.period} \u2022 ${startLabel} \u2014 ${endLabel}`;

        const eraBadge = document.getElementById('ctxEraBadge');
        eraBadge.className = `ctx-era-badge ${isBC ? 'bc' : 'ad'}`;
        eraBadge.textContent = isBC ? 'Antiguo Testamento' : 'Nuevo Testamento';
    }

    // ==========================================
    // TIMELINE BAR
    // ==========================================
    renderTimeline(bookId, bookData) {
        const min = this.timelineRange.min;
        const max = this.timelineRange.max;
        const total = max - min;
        const christPos = ((0 - min) / total) * 100;

        document.getElementById('ctxTlBc').style.width = christPos + '%';
        const adEl = document.getElementById('ctxTlAd');
        adEl.style.left = christPos + '%';
        adEl.style.width = (100 - christPos) + '%';
        document.getElementById('ctxTlChrist').style.left = christPos + '%';

        // Book range
        const rangeEl = document.getElementById('ctxTlRange');
        const startPos = ((bookData.yearStart - min) / total) * 100;
        const endPos = ((bookData.yearEnd - min) / total) * 100;
        const width = Math.max(endPos - startPos, 1.2);
        rangeEl.style.left = startPos + '%';
        rangeEl.style.width = width + '%';

        const rangeLabel = document.getElementById('ctxTlRangeLabel');
        const bookName = window.bibliaApp?.currentBook?.name || bookId;
        rangeLabel.textContent = bookName;
        rangeLabel.style.left = (startPos + width / 2) + '%';
        rangeLabel.style.display = width > 3 ? 'block' : 'none';

        this.renderPeriods(bookData, min, total);
        this.renderTimelineDots(bookData, min, total);
        this.renderYearLabels(min, max, total);
    }

    renderPeriods(bookData, min, total) {
        const container = document.getElementById('ctxTlPeriods');
        if (!container) return;

        const activePeriodId = BIBLE_TIMELINE.periods.find(p =>
            bookData.yearStart >= p.yearStart && bookData.yearStart <= (p.yearEnd || 100)
        )?.id;

        let html = '';
        BIBLE_TIMELINE.periods.forEach(p => {
            const left = ((p.yearStart - min) / total) * 100;
            const w = (((p.yearEnd || 100) - p.yearStart) / total) * 100;
            const isActive = p.id === activePeriodId;
            html += `<div class="ctx-tl-period ${isActive ? 'active-period' : ''}"
                style="left:${left}%;width:${w}%;background:${p.color}"
                title="${p.label}"
                data-period-id="${p.id}"></div>`;
        });
        container.innerHTML = html;

        // Make periods clickable
        container.querySelectorAll('.ctx-tl-period').forEach(el => {
            el.addEventListener('click', () => {
                const period = BIBLE_TIMELINE.periods.find(p => p.id === el.dataset.periodId);
                if (period) this.openContextForPeriod(period);
            });
        });
    }

    renderTimelineDots(bookData, min, total) {
        const container = document.getElementById('ctxTlEvents');
        if (!container) return;

        let html = '';
        (bookData.keyEvents || []).forEach((ev, i) => {
            const pos = ((ev.year - min) / total) * 100;
            const yearStr = ev.year < 0 ? Math.abs(ev.year) + ' a.C.' : ev.year + ' d.C.';
            html += `<div class="ctx-tl-dot" style="left:${pos}%" data-event-idx="${i}">
                <div class="ctx-tl-dot-tip">${ev.event}<br><small>${yearStr}</small></div>
            </div>`;
        });
        container.innerHTML = html;

        // Make dots clickable
        container.querySelectorAll('.ctx-tl-dot').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.eventIdx);
                const ev = bookData.keyEvents[idx];
                if (ev) this.openContextForEvent(ev);
            });
        });
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
    // CONTEXT ACTION BUTTONS
    // ==========================================
    renderActions(app, bookData) {
        const container = document.getElementById('ctxActions');
        const bookName = app.currentBook.name;
        const chapter = app.currentChapter;

        const buttons = [
            { icon: '\uD83C\uDFDB', label: 'Contexto Hist\u00f3rico', query: `contexto_historico` },
            { icon: '\uD83D\uDDFA', label: 'Geograf\u00eda y Lugares', query: `geografia` },
            { icon: '\uD83D\uDC51', label: 'Personajes', query: `personajes` },
            { icon: '\u2696', label: 'Cultura y Costumbres', query: `cultura` },
            { icon: '\uD83D\uDD17', label: 'Conexiones B\u00edblicas', query: `conexiones` },
        ];

        let html = '';
        buttons.forEach(btn => {
            html += `<button class="ctx-action-btn" data-query="${btn.query}">
                <span class="ctx-action-icon">${btn.icon}</span>
                <span class="ctx-action-label">${btn.label}</span>
            </button>`;
        });
        container.innerHTML = html;

        container.querySelectorAll('.ctx-action-btn').forEach(el => {
            el.addEventListener('click', () => {
                const query = el.dataset.query;
                this.openContextAI(query, bookName, chapter, bookData);
            });
        });
    }

    // ==========================================
    // KEY EVENTS (clickable chips)
    // ==========================================
    renderEvents(bookData) {
        const section = document.getElementById('ctxEventsSection');
        const list = document.getElementById('ctxEventsList');
        const events = bookData.keyEvents || [];

        if (events.length === 0) { section.style.display = 'none'; return; }

        section.style.display = 'block';
        let html = '';
        events.forEach((ev, i) => {
            const yearLabel = ev.year < 0 ? `${Math.abs(ev.year)} a.C.` : `${ev.year} d.C.`;
            const isBC = ev.year < 0;
            html += `<div class="ctx-event-chip" data-event-idx="${i}">
                <span class="ctx-event-year ${isBC ? 'ctx-year-bc' : 'ctx-year-ad'}">${yearLabel}</span>
                <span class="ctx-event-text">${ev.event}</span>
                <span class="ctx-event-arrow">\u2197</span>
            </div>`;
        });
        list.innerHTML = html;

        list.querySelectorAll('.ctx-event-chip').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.eventIdx);
                const ev = bookData.keyEvents[idx];
                if (ev) this.openContextForEvent(ev);
            });
        });
    }

    // ==========================================
    // VERSE SELECTED - update context
    // ==========================================
    onVerseSelected() {
        const app = window.bibliaApp;
        if (!app || !app.selectedVerse || !this.currentBookData) return;
        // Could auto-open context, but let user click buttons
    }

    // ==========================================
    // OPEN SIDEBAR WITH AI CONTEXT
    // ==========================================
    openContextForEvent(ev) {
        const app = window.bibliaApp;
        const bookName = app?.currentBook?.name || '';
        const chapter = app?.currentChapter || 1;
        const yearStr = ev.year < 0 ? Math.abs(ev.year) + ' a.C.' : ev.year + ' d.C.';

        this.openSidebar(`\uD83D\uDCC5 ${ev.event}`, `${yearStr}`);
        this.generateContext(
            `Explica el evento b\u00edblico "${ev.event}" que ocurri\u00f3 aproximadamente en el a\u00f1o ${yearStr}, ` +
            `en el contexto de ${bookName} cap\u00edtulo ${chapter}. ` +
            `Incluye: fecha estimada precisa, lugar geogr\u00e1fico, qui\u00e9nes participaron, ` +
            `qu\u00e9 estaba pasando en el mundo en ese momento, y su significado teol\u00f3gico.`,
            `event_${ev.event}_${ev.year}`
        );
    }

    openContextForPeriod(period) {
        const startLabel = period.yearStart < 0 ? Math.abs(period.yearStart) + ' a.C.' : period.yearStart + ' d.C.';
        const endLabel = (period.yearEnd || 100) < 0 ? Math.abs(period.yearEnd) + ' a.C.' : (period.yearEnd || 100) + ' d.C.';

        this.openSidebar(`\uD83C\uDFDB ${period.label}`, `${startLabel} \u2014 ${endLabel}`);
        this.generateContext(
            `Describe el per\u00edodo b\u00edblico "${period.label}" (${startLabel} a ${endLabel}). ` +
            `Incluye: eventos principales, personajes clave, contexto pol\u00edtico y cultural del mundo antiguo, ` +
            `imperios contempor\u00e1neos, libros b\u00edblicos de este per\u00edodo, y su importancia en la historia de la salvaci\u00f3n.`,
            `period_${period.id}`
        );
    }

    openContextAI(queryType, bookName, chapter, bookData) {
        const startLabel = bookData.yearStart < 0 ? Math.abs(bookData.yearStart) + ' a.C.' : bookData.yearStart + ' d.C.';
        const endLabel = bookData.yearEnd < 0 ? Math.abs(bookData.yearEnd) + ' a.C.' : bookData.yearEnd + ' d.C.';

        const prompts = {
            contexto_historico: {
                title: `\uD83C\uDFDB Contexto Hist\u00f3rico`,
                sub: `${bookName} ${chapter}`,
                prompt: `Describe el contexto hist\u00f3rico de ${bookName} cap\u00edtulo ${chapter} (per\u00edodo: ${bookData.period}, ${startLabel}-${endLabel}). ` +
                    `Incluye: \u00bfQui\u00e9n gobernaba? \u00bfQu\u00e9 imperio dominaba? \u00bfC\u00f3mo era la vida cotidiana? ` +
                    `\u00bfQu\u00e9 eventos mundiales ocurr\u00edan? Da fechas lo m\u00e1s precisas posible.`
            },
            geografia: {
                title: `\uD83D\uDDFA Geograf\u00eda y Lugares`,
                sub: `${bookName} ${chapter}`,
                prompt: `Describe los lugares geogr\u00e1ficos mencionados o relevantes en ${bookName} cap\u00edtulo ${chapter}. ` +
                    `Para cada lugar: ubicaci\u00f3n exacta, distancias aproximadas, c\u00f3mo era el terreno, ` +
                    `clima, importancia estrat\u00e9gica, y nombre actual si existe. Per\u00edodo: ${startLabel}-${endLabel}.`
            },
            personajes: {
                title: `\uD83D\uDC51 Personajes`,
                sub: `${bookName} ${chapter}`,
                prompt: `Lista y describe los personajes clave de ${bookName} cap\u00edtulo ${chapter}. ` +
                    `Para cada uno: nombre hebreo/griego si aplica, rol, edad aproximada, relaciones familiares, ` +
                    `motivaciones, y destino final. Per\u00edodo: ${startLabel}-${endLabel}.`
            },
            cultura: {
                title: `\u2696 Cultura y Costumbres`,
                sub: `${bookName} ${chapter}`,
                prompt: `Explica las costumbres, cultura y pr\u00e1cticas mencionadas o impl\u00edcitas en ${bookName} cap\u00edtulo ${chapter}. ` +
                    `Incluye: vestimenta, alimentaci\u00f3n, estructura social, pr\u00e1cticas religiosas, leyes, ` +
                    `econom\u00eda, y c\u00f3mo difiere del mundo actual. Per\u00edodo: ${startLabel}-${endLabel}.`
            },
            conexiones: {
                title: `\uD83D\uDD17 Conexiones B\u00edblicas`,
                sub: `${bookName} ${chapter}`,
                prompt: `Muestra las conexiones de ${bookName} cap\u00edtulo ${chapter} con otros pasajes b\u00edblicos. ` +
                    `Incluye: profec\u00edas cumplidas, tipos y figuras, paralelos con otros libros, ` +
                    `citas del NT que referencian este pasaje, y su lugar en la historia redentora. Per\u00edodo: ${startLabel}-${endLabel}.`
            }
        };

        const p = prompts[queryType];
        if (!p) return;

        this.openSidebar(p.title, p.sub);
        this.generateContext(p.prompt, `${queryType}_${this.currentBookId}_${window.bibliaApp?.currentChapter}`);
    }

    // ==========================================
    // AI GENERATION
    // ==========================================
    async generateContext(prompt, cacheKey) {
        const body = document.getElementById('ctxSidebarBody');

        // Check cache
        if (this.cache[cacheKey]) {
            body.innerHTML = this.cache[cacheKey];
            return;
        }

        // Show loading
        body.innerHTML = `<div class="ctx-loading">
            <div class="ctx-loading-spinner"></div>
            <div class="ctx-loading-text">Analizando contexto hist\u00f3rico...</div>
        </div>`;

        this.isLoading = true;

        try {
            const res = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.TOKEN}`
                },
                body: JSON.stringify({
                    model: 'openclaw',
                    stream: true,
                    messages: [
                        {
                            role: 'system',
                            content: `Eres un historiador b\u00edblico experto. Respondes en espa\u00f1ol con informaci\u00f3n precisa y acad\u00e9mica.
USA ESTE FORMATO para TODAS las respuestas:
- Usa **texto** para negritas en t\u00edtulos y conceptos clave
- Usa l\u00edneas separadas con encabezados claros
- Da FECHAS lo m\u00e1s precisas posible (ej: "~1446 a.C.", "entre 586-538 a.C.")
- Usa emojis al inicio de cada secci\u00f3n para mejor visual
- S\u00e9 conciso pero completo (m\u00e1x 400 palabras)
- Al final agrega una secci\u00f3n "Dato curioso" con algo sorprendente
- Perspectiva evang\u00e9lica reformada`
                        },
                        { role: 'user', content: prompt }
                    ]
                })
            });

            if (!res.ok) {
                body.innerHTML = `<div class="ctx-error">\u26A0 Error al conectar con la IA. Intenta de nuevo.</div>`;
                this.isLoading = false;
                return;
            }

            // Stream response
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            body.innerHTML = '<div class="ctx-ai-response" id="ctxAiResponse"></div>';
            const responseEl = document.getElementById('ctxAiResponse');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

                for (const line of lines) {
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;

                    try {
                        const json = JSON.parse(data);
                        const delta = json.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullText += delta;
                            responseEl.innerHTML = this.formatResponse(fullText);
                            // Auto-scroll sidebar
                            body.scrollTop = body.scrollHeight;
                        }
                    } catch (e) { /* skip parse errors */ }
                }
            }

            // Cache the final result
            this.cache[cacheKey] = body.innerHTML;

        } catch (err) {
            body.innerHTML = `<div class="ctx-error">\u26A0 ${err.message || 'Error de conexi\u00f3n'}</div>`;
        }

        this.isLoading = false;
    }

    formatResponse(text) {
        return text
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Headers (## or ###)
            .replace(/^###?\s+(.+)$/gm, '<div class="ctx-resp-heading">$1</div>')
            // Bullet points
            .replace(/^[-\u2022]\s+(.+)$/gm, '<div class="ctx-resp-bullet">\u2022 $1</div>')
            // Numbered lists
            .replace(/^\d+\.\s+(.+)$/gm, '<div class="ctx-resp-bullet">$1</div>')
            // Line breaks
            .replace(/\n\n/g, '<br>')
            .replace(/\n/g, '<br>');
    }

    // ==========================================
    // SIDEBAR
    // ==========================================
    openSidebar(title, subtitle) {
        this.sidebarOpen = true;
        document.getElementById('ctxSidebarTitle').innerHTML = `${title} <small style="opacity:0.6;font-weight:400;font-size:0.8em">${subtitle || ''}</small>`;
        this.sidebar.classList.add('active');
        document.getElementById('overlay')?.classList.add('active');
    }

    closeSidebar() {
        this.sidebarOpen = false;
        this.sidebar.classList.remove('active');
        // Only remove overlay if no other sidebar is open
        const otherSidebars = document.querySelectorAll('.sidebar.active');
        if (otherSidebars.length === 0) {
            document.getElementById('overlay')?.classList.remove('active');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.bibliaContext = new BibliaContext();
});
