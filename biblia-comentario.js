// ============================================
// BIBLIA COMENTARIO - Matthew Henry Commentary
// Lazy-loaded panel with per-book JSON caching
// ============================================

class BibliaComentario {
    constructor() {
        this.cache = {};          // { bookId: { bookId_chapter: {...} } }
        this.cacheOrder = [];     // LRU tracking (max 5 books)
        this.maxCache = 5;
        this.isOpen = false;
        this.currentBookId = null;
        this.currentChapter = null;
        this.panel = null;

        this.injectPanel();
        this.bindEvents();
        this.hookIntoApp();
    }

    // ==========================================
    // INJECT PANEL (below verses in #chapterContent)
    // ==========================================
    injectPanel() {
        const chapterContent = document.getElementById('chapterContent');
        if (!chapterContent) return;

        this.panel = document.createElement('div');
        this.panel.id = 'comentarioPanel';
        this.panel.className = 'cmt-panel';
        this.panel.innerHTML = `
            <div class="cmt-header" id="cmtHeader">
                <div class="cmt-header-title">
                    <span class="cmt-header-icon">&#128214;</span>
                    <span id="cmtTitle">Comentario Mateo Henry</span>
                </div>
                <div class="cmt-header-btns">
                    <button class="cmt-header-btn" id="cmtReadAll" title="Leer comentario en voz alta">&#128266;</button>
                    <button class="cmt-header-btn cmt-header-close" id="cmtClose" title="Cerrar">&#10005;</button>
                </div>
            </div>
            <div class="cmt-body" id="cmtBody">
                <div class="cmt-empty">
                    <div class="cmt-empty-icon">&#128214;</div>
                    Selecciona un cap&iacute;tulo para ver el comentario
                </div>
            </div>
        `;

        chapterContent.appendChild(this.panel);
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Toolbar toggle button
        const toggleBtn = document.getElementById('toggleComentario');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Close button in header
        document.getElementById('cmtClose')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        // Read all commentary aloud
        document.getElementById('cmtReadAll')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.readAllAloud();
        });

        // Verse action menu button
        document.getElementById('actionComentario')?.addEventListener('click', () => {
            const app = window.bibliaApp;
            if (!app) return;

            // Get selected verse from the app
            const verseEl = document.querySelector('.verse.selected, .verse.active');
            let verse = 1;
            if (verseEl) {
                const num = verseEl.querySelector('.verse-num');
                if (num) verse = parseInt(num.textContent) || 1;
            }

            // Open panel and scroll to the section containing this verse
            this.open();
            if (app.currentBook && app.currentChapter) {
                this.loadCommentary(app.currentBook.id, app.currentChapter).then(() => {
                    this.scrollToVerseSection(verse);
                });
            }

            // Close verse action menu
            document.getElementById('verseActions')?.classList.remove('active');
        });
    }

    // ==========================================
    // HOOK INTO APP (update on chapter change)
    // ==========================================
    hookIntoApp() {
        const checkApp = () => {
            if (window.bibliaApp) {
                const origLoad = window.bibliaApp.loadChapter.bind(window.bibliaApp);
                window.bibliaApp.loadChapter = (chapterNum) => {
                    origLoad(chapterNum);
                    if (this.isOpen && window.bibliaApp.currentBook) {
                        setTimeout(() => {
                            this.loadCommentary(window.bibliaApp.currentBook.id, chapterNum);
                        }, 100);
                    }
                };

                // If already viewing a chapter, load commentary
                if (this.isOpen && window.bibliaApp.currentBook && window.bibliaApp.currentChapter) {
                    this.loadCommentary(window.bibliaApp.currentBook.id, window.bibliaApp.currentChapter);
                }
            } else {
                setTimeout(checkApp, 200);
            }
        };
        checkApp();
    }

    // ==========================================
    // TOGGLE / OPEN / CLOSE
    // ==========================================
    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    open() {
        this.isOpen = true;
        if (this.panel) this.panel.classList.add('open');

        // Highlight toolbar button
        const btn = document.getElementById('toggleComentario');
        if (btn) btn.classList.add('active');

        // Load current chapter commentary
        const app = window.bibliaApp;
        if (app?.currentBook && app.currentChapter) {
            this.loadCommentary(app.currentBook.id, app.currentChapter);
        }

        // Scroll panel into view
        setTimeout(() => {
            this.panel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
    }

    close() {
        this.isOpen = false;
        if (this.panel) this.panel.classList.remove('open');

        const btn = document.getElementById('toggleComentario');
        if (btn) btn.classList.remove('active');
    }

    // ==========================================
    // LOAD COMMENTARY (lazy fetch per book)
    // ==========================================
    async loadCommentary(bookId, chapter) {
        this.currentBookId = bookId;
        this.currentChapter = chapter;

        const body = document.getElementById('cmtBody');
        if (!body) return;

        // Update header title
        const app = window.bibliaApp;
        const bookName = app?.currentBook?.name || bookId;
        const titleEl = document.getElementById('cmtTitle');
        if (titleEl) titleEl.textContent = `Comentario M. Henry — ${bookName} ${chapter}`;

        // Show loading
        body.innerHTML = `
            <div class="cmt-loading">
                <div class="cmt-spinner"></div>
                Cargando comentario...
            </div>
        `;

        try {
            // Fetch book data (cached)
            const bookData = await this.fetchBook(bookId);
            const key = `${bookId}_${chapter}`;
            const chapterData = bookData[key];

            // Check if user navigated away while loading
            if (this.currentBookId !== bookId || this.currentChapter !== chapter) return;

            if (!chapterData) {
                body.innerHTML = `
                    <div class="cmt-empty">
                        <div class="cmt-empty-icon">&#128214;</div>
                        No hay comentario disponible para ${bookName} ${chapter}
                    </div>
                `;
                return;
            }

            this.renderCommentary(chapterData, bookName, chapter);
        } catch (err) {
            console.error('[BibliaComentario] Error loading commentary:', err);
            if (this.currentBookId !== bookId || this.currentChapter !== chapter) return;
            body.innerHTML = `
                <div class="cmt-empty">
                    <div class="cmt-empty-icon">&#9888;</div>
                    Error al cargar el comentario. Verifica tu conexi&oacute;n.
                </div>
            `;
        }
    }

    // ==========================================
    // FETCH BOOK JSON (with LRU cache)
    // ==========================================
    async fetchBook(bookId) {
        // Return from cache if available
        if (this.cache[bookId]) {
            // Move to end of LRU
            this.cacheOrder = this.cacheOrder.filter(b => b !== bookId);
            this.cacheOrder.push(bookId);
            return this.cache[bookId];
        }

        // Fetch JSON file
        const url = `comentario-henry/${bookId}.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${url}`);
        const data = await res.json();

        // LRU eviction
        if (this.cacheOrder.length >= this.maxCache) {
            const evict = this.cacheOrder.shift();
            delete this.cache[evict];
        }

        this.cache[bookId] = data;
        this.cacheOrder.push(bookId);
        return data;
    }

    // ==========================================
    // RENDER COMMENTARY
    // ==========================================
    renderCommentary(data, bookName, chapter) {
        const body = document.getElementById('cmtBody');
        if (!body) return;

        let html = '';

        // Intro
        if (data.intro) {
            html += `<div class="cmt-intro">${this.escapeHtml(data.intro)}</div>`;
        }

        // Sections
        if (data.sections && data.sections.length > 0) {
            for (let i = 0; i < data.sections.length; i++) {
                const s = data.sections[i];
                const expanded = data.sections.length <= 3 ? ' expanded' : '';
                html += `
                    <div class="cmt-section${expanded}" data-verses="${this.escapeHtml(s.verses)}">
                        <div class="cmt-section-header">
                            <span class="cmt-section-verses">vv. ${this.escapeHtml(s.verses)}</span>
                            <span class="cmt-section-title">${this.escapeHtml(s.title)}</span>
                            <span class="cmt-section-arrow">&#9660;</span>
                        </div>
                        <div class="cmt-section-body">
                            <div class="cmt-section-text">${this.escapeHtml(s.text)}</div>
                            <button class="cmt-read-btn" data-section-idx="${i}" title="Leer esta secci&oacute;n en voz alta">&#128266; Leer secci&oacute;n</button>
                        </div>
                    </div>
                `;
            }
        } else {
            html += `
                <div class="cmt-empty">
                    <div class="cmt-empty-icon">&#128214;</div>
                    Sin secciones de comentario para este cap&iacute;tulo
                </div>
            `;
        }

        // Attribution
        html += `
            <div class="cmt-attribution">
                Comentario B&iacute;blico de Matthew Henry &bull; Dominio p&uacute;blico
            </div>
        `;

        body.innerHTML = html;

        // Bind section toggle clicks
        body.querySelectorAll('.cmt-section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.cmt-section');
                if (section) section.classList.toggle('expanded');
            });
        });

        // Bind section read-aloud buttons
        body.querySelectorAll('.cmt-read-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.sectionIdx);
                if (!isNaN(idx) && data.sections && data.sections[idx]) {
                    const s = data.sections[idx];
                    const label = s.title ? `Versículos ${s.verses}, ${s.title}` : `Versículos ${s.verses}`;
                    this.speakText(`${bookName} ${chapter}. ${label}. ${s.text}`);
                }
            });
        });
    }

    // ==========================================
    // SCROLL TO VERSE SECTION
    // ==========================================
    scrollToVerseSection(verse) {
        const body = document.getElementById('cmtBody');
        if (!body) return;

        const sections = body.querySelectorAll('.cmt-section');
        let targetSection = null;

        for (const section of sections) {
            const versesAttr = section.dataset.verses || '';
            if (this.verseInRange(verse, versesAttr)) {
                targetSection = section;
                break;
            }
        }

        // Fallback: first section
        if (!targetSection && sections.length > 0) {
            targetSection = sections[0];
        }

        if (targetSection) {
            // Expand it
            targetSection.classList.add('expanded');

            // Highlight briefly
            targetSection.classList.add('cmt-highlighted');
            setTimeout(() => targetSection.classList.remove('cmt-highlighted'), 3000);

            // Scroll into view
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ==========================================
    // TEXT-TO-SPEECH
    // ==========================================
    readAllAloud() {
        const body = document.getElementById('cmtBody');
        if (!body) return;

        const app = window.bibliaApp;
        const bookName = app?.currentBook?.name || this.currentBookId;
        const chapter = this.currentChapter;

        // Build full text from intro + all sections
        let text = `Comentario de Mateo Henry. ${bookName}, capítulo ${chapter}. `;

        const intro = body.querySelector('.cmt-intro');
        if (intro) text += intro.textContent.trim() + '. ';

        body.querySelectorAll('.cmt-section').forEach(section => {
            const verses = section.querySelector('.cmt-section-verses');
            const title = section.querySelector('.cmt-section-title');
            const content = section.querySelector('.cmt-section-text');

            if (verses) text += verses.textContent.trim() + '. ';
            if (title && title.textContent.trim()) text += title.textContent.trim() + '. ';
            if (content) text += content.textContent.trim() + ' ';
        });

        this.speakText(text.trim());
    }

    speakText(text) {
        if (!text) return;
        const bot = window.bibliaBot;
        if (bot && typeof bot.speak === 'function') {
            bot.speak(text);
        } else {
            // Fallback: browser speechSynthesis
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(text);
            utt.lang = 'es-ES';
            utt.rate = 1;
            window.speechSynthesis.speak(utt);
        }
    }

    // ==========================================
    // HELPERS
    // ==========================================
    verseInRange(verse, rangeStr) {
        // Parse range like "1-5", "6,7,8", "1-3,5", "12"
        const parts = rangeStr.split(',');
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.includes('-')) {
                const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
                if (verse >= start && verse <= end) return true;
            } else {
                if (parseInt(trimmed) === verse) return true;
            }
        }
        return false;
    }

    escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.bibliaComentario = new BibliaComentario();
});
