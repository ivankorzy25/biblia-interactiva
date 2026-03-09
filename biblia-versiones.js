// ============================================
// BIBLIA VERSIONES - Selector, Paralelo & Comparador
// Side-by-side reading like YouVersion
// ============================================

class BibliaVersiones {
    constructor() {
        this.versions = [
            { id: 'RV1960', name: 'Reina-Valera 1960', abbr: 'RV60', local: true },
            { id: 'NVI', name: 'Nueva Versión Internacional', abbr: 'NVI', local: false },
            { id: 'LBLA', name: 'La Biblia de las Américas', abbr: 'LBLA', local: false },
            { id: 'NTV', name: 'Nueva Traducción Viviente', abbr: 'NTV', local: false },
            { id: 'BTX3', name: 'Biblia Textual 3ra Ed.', abbr: 'BTX', local: false },
            { id: 'PDT', name: 'Palabra de Dios para Todos', abbr: 'PDT', local: false },
            { id: 'RV2004', name: 'Reina Valera Gómez 2004', abbr: 'RVG', local: false }
        ];

        this.currentVersion = localStorage.getItem('biblia_version') || 'RV1960';
        this.parallelVersion = localStorage.getItem('biblia_parallel_version') || 'NVI';
        this.parallelOpen = false;
        this.cache = {};

        this.injectUI();
        this.bindEvents();
        this.hookLoadChapter();
    }

    getBookNum(bookId) {
        const idx = BIBLE_BOOKS.findIndex(b => b.id === bookId);
        return idx >= 0 ? idx + 1 : null;
    }

    isRemote() { return this.currentVersion !== 'RV1960'; }

    // ==========================================
    // UI INJECTION
    // ==========================================
    injectUI() {
        const header = document.querySelector('.header');
        if (!header) return;

        // Version selector button
        this.selectorBtn = document.createElement('button');
        this.selectorBtn.className = 'version-selector-btn';
        const cur = this.versions.find(v => v.id === this.currentVersion);
        this.selectorBtn.textContent = cur ? cur.abbr : 'RV60';
        this.selectorBtn.title = 'Cambiar versión';

        // Parallel toggle button
        this.parallelBtn = document.createElement('button');
        this.parallelBtn.className = 'parallel-toggle-btn';
        this.parallelBtn.textContent = 'Paralelo';
        this.parallelBtn.title = 'Modo paralelo';

        // Dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'version-dropdown';
        this.dropdown.innerHTML = `
            <div class="version-dropdown-title">Versión principal</div>
            ${this.versions.map(v => `
                <div class="version-option ${v.id === this.currentVersion ? 'active' : ''}" data-version="${v.id}" data-target="main">
                    <span class="version-option-abbr">${v.abbr}</span>
                    <span class="version-option-name">${v.name}</span>
                    ${v.local ? '<span class="version-badge-offline">offline</span>' : ''}
                </div>
            `).join('')}
        `;

        header.appendChild(this.selectorBtn);
        header.appendChild(this.parallelBtn);
        header.appendChild(this.dropdown);

        // Parallel panel (will be placed side-by-side with main)
        this.parallelContainer = document.createElement('div');
        this.parallelContainer.className = 'parallel-container';
        this.parallelContainer.innerHTML = `
            <div class="parallel-header">
                <div class="parallel-header-left">
                    <select class="parallel-version-select" id="parallelVersionSelect">
                        ${this.versions.map(v => `<option value="${v.id}" ${v.id === this.parallelVersion ? 'selected' : ''}>${v.abbr} — ${v.name}</option>`).join('')}
                    </select>
                </div>
                <span class="parallel-chapter-label" id="parallelChapterLabel"></span>
                <button class="parallel-close-btn" id="parallelCloseBtn">&times;</button>
            </div>
            <div class="parallel-body" id="parallelBody">
                <div class="parallel-loading">Seleccioná un capítulo para ver en paralelo</div>
            </div>
        `;
        // Don't append yet — will wrap on open

        // Compare panel (bottom sheet for single verse)
        this.comparePanel = document.createElement('div');
        this.comparePanel.className = 'compare-panel';
        this.comparePanel.innerHTML = `
            <div class="compare-header">
                <span class="compare-title">Comparar Versiones</span>
                <button class="compare-close" id="compareClose">&times;</button>
            </div>
            <div class="compare-verse-ref" id="compareRef"></div>
            <div class="compare-select-bar" id="compareSelectBar"></div>
            <div class="compare-body" id="compareBody"></div>
        `;
        document.body.appendChild(this.comparePanel);

        // Compare button removed — replaced by video menu in biblia-youversion.js
    }

