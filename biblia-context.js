// ============================================
// BIBLIA CONTEXT - Panel Contextual Histórico
// Timeline interactiva + Panel IA lateral
// Genera contexto histórico con IA
// ============================================

class BibliaContext {
    constructor() {
        this.API_URL = '/api/chat';
        this.MODELS = ['qwen3.5:122b-cloud', 'qwen3.5:27b-cloud', 'qwen3-next:80b-cloud'];
        this.timelineRange = { min: -4000, max: 100 };
        this.currentBookData = null;
        this.currentBookId = null;
        this.sidebarOpen = false;
        this.isLoading = false;
        this.cache = {};
        this.abortController = null;
        this.generationId = 0;

        this.injectPanel();
        this.injectSidebar();
        this.injectGlobalUI();
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

            <!-- Collapsible toggle (visible only on mobile via CSS) -->
            <button class="ctx-collapse-toggle" id="ctxCollapseToggle" aria-expanded="false">
                <span>\uD83D\uDCD6 Explorar contexto hist\u00f3rico</span>
                <span class="ctx-collapse-arrow">\u25BC</span>
            </button>

            <!-- Collapsible body -->
            <div class="ctx-collapse-body collapsed" id="ctxCollapseBody">
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
            <div id="ctxSidebarBody" style="padding:0">
                <!-- AI Context Section -->
                <div class="ctx-sidebar-section" id="ctxSectionAI">
                    <button class="ctx-section-toggle" aria-expanded="true" data-section="ai">
                        <span><span class="ctx-section-icon">\uD83E\uDDE0</span> Contexto IA</span>
                        <span class="ctx-section-arrow">\u25BC</span>
                    </button>
                    <div class="ctx-section-body open" id="ctxAiBody">
                        <div class="ctx-section-content" id="ctxAiContent">
                            <div class="ctx-no-data">
                                <div class="ctx-no-data-icon">\uD83C\uDFDB</div>
                                Selecciona una opci\u00f3n para generar contexto
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Map Section -->
                <div class="ctx-sidebar-section" id="ctxSectionMap">
                    <button class="ctx-section-toggle" aria-expanded="false" data-section="map">
                        <span><span class="ctx-section-icon">\uD83D\uDDFA</span> Mapa Hist\u00f3rico</span>
                        <span class="ctx-section-arrow">\u25BC</span>
                    </button>
                    <div class="ctx-section-body" id="ctxMapBody">
                        <div class="ctx-section-content" id="ctxMapContent"></div>
                    </div>
                </div>
                <!-- Infographics Section -->
                <div class="ctx-sidebar-section" id="ctxSectionInfog">
                    <button class="ctx-section-toggle" aria-expanded="false" data-section="infog">
                        <span><span class="ctx-section-icon">\uD83D\uDCCA</span> Infograf\u00edas</span>
                        <span class="ctx-section-arrow">\u25BC</span>
                    </button>
                    <div class="ctx-section-body" id="ctxInfogBody">
                        <div class="ctx-section-content" id="ctxInfogContent"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.sidebar);