    injectCompareButton() {
        const menu = document.getElementById('verseActions');
        if (!menu) return;
        const btn = document.createElement('button');
        btn.className = 'verse-action-btn';
        btn.id = 'actionCompare';
        btn.style.color = '#10b981';
        btn.style.fontWeight = '600';
        btn.innerHTML = '<span class="icon">&#9878;</span> Comparar versiones';
        const dividers = menu.querySelectorAll('.verse-action-divider');
        const target = dividers.length >= 2 ? dividers[dividers.length - 1] : null;
        if (target) menu.insertBefore(btn, target);
        else {
            const colors = menu.querySelector('.highlight-colors');
            if (colors) menu.insertBefore(btn, colors);
        }
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Version selector
        this.selectorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdown.classList.toggle('open');
        });

        this.dropdown.addEventListener('click', (e) => {
            const opt = e.target.closest('.version-option');
            if (!opt) return;
            this.switchVersion(opt.dataset.version);
            this.dropdown.classList.remove('open');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.version-dropdown') && !e.target.closest('.version-selector-btn')) {
                this.dropdown.classList.remove('open');
            }
        });

        // Parallel toggle
        this.parallelBtn.addEventListener('click', () => {
            if (this.parallelOpen) this.closeParallel();
            else this.openParallel();
        });

        // Parallel close
        document.getElementById('parallelCloseBtn').addEventListener('click', () => this.closeParallel());

        // Parallel version change
        document.getElementById('parallelVersionSelect').addEventListener('change', (e) => {
            this.parallelVersion = e.target.value;
            localStorage.setItem('biblia_parallel_version', this.parallelVersion);
            this.loadParallelChapter();
        });

        // Sync scroll between main column and parallel column
        let syncing = false;
        const syncScroll = (source, target) => {
            if (!this.parallelOpen || syncing) return;
            syncing = true;
            const ratio = source.scrollTop / (source.scrollHeight - source.clientHeight || 1);
            target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);
            setTimeout(() => syncing = false, 30);
        };

        // Use MutationObserver to attach scroll listeners when parallel opens
        const observer = new MutationObserver(() => {
            if (this.mainCol && this.parallelOpen) {
                const parallelBody = document.getElementById('parallelBody');
                if (!this.mainCol._scrollBound && parallelBody) {
                    this.mainCol._scrollBound = true;
                    this.mainCol.addEventListener('scroll', () => syncScroll(this.mainCol, parallelBody));
                    parallelBody.addEventListener('scroll', () => syncScroll(parallelBody, this.mainCol));
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Compare button in verse menu
        document.getElementById('actionCompare')?.addEventListener('click', () => {
            const app = window.bibliaApp;
            if (!app || !app.selectedVerse) return;
            document.getElementById('verseActions').classList.remove('active');
            this.openCompare(app.selectedVerse);
        });

        document.getElementById('compareClose')?.addEventListener('click', () => {
            this.comparePanel.classList.remove('open');
        });
    }

    // ==========================================
    // HOOK loadChapter — retry until app exists
    // ==========================================
    hookLoadChapter() {
        const self = this;
        const tryHook = () => {
            const app = window.bibliaApp;
            if (!app || !app.loadChapter) {
                setTimeout(tryHook, 300);
                return;
            }
            if (app._loadChapterHooked) return;
            app._loadChapterHooked = true;
            const original = app.loadChapter.bind(app);
            app._originalLoadChapter = original;

            app.loadChapter = function(chapterNum) {
                if (self.isRemote()) {
                    self.loadRemoteChapter(app, chapterNum);
                } else {
                    original(chapterNum);
                }
                if (self.parallelOpen) {
                    setTimeout(() => self.loadParallelChapter(), 200);
                }
            };
        };
        tryHook();
    }

    // ==========================================
    // SWITCH MAIN VERSION
    // ==========================================
    switchVersion(versionId) {
        this.currentVersion = versionId;
        localStorage.setItem('biblia_version', versionId);
        const v = this.versions.find(x => x.id === versionId);
        this.selectorBtn.textContent = v ? v.abbr : versionId;
        // Update header badge (top-right)
        const badge = document.getElementById('headerVersionBadge');
        if (badge) badge.textContent = v ? v.abbr : versionId;
        this.dropdown.querySelectorAll('.version-option').forEach(el => {
            el.classList.toggle('active', el.dataset.version === versionId);
        });

        const app = window.bibliaApp;
        if (!app || !app.currentBook || !app.currentChapter) return;

        if (this.isRemote()) {
            // Directly load remote — don't rely on hook
            this.loadRemoteChapter(app, app.currentChapter);
        } else {
            // RV1960 local — use original loadChapter
            const fn = app._originalLoadChapter || app.loadChapter.bind(app);
            fn(app.currentChapter);
        }

        if (this.parallelOpen) {
            setTimeout(() => this.loadParallelChapter(), 200);
        }
    }

    // ==========================================
    // FETCH FROM API
    // ==========================================
    async fetchVerses(versionId, bookId, chapter) {
        const cacheKey = `${versionId}_${bookId}_${chapter}`;
        if (this.cache[cacheKey]) return this.cache[cacheKey];
        const bookNum = this.getBookNum(bookId);
        if (!bookNum) return [];
        try {
            const res = await fetch(`/api/bible?path=get-text/${versionId}/${bookNum}/${chapter}/`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const verses = data.map(v => ({
                verse: v.verse,
                text: v.text.replace(/<[^>]+>/g, '').trim()
            }));
            this.cache[cacheKey] = verses;
            return verses;
        } catch (err) {
            console.error(`Error fetching ${versionId} ${bookId} ${chapter}:`, err);
            return [];
        }
    }

    // ==========================================
    // LOAD REMOTE CHAPTER (main panel)
    // ==========================================
    async loadRemoteChapter(app, chapterNum) {
        if (!app.currentBook) return;
        const bookId = app.currentBook.id;
        app.currentChapter = chapterNum;

        // Update all UI state
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('chapterContent').style.display = 'block';
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) mobileNav.style.display = '';

        const vAbbr = this.versions.find(v => v.id === this.currentVersion)?.abbr || '';
        document.getElementById('chapterTitle').textContent = `${app.currentBook.name} ${chapterNum} (${vAbbr})`;
        document.getElementById('chapterSubtitle').textContent = 'Cargando...';
        document.getElementById('chapterBtn').textContent = `Cap ${chapterNum}`;

        document.querySelectorAll('.chapter-item').forEach(el => {
            el.classList.toggle('active', parseInt(el.dataset.ch) === chapterNum);
        });
        document.getElementById('prevChapter').disabled = (chapterNum === 1 && BIBLE_BOOKS.findIndex(b => b.id === bookId) === 0);
        document.getElementById('nextChapter').disabled = (chapterNum === app.currentBook.chapters && BIBLE_BOOKS.findIndex(b => b.id === bookId) === BIBLE_BOOKS.length - 1);

        const container = document.getElementById('verseContainer');
        container.innerHTML = '<div style="text-align:center;padding:40px;opacity:0.5;">Cargando...</div>';

        const verses = await this.fetchVerses(this.currentVersion, bookId, chapterNum);
        if (verses.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#f87171;">Error al cargar. Verificá tu conexión.</div>';
            document.getElementById('chapterSubtitle').textContent = 'Error';
            return;
        }

        const chapterData = {};
        verses.forEach(v => { chapterData[v.verse] = v.text; });
        document.getElementById('chapterSubtitle').textContent = `${verses.length} versículos · ${vAbbr}`;

        app.renderVerses(chapterData, bookId, chapterNum);

        container.querySelectorAll('.verse').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('cross-ref') || e.target.classList.contains('concordance-word')) return;
                app.showVerseActions(el, e);
            });
        });

        app.readChapters[`${bookId}_${chapterNum}`] = true;
        app.saveData('biblia_read_chapters', app.readChapters);
        app.updateReadingProgress();
        app.addToHistory(bookId, chapterNum);
        localStorage.setItem('biblia_last_position', JSON.stringify({ book: bookId, chapter: chapterNum }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==========================================
    // PARALLEL MODE
    // ==========================================
    openParallel() {
        this.parallelOpen = true;
        this.parallelBtn.classList.add('active');
        this.parallelBtn.textContent = 'Salir Paralelo';

        // Create wrapper: wrap <main> and parallel container side by side
        const main = document.querySelector('main.main-content');
        if (!main) return;

        // Create flex wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'parallel-wrapper';

        // Wrap main into a column div
        this.mainCol = document.createElement('div');
        this.mainCol.className = 'parallel-main-col';
        main.parentNode.insertBefore(this.wrapper, main);
        this.mainCol.appendChild(main);
        this.wrapper.appendChild(this.mainCol);

        // Add parallel container
        this.parallelContainer.classList.add('open');
        this.wrapper.appendChild(this.parallelContainer);

        this.loadParallelChapter();
    }

    closeParallel() {
        this.parallelOpen = false;
        this.parallelBtn.classList.remove('active');
        this.parallelBtn.textContent = 'Paralelo';
        this.parallelContainer.classList.remove('open');

        // Unwrap: move main back to its original parent
        if (this.wrapper && this.mainCol) {
            const main = this.mainCol.querySelector('main.main-content');
            if (main) {
                this.wrapper.parentNode.insertBefore(main, this.wrapper);
            }
            this.parallelContainer.remove();
            this.wrapper.remove();
            this.wrapper = null;
            this.mainCol = null;
        }
    }

    async loadParallelChapter() {
        const app = window.bibliaApp;
        if (!app || !app.currentBook || !app.currentChapter) return;

        const bookId = app.currentBook.id;
        const chapter = app.currentChapter;
        const vInfo = this.versions.find(v => v.id === this.parallelVersion);
        const vAbbr = vInfo?.abbr || this.parallelVersion;

        document.getElementById('parallelChapterLabel').textContent = `${app.currentBook.name} ${chapter}`;
        const body = document.getElementById('parallelBody');
        body.innerHTML = '<div class="parallel-loading">Cargando...</div>';

        let verses;
        if (this.parallelVersion === 'RV1960') {
            // Get from local
            const key = `${bookId}_${chapter}`;
            const raw = (typeof BIBLE_TEXT !== 'undefined') ? BIBLE_TEXT[key] : null;
            verses = raw && Array.isArray(raw) ? raw.map(v => ({ verse: v.verse, text: v.text })) : [];
        } else {
            verses = await this.fetchVerses(this.parallelVersion, bookId, chapter);
        }

        if (verses.length === 0) {
            body.innerHTML = '<div class="parallel-loading" style="color:#f87171;">No se pudo cargar esta versión.</div>';
            return;
        }

        // Get section titles for this chapter
        const titleKey = `${bookId}_${chapter}`;
        const sectionTitles = (typeof SECTION_TITLES !== 'undefined' && SECTION_TITLES[titleKey]) || [];

        let html = '';
        for (const v of verses) {
            const st = sectionTitles.find(s => s.verse === v.verse);
            if (st) html += `<span class="section-title">${st.title}</span>`;
            html += `<span class="verse" data-verse="${v.verse}"><span class="verse-num">${v.verse}</span>${v.text} </span>`;
        }
        body.innerHTML = html;
    }

    // ==========================================
    // COMPARE (single verse, bottom sheet)
    // ==========================================
    openCompare(selectedVerse) {
        const { bookName, chapter, verse, book } = selectedVerse;
        this.compareVerse = { bookName, chapter, verse, book };
        this.comparePanel.classList.add('open');

        document.getElementById('compareRef').textContent = `${bookName} ${chapter}:${verse}`;

        const bar = document.getElementById('compareSelectBar');
        bar.innerHTML = this.versions.map((v, i) => `
            <label class="compare-check">
                <input type="checkbox" value="${v.id}" ${i < 4 ? 'checked' : ''}>
                <span>${v.abbr}</span>
            </label>
        `).join('');

        const newBar = bar.cloneNode(true);
        bar.parentNode.replaceChild(newBar, bar);
        newBar.addEventListener('change', () => this.runCompare());
        this.runCompare();
    }

    async runCompare() {
        const body = document.getElementById('compareBody');
        const bar = document.getElementById('compareSelectBar');
        const selected = [...bar.querySelectorAll('input:checked')].map(el => el.value);

        if (selected.length === 0) {
            body.innerHTML = '<div class="compare-loading">Seleccioná al menos una versión.</div>';
            return;
        }

        body.innerHTML = '<div class="compare-loading">Cargando...</div>';
        const { book, chapter, verse } = this.compareVerse;

        const promises = selected.map(async (vId) => {
            const vInfo = this.versions.find(v => v.id === vId);
            let text = '';
            if (vId === 'RV1960') {
                const app = window.bibliaApp;
                if (app) text = app.getVerseText(book, chapter, verse);
            } else {
                const verses = await this.fetchVerses(vId, book, chapter);
                const found = verses.find(v => v.verse === verse);
                text = found ? found.text : '(No disponible)';
            }
            return { abbr: vInfo?.abbr || vId, name: vInfo?.name || vId, text };
        });

        const results = await Promise.all(promises);
        body.innerHTML = results.map(r => `
            <div class="compare-card">
                <div class="compare-card-header">${r.abbr} <span class="compare-card-name">${r.name}</span></div>
                <div class="compare-card-text">${r.text}</div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.bibliaVersiones = new BibliaVersiones();
    }, 500);
});