        // Lightbox
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'ctx-lightbox';
        this.lightbox.innerHTML = `
            <button class="ctx-lightbox-close">\u2715</button>
            <img src="" alt="">
            <div class="ctx-lightbox-caption"></div>
        `;
        document.body.appendChild(this.lightbox);
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('ctx-lightbox-close')) {
                this.lightbox.classList.remove('active');
            }
        });
    }

    // ==========================================
    // GLOBAL UI ENHANCEMENTS
    // ==========================================
    injectGlobalUI() {
        // Back to top button
        this.bttBtn = document.createElement('button');
        this.bttBtn.className = 'btt-btn';
        this.bttBtn.innerHTML = '\u2191';
        this.bttBtn.title = 'Volver arriba';
        this.bttBtn.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(this.bttBtn);
        this.bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', () => {
            this.bttBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        // VOTD dismiss button
        const votd = document.getElementById('verseOfDay');
        if (votd && !votd.querySelector('.votd-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'votd-close';
            closeBtn.innerHTML = '\u2715';
            closeBtn.title = 'Cerrar vers\u00edculo del d\u00eda';
            closeBtn.setAttribute('aria-label', 'Cerrar vers\u00edculo del d\u00eda');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                votd.style.maxHeight = votd.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    votd.style.transition = 'max-height 0.4s ease, opacity 0.3s, padding 0.4s';
                    votd.style.maxHeight = '0';
                    votd.style.opacity = '0';
                    votd.style.padding = '0 20px';
                    votd.style.overflow = 'hidden';
                });
            });
            votd.prepend(closeBtn);
        }
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Collapsible context panel toggle (mobile)
        const collapseToggle = document.getElementById('ctxCollapseToggle');
        const collapseBody = document.getElementById('ctxCollapseBody');
        if (collapseToggle && collapseBody) {
            collapseToggle.addEventListener('click', () => {
                const expanded = collapseToggle.getAttribute('aria-expanded') === 'true';
                collapseToggle.setAttribute('aria-expanded', !expanded);
                if (expanded) {
                    collapseBody.classList.add('collapsed');
                } else {
                    collapseBody.classList.remove('collapsed');
                    collapseBody.style.maxHeight = collapseBody.scrollHeight + 'px';
                }
            });
            // On desktop, always show (no collapse)
            const mq = window.matchMedia('(min-width: 769px)');
            const handleMQ = (e) => {
                if (e.matches) {
                    collapseBody.classList.remove('collapsed');
                    collapseBody.style.maxHeight = 'none';
                } else {
                    collapseBody.classList.add('collapsed');
                    collapseToggle.setAttribute('aria-expanded', 'false');
                }
            };
            mq.addEventListener('change', handleMQ);
            handleMQ(mq);
        }

        document.getElementById('ctxSidebarClose')?.addEventListener('click', () => this.closeSidebar());

        // Section toggles (expand/collapse)
        this.sidebar.querySelectorAll('.ctx-section-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !expanded);
                // Find the section body — it's a sibling of the toggle or of its parent row
                const section = toggle.closest('.ctx-sidebar-section');
                const body = section?.querySelector('.ctx-section-body');
                if (body) body.classList.toggle('open', !expanded);
            });
        });

        // Verse action menu buttons
        document.getElementById('actionContexto')?.addEventListener('click', () => {
            this.openVerseContext('contexto_historico');
            document.getElementById('verseActions')?.classList.remove('active');
        });
        document.getElementById('actionMapa')?.addEventListener('click', () => {
            this.openVerseContext('mapa');
            document.getElementById('verseActions')?.classList.remove('active');
        });
        document.getElementById('actionInfografia')?.addEventListener('click', () => {
            this.openVerseContext('imagenes');
            document.getElementById('verseActions')?.classList.remove('active');
        });

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
        this.injectChapterIllustrations(bookId, app.currentChapter);
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
                role="button" tabindex="0" aria-label="Per\u00edodo: ${p.label}"
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
            html += `<div class="ctx-tl-dot" style="left:${pos}%" data-event-idx="${i}"
                role="button" tabindex="0" aria-label="${ev.event} (${yearStr})">
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
            { icon: '\uD83C\uDFDB', label: 'Contexto Hist\u00f3rico', query: `contexto_historico`, hint: 'IA analiza la \u00e9poca' },
            { icon: '\uD83D\uDDFA', label: 'Geograf\u00eda y Lugares', query: `geografia`, hint: 'IA describe los lugares' },
            { icon: '\uD83D\uDC51', label: 'Personajes', query: `personajes`, hint: 'IA perfila cada persona' },
            { icon: '\u2696', label: 'Cultura y Costumbres', query: `cultura`, hint: 'IA explica la cultura' },
            { icon: '\uD83D\uDD17', label: 'Conexiones B\u00edblicas', query: `conexiones`, hint: 'IA conecta pasajes' },
        ];

        let html = '';
        buttons.forEach(btn => {
            html += `<button class="ctx-action-btn" data-query="${btn.query}" title="${btn.hint}">
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
            html += `<div class="ctx-event-chip" data-event-idx="${i}"
                role="button" tabindex="0" aria-label="${ev.event} - ${yearLabel}">
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
    // INLINE CHAPTER ILLUSTRATIONS
    // ==========================================
    injectChapterIllustrations(bookId, chapter) {
        // Illustrations disabled - clean reading experience
        const container = document.getElementById('verseContainer');
        if (!container) return;
        container.querySelectorAll('.ctx-inline-illustration').forEach(el => el.remove());
        return;

        // Remove previous illustrations
        container.querySelectorAll('.ctx-inline-illustration').forEach(el => el.remove());

        const allImages = typeof BIBLE_IMAGES !== 'undefined' ? BIBLE_IMAGES : {};
        let images = allImages[bookId] || [];

        // Filter images for this chapter
        let chapterImages = images.filter(img =>
            img.chapters && img.chapters.includes(chapter)
        );

        // If no chapter-specific images, skip inline illustrations
        if (chapterImages.length === 0) return;

        // Sort by verseHint so they appear in order
        chapterImages.sort((a, b) => (a.verseHint || 1) - (b.verseHint || 1));

        // Find all verse elements
        const verses = container.querySelectorAll('.verse');
        if (verses.length === 0) return;

        // Insert each image near its verseHint position
        chapterImages.forEach(img => {
            const targetVerse = img.verseHint || 1;

            // Find the verse element closest to the hint
            let insertAfter = null;
            for (const v of verses) {
                const vNum = parseInt(v.dataset?.verse || v.querySelector('.verse-num')?.textContent || '0');
                if (vNum >= targetVerse) {
                    insertAfter = v;
                    break;
                }
            }
            // If not found, insert after last verse
            if (!insertAfter) insertAfter = verses[verses.length - 1];

            // Create the illustration card
            const imgSrc = img.local || img.url;
            const card = document.createElement('div');
            card.className = 'ctx-inline-illustration';
            card.innerHTML = `
                <div class="ctx-inline-img-wrap">
                    <img src="${imgSrc}" alt="${img.title}" loading="lazy"${img.local && img.url ? ` data-fallback="${img.url}"` : ''}>
                    <div class="ctx-inline-gradient"></div>
                </div>
                <div class="ctx-inline-caption">
                    <span class="ctx-inline-title">${img.title}</span>
                    <span class="ctx-inline-artist">${img.artist || ''}</span>
                </div>
            `;

            // Fallback to remote URL if local image fails
            const imgEl = card.querySelector('img');
            if (imgEl) {
                imgEl.onerror = function() {
                    if (this.dataset.fallback && this.src !== this.dataset.fallback) {
                        this.src = this.dataset.fallback;
                    }
                };
            }

            // Click to open lightbox
            card.addEventListener('click', () => {
                this.openLightbox(imgSrc, `${img.title} — ${img.artist || ''}`);
            });

            // Insert after the target verse
            insertAfter.parentNode.insertBefore(card, insertAfter.nextSibling);
        });

        // Animate in with IntersectionObserver
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            container.querySelectorAll('.ctx-inline-illustration').forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback: show all immediately
            container.querySelectorAll('.ctx-inline-illustration').forEach(el => {
                el.classList.add('visible');
            });
        }
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

        // Render map and images alongside AI
        this.renderMap(this.currentBookId, bookData);
        this.renderImages(this.currentBookId, chapter);

        this.openSidebar(p.title, p.sub);
        this.expandSection('ai');
        this.generateContext(p.prompt, `${queryType}_${this.currentBookId}_${window.bibliaApp?.currentChapter}`);
    }

    // ==========================================
    // AI GENERATION
    // ==========================================
    async generateContext(prompt, cacheKey) {
        const aiContent = document.getElementById('ctxAiContent');
        if (!aiContent) return;

        // Abort any previous request
        if (this.abortController) {
            this.abortController.abort();
        }

        // Track this generation to detect stale writes
        this.generationId++;
        const myGenId = this.generationId;

        // Expand AI section
        const aiToggle = this.sidebar.querySelector('[data-section="ai"]');
        if (aiToggle) {
            aiToggle.setAttribute('aria-expanded', 'true');
            const aiSection = aiToggle.closest('.ctx-sidebar-section');
            aiSection?.querySelector('.ctx-section-body')?.classList.add('open');
        }

        // Check cache
        if (this.cache[cacheKey]) {
            aiContent.innerHTML = this.cache[cacheKey];
            this.showNarrateBtn(true);
            return;
        }

        this.showNarrateBtn(false);
        // Show thinking indicator
        aiContent.innerHTML = `<div class="ctx-loading">
            <div class="ctx-thinking-brain">
                <div class="ctx-thinking-pulse"></div>
                <span class="ctx-thinking-icon">\uD83E\uDDE0</span>
            </div>
            <div class="ctx-thinking-status">
                <div class="ctx-thinking-label">La IA est\u00e1 pensando<span class="ctx-thinking-dots"></span></div>
                <div class="ctx-thinking-detail" id="ctxThinkingDetail">Analizando contexto hist\u00f3rico...</div>
            </div>
            <div class="ctx-thinking-bar"><div class="ctx-thinking-bar-fill"></div></div>
        </div>`;
        this.startThinkingMessages(cacheKey);

        this.isLoading = true;
        this.abortController = new AbortController();

        const ollamaKey = localStorage.getItem('biblia_ollama_key');
        if (!ollamaKey) {
            aiContent.innerHTML = `<div class="ctx-error">\u26A0 Configur\u00e1 tu API key de Ollama para usar el Contexto IA.</div>`;
            this.isLoading = false;
            return;
        }

        const body = {
            model: this.MODELS[0],
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
            ],
            options: { num_predict: 4096, temperature: 0.7 }
        };

        try {
            // Try each model with fallback
            let res = null;
            for (const modelName of this.MODELS) {
                body.model = modelName;
                res = await fetch(this.API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ollamaKey}`
                    },
                    signal: this.abortController.signal,
                    body: JSON.stringify(body)
                });
                if (res.status !== 404) break;
            }

            if (myGenId !== this.generationId) return;

            if (!res.ok) {
                aiContent.innerHTML = `<div class="ctx-error">\u26A0 Error al conectar con la IA. Intenta de nuevo.</div>`;
                this.isLoading = false;
                return;
            }

            // Stop thinking animation, start streaming
            this.stopThinkingMessages();
            const responseEl = document.createElement('div');
            responseEl.className = 'ctx-ai-response';
            aiContent.innerHTML = '';
            aiContent.appendChild(responseEl);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (myGenId !== this.generationId) {
                    reader.cancel();
                    return;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    try {
                        const json = JSON.parse(trimmed);
                        if (json.done) continue;
                        const delta = json.message?.content;
                        if (delta) {
                            fullText += delta;
                            responseEl.innerHTML = this.formatResponse(fullText);
                            this.sidebar.scrollTop = this.sidebar.scrollHeight;
                        }
                    } catch (e) {
                        buffer = trimmed + '\n' + buffer;
                    }
                }
            }

            // Process remaining buffer
            if (buffer.trim()) {
                try {
                    const json = JSON.parse(buffer.trim());
                    if (!json.done && json.message?.content) {
                        fullText += json.message.content;
                        responseEl.innerHTML = this.formatResponse(fullText);
                    }
                } catch (e) {}
            }

            if (myGenId === this.generationId) {
                this.cache[cacheKey] = aiContent.innerHTML;
                this.showNarrateBtn(true);
            }

        } catch (err) {
            this.stopThinkingMessages();
            if (err.name === 'AbortError') return;
            if (myGenId === this.generationId) {
                aiContent.innerHTML = `<div class="ctx-error">\u26A0 ${err.message || 'Error de conexi\u00f3n'}</div>`;
            }
        }

        this.stopThinkingMessages();
        if (myGenId === this.generationId) {
            this.isLoading = false;
            this.abortController = null;
        }
    }

    // ==========================================
    // NARRATE CONTEXT (TTS)
    // ==========================================
    showNarrateBtn(visible) {
        const aiContent = document.getElementById('ctxAiContent');
        if (!aiContent) return;

        // Remove existing narrate button
        aiContent.querySelector('.ctx-narrate-btn')?.remove();

        if (visible) {
            const btn = document.createElement('button');
            btn.className = 'ctx-narrate-btn';
            btn.title = 'Narrar contexto en voz alta';
            btn.innerHTML = '\uD83D\uDD0A Narrar contexto';
            btn.addEventListener('click', () => this.narrateContext());
            aiContent.insertBefore(btn, aiContent.firstChild);
        }
    }

    narrateContext() {
        const aiContent = document.getElementById('ctxAiContent');
        if (!aiContent) return;

        // Get text excluding the button itself
        const clone = aiContent.cloneNode(true);
        clone.querySelector('.ctx-narrate-btn')?.remove();
        const text = clone.innerText || clone.textContent || '';
        if (!text.trim()) return;

        const bot = window.bibliaBot;
        if (bot && typeof bot.speak === 'function') {
            bot.speak(text.trim());
        } else {
            // Fallback: basic speechSynthesis
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utt = new SpeechSynthesisUtterance(text.trim());
                utt.lang = 'es-ES';
                utt.rate = 1;
                window.speechSynthesis.speak(utt);
            }
        }
    }

    // ==========================================
    // VERSE CONTEXT (from verse action menu)
    // ==========================================
    openVerseContext(mode) {
        const app = window.bibliaApp;
        if (!app || !app.selectedVerse) return;

        const { bookName, book: bookId, chapter, verse } = app.selectedVerse;
        const bookData = typeof BIBLE_TIMELINE !== 'undefined' ? BIBLE_TIMELINE.books[bookId] : null;
        if (!bookData) return;

        this.currentBookData = bookData;
        this.currentBookId = bookId;

        // Always render map and images
        this.renderMap(bookId, bookData);
        this.renderImages(bookId, chapter);

        if (mode === 'mapa') {
            this.openSidebar(`\uD83D\uDDFA ${bookName} ${chapter}:${verse}`, 'Mapa Hist\u00f3rico');
            this.expandSection('map');
        } else if (mode === 'imagenes') {
            this.openSidebar(`\uD83D\uDDBC ${bookName} ${chapter}:${verse}`, 'Im\u00e1genes');
            this.expandSection('images');
        } else {
            // contexto_historico - generate AI + show all
            const startLabel = bookData.yearStart < 0 ? Math.abs(bookData.yearStart) + ' a.C.' : bookData.yearStart + ' d.C.';
            const endLabel = bookData.yearEnd < 0 ? Math.abs(bookData.yearEnd) + ' a.C.' : bookData.yearEnd + ' d.C.';
            this.openSidebar(`\uD83C\uDFDB ${bookName} ${chapter}:${verse}`, `${startLabel} \u2014 ${endLabel}`);
            this.expandSection('ai');
            this.generateContext(
                `Explica el contexto hist\u00f3rico espec\u00edfico de ${bookName} cap\u00edtulo ${chapter}, vers\u00edculo ${verse}. ` +
                `Per\u00edodo: ${bookData.period} (${startLabel}-${endLabel}). ` +
                `Incluye: \u00bfQu\u00e9 estaba pasando en ese momento exacto? \u00bfQui\u00e9n habla? ` +
                `\u00bfD\u00f3nde est\u00e1n geogr\u00e1ficamente? \u00bfQu\u00e9 costumbres se mencionan? ` +
                `Da fechas lo m\u00e1s precisas posible y contexto cultural.`,
                `verse_${bookId}_${chapter}_${verse}`
            );
        }
    }

    expandSection(sectionName) {
        this.sidebar.querySelectorAll('.ctx-section-toggle').forEach(toggle => {
            const isTarget = toggle.dataset.section === sectionName;
            toggle.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
            const section = toggle.closest('.ctx-sidebar-section');
            const body = section?.querySelector('.ctx-section-body');
            if (body) body.classList.toggle('open', isTarget);
        });
    }

    // ==========================================
    // MAP RENDERING
    // ==========================================
    renderMap(bookId, bookData) {
        const container = document.getElementById('ctxMapContent');
        if (!container) return;

        // Collect maps from multiple sources
        const allBookMaps = [];

        // 1. From BIBLE_MAPS_BY_BOOK (new Biblica maps)
        if (typeof BIBLE_MAPS_BY_BOOK !== 'undefined' && BIBLE_MAPS_BY_BOOK[bookId]) {
            BIBLE_MAPS_BY_BOOK[bookId].forEach(m => allBookMaps.push(m));
        }

        // 2. From BIBLE_TIMELINE.maps (legacy)
        const region = bookData.mapRegion;
        const timelineMaps = typeof BIBLE_TIMELINE !== 'undefined' ? BIBLE_TIMELINE.maps : {};
        let legacyMap = timelineMaps[region];
        if (!legacyMap) {
            for (const key of Object.keys(timelineMaps)) {
                if (timelineMaps[key].books?.includes(bookId)) {
                    legacyMap = timelineMaps[key];
                    break;
                }
            }
        }
        if (legacyMap && !allBookMaps.some(m => m.title === legacyMap.title)) {
            allBookMaps.push(legacyMap);
        }

        if (allBookMaps.length === 0) {
            container.innerHTML = `<div class="ctx-no-data"><div class="ctx-no-data-icon">\uD83D\uDDFA</div>No hay mapa disponible para este libro</div>`;
            return;
        }

        // Show first map prominently, rest as gallery
        const mapData = allBookMaps[0];
        const mapSrc = mapData.local || mapData.url;
        let html = `
            <div class="ctx-map-container">
                <img class="ctx-map-img" src="${mapSrc}" alt="${mapData.title}" loading="lazy"${mapData.local && mapData.url ? ` data-fallback="${mapData.url}"` : ''}>
                <button class="ctx-map-fullscreen" title="Ampliar">\u26F6</button>
                <div class="ctx-map-title">${mapData.title}</div>
                <div class="ctx-map-credit">Fuente: Wikimedia Commons \u2022 Dominio p\u00fablico / CC BY-SA</div>
            </div>
        `;
        // Additional maps as smaller thumbnails
        if (allBookMaps.length > 1) {
            html += '<div class="ctx-map-gallery">';
            allBookMaps.slice(1).forEach((m, i) => {
                const src = m.local || m.url;
                html += `<div class="ctx-map-thumb" data-map-idx="${i+1}">
                    <img src="${src}" alt="${m.title}" loading="lazy"${m.local && m.url ? ` data-fallback="${m.url}"` : ''}>
                    <div class="ctx-map-thumb-title">${m.title}</div>
                </div>`;
            });
            html += '</div>';
        }
        container.innerHTML = html;

        // Map zoom on click
        const img = container.querySelector('.ctx-map-img');
        if (img) {
            img.onerror = function() {
                if (this.dataset.fallback && this.src !== this.dataset.fallback) {
                    this.src = this.dataset.fallback;
                }
            };
            img.addEventListener('click', (e) => {
                if (img.classList.contains('zoomed')) {
                    img.classList.remove('zoomed');
                } else {
                    const rect = img.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    img.style.setProperty('--zoom-x', x + '%');
                    img.style.setProperty('--zoom-y', y + '%');
                    img.classList.add('zoomed');
                }
            });
        }

        // Fullscreen button opens lightbox
        container.querySelector('.ctx-map-fullscreen')?.addEventListener('click', () => {
            this.openLightbox(mapSrc, mapData.title);
        });

        // Map gallery thumbnail clicks
        container.querySelectorAll('.ctx-map-thumb').forEach(el => {
            const idx = parseInt(el.dataset.mapIdx);
            const m = allBookMaps[idx];
            if (m) {
                el.addEventListener('click', () => {
                    this.openLightbox(m.local || m.url, m.title);
                });
            }
            // Fallback for broken images
            const thumbImg = el.querySelector('img');
            if (thumbImg) {
                thumbImg.onerror = function() {
                    if (this.dataset.fallback && this.src !== this.dataset.fallback) {
                        this.src = this.dataset.fallback;
                    }
                };
            }
        });
    }

    // ==========================================
    // IMAGE GALLERY
    // ==========================================
    renderImages(bookId, chapter) {
        // Render infographics instead of illustrations
        this.renderInfographics(bookId, chapter);
        return;
    }

    renderInfographics(bookId, chapter) {
        const container = document.getElementById('ctxInfogContent');
        if (!container) return;

        // Map app book IDs to BIBLE_INFOGRAPHICS keys
        const INFOG_KEY_MAP = {
            genesis:'GEN', exodo:'EXO', levitico:'LEV', numeros:'NUM', deuteronomio:'DEU',
            josue:'JOS', jueces:'JUE', rut:'RUT', '1samuel':'1SA', '2samuel':'2SA',
            '1reyes':'1RE', '2reyes':'2RE', '1cronicas':'1CR', '2cronicas':'2CR',
            esdras:'ESD', nehemias:'NEH', ester:'EST', job:'JOB', salmos:'SAL',
            proverbios:'PRO', eclesiastes:'ECL', cantares:'CNT',
            isaias:'ISA', jeremias:'JER', lamentaciones:'LAM', ezequiel:'EZE', daniel:'DAN',
            oseas:'OSE', joel:'JOE', amos:'AMO', abdias:'ABD', jonas:'JON',
            miqueas:'MIQ', nahum:'NAH', habacuc:'HAB', sofonias:'SOF', hageo:'HAG',
            zacarias:'ZAC', malaquias:'MAL',
            mateo:'MAT', marcos:'MAR', lucas:'LUC', juan:'JUA', hechos:'HEC',
            romanos:'ROM', '1corintios':'1CO', '2corintios':'2CO', galatas:'GAL',
            efesios:'EFE', filipenses:'FIL', colosenses:'COL',
            '1tesalonicenses':'1TS', '2tesalonicenses':'2TS',
            '1timoteo':'1TI', '2timoteo':'2TI', tito:'TIT', filemon:'FLM',
            hebreos:'HEB', santiago:'STG', '1pedro':'1PE', '2pedro':'2PE',
            '1juan':'1JN', '2juan':'2JN', '3juan':'3JN', judas:'JUD', apocalipsis:'APO'
        };
        const infogKey = INFOG_KEY_MAP[bookId] || bookId.toUpperCase();

        const allInfog = typeof BIBLE_INFOGRAPHICS !== 'undefined' ? BIBLE_INFOGRAPHICS : {};
        const bookInfog = allInfog[infogKey] || [];

        if (bookInfog.length === 0) {
            container.innerHTML = '<div class="ctx-empty">No hay infografías disponibles para este libro todavía.</div>';
            return;
        }

        container.innerHTML = `
            <div class="ctx-infog-grid">
                ${bookInfog.map((inf, i) => `
                    <div class="ctx-infog-card" data-infog-idx="${i}">
                        <img src="${inf.local || inf.url}" alt="${inf.title}" loading="lazy"
                            ${inf.local && inf.url ? `data-fallback="${inf.url}"` : ''}>
                        <div class="ctx-infog-title">${inf.title}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Click to open lightbox
        container.querySelectorAll('.ctx-infog-card').forEach(el => {
            const idx = parseInt(el.dataset.infogIdx);
            const inf = bookInfog[idx];
            if (inf) {
                el.addEventListener('click', () => {
                    this.openLightbox(inf.local || inf.url, inf.title);
                });
            }
            const img = el.querySelector('img');
            if (img) {
                img.onerror = function() {
                    if (this.dataset.fallback && this.src !== this.dataset.fallback) {
                        this.src = this.dataset.fallback;
                    }
                };
            }
        });
    }

    renderImagesLegacy(bookId, chapter) {
        const container = document.getElementById('ctxImagesContent');
        if (!container) return;

        const allImages = typeof BIBLE_IMAGES !== 'undefined' ? BIBLE_IMAGES : {};
        let images = allImages[bookId] || [];

        // Filter by chapter if images have chapter data
        const chapterImages = images.filter(img =>
            !img.chapters || img.chapters.includes(chapter)
        );

        // Use chapter-specific images if available, otherwise show all book images
        const displayImages = chapterImages.length > 0 ? chapterImages : images;

        // Add generic if none found
        if (displayImages.length === 0) {
            const bookData = BIBLE_TIMELINE?.books?.[bookId];
            const isNT = bookData?.era === 'ad';
            const generic = allImages._generic?.[isNT ? 'nt' : 'at'];
            if (generic) displayImages.push(generic);
        }

        if (displayImages.length === 0) {
            container.innerHTML = `<div class="ctx-no-data"><div class="ctx-no-data-icon">\uD83D\uDDBC</div>No hay im\u00e1genes disponibles</div>`;
            return;
        }

        let html = '<div class="ctx-gallery">';
        displayImages.forEach((img, i) => {
            const src = img.local || img.url;
            html += `<div class="ctx-gallery-item" data-img-idx="${i}">
                <img src="${src}" alt="${img.title}" loading="lazy"${img.local && img.url ? ` data-fallback="${img.url}"` : ''}>
                <div class="ctx-gallery-caption">${img.title}
                    <div class="ctx-gallery-artist">${img.artist || ''}</div>
                </div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;

        // Fallback for broken local images
        container.querySelectorAll('img[data-fallback]').forEach(imgEl => {
            imgEl.onerror = function() {
                if (this.dataset.fallback && this.src !== this.dataset.fallback) {
                    this.src = this.dataset.fallback;
                }
            };
        });

        // Click to open lightbox
        container.querySelectorAll('.ctx-gallery-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.imgIdx);
                const img = displayImages[idx];
                if (img) this.openLightbox(img.local || img.url, `${img.title} \u2014 ${img.artist || ''}`);
            });
        });
    }

    openLightbox(url, caption) {
        if (!this.lightbox) return;
        this.lightbox.querySelector('img').src = url;
        this.lightbox.querySelector('.ctx-lightbox-caption').textContent = caption || '';
        this.lightbox.classList.add('active');
    }

    startThinkingMessages(cacheKey) {
        const messages = [
            'Analizando contexto hist\u00f3rico...',
            'Consultando fuentes acad\u00e9micas...',
            'Procesando informaci\u00f3n b\u00edblica...',
            'Revisando cronolog\u00eda y fechas...',
            'Generando respuesta detallada...',
            'Organizando datos hist\u00f3ricos...',
        ];
        let idx = 0;
        this.thinkingInterval = setInterval(() => {
            const el = document.getElementById('ctxThinkingDetail');
            if (el) {
                idx = (idx + 1) % messages.length;
                el.textContent = messages[idx];
            }
        }, 2200);
    }

    stopThinkingMessages() {
        if (this.thinkingInterval) {
            clearInterval(this.thinkingInterval);
            this.thinkingInterval = null;
        }
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
        // Fix #1: Reset scroll position
        const body = document.getElementById('ctxSidebarBody');
        if (body) body.scrollTop = 0;
        this.sidebar.scrollTop = 0;
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
