// ============================================
// BIBLIA VIDEOS - Panel de Videos Curados
// Canales de pastores reformados/expositivos
// Busqueda por tema via YouTube
// ============================================

class BibliaVideos {
    constructor() {
        this.isOpen = false;

        // Canales curados de pastores reformados/expositivos
        this.channels = [
            {
                name: 'Sugel Michelén',
                desc: 'IBSJ, República Dominicana. Predicación expositiva reformada.',
                youtube: 'https://www.youtube.com/@SugelMichelen',
                searchName: 'Sugel Michelén',
                tags: ['reformado', 'expositivo', 'IBSJ', 'dominicana']
            },
            {
                name: 'Miguel Núñez',
                desc: 'IBSJ, República Dominicana. Coalición por el Evangelio.',
                youtube: 'https://www.youtube.com/@PastorMiguelNunez',
                searchName: 'Miguel Núñez pastor',
                tags: ['reformado', 'expositivo', 'IBSJ', 'coalición']
            },
            {
                name: 'Paul Washer',
                desc: 'HeartCry Missionary Society. Predicación en español/subtitulado.',
                youtube: 'https://www.youtube.com/@HeartCryEspanol',
                searchName: 'Paul Washer español',
                tags: ['reformado', 'misionero', 'heartcry']
            },
            {
                name: 'Grace to You (Español)',
                desc: 'John MacArthur. Ministerio de enseñanza bíblica expositiva.',
                youtube: 'https://www.youtube.com/@GracetoYouEspanol',
                searchName: 'John MacArthur español Grace to You',
                tags: ['macarthur', 'expositivo', 'grace']
            },
            {
                name: 'Ligonier (Español)',
                desc: 'R.C. Sproul. Teología reformada y enseñanza bíblica.',
                youtube: 'https://www.youtube.com/@LigonierEspanol',
                searchName: 'R.C. Sproul español Ligonier',
                tags: ['sproul', 'reformado', 'ligonier', 'teología']
            },
            {
                name: 'Fabián Liendo',
                desc: 'Real Ciudadela, Argentina. Pastor y líder de Kyosko.',
                youtube: 'https://www.youtube.com/@FabianLiendoOficial',
                searchName: 'Fabián Liendo predicación',
                tags: ['argentina', 'real ciudadela', 'kyosko']
            },
            {
                name: 'Alberto Lucas',
                desc: 'Real Ciudadela, Argentina. Enseñanza bíblica.',
                youtube: 'https://www.youtube.com/@RealCiudadela',
                searchName: 'Alberto Lucas Real Ciudadela predicación',
                tags: ['argentina', 'real ciudadela']
            },
            {
                name: 'Armando Alducín',
                desc: 'Vida Nueva para el Mundo, México. Enseñanza bíblica.',
                youtube: 'https://www.youtube.com/@ArmandoAlducin',
                searchName: 'Armando Alducín',
                tags: ['méxico', 'profecía', 'enseñanza']
            },
            {
                name: 'Voddie Baucham',
                desc: 'Teología reformada. Materiales en español/subtitulado.',
                youtube: 'https://www.youtube.com/results?search_query=Voddie+Baucham+español+subtitulado',
                searchName: 'Voddie Baucham español',
                tags: ['reformado', 'familia', 'apologética']
            },
            {
                name: 'Steven Lawson',
                desc: 'Predicación expositiva. Libros y conferencias en español.',
                youtube: 'https://www.youtube.com/results?search_query=Steven+Lawson+español+predicación',
                searchName: 'Steven Lawson español',
                tags: ['expositivo', 'reformado', 'conferencias']
            },
            {
                name: 'Héctor Salcedo',
                desc: 'IBSJ, República Dominicana. Equipo pastoral con Sugel y Miguel.',
                youtube: 'https://www.youtube.com/results?search_query=Héctor+Salcedo+IBSJ+predicación',
                searchName: 'Héctor Salcedo IBSJ',
                tags: ['reformado', 'IBSJ', 'dominicana']
            },
            {
                name: 'Soldados de Jesucristo',
                desc: 'Ministerio de recursos reformados. +1.5M seguidores.',
                youtube: 'https://www.youtube.com/@SoldadosDeJesucristo',
                searchName: 'Soldados de Jesucristo',
                tags: ['reformado', 'recursos', 'ministerio']
            },
            {
                name: 'Coalición por el Evangelio',
                desc: 'TGC en español. Conferencias y enseñanza reformada.',
                youtube: 'https://www.youtube.com/@CoalicionEvangelio',
                searchName: 'Coalición por el Evangelio',
                tags: ['coalición', 'TGC', 'conferencias', 'reformado']
            },
            {
                name: '9Marcas (Español)',
                desc: 'Mark Dever. Eclesiología y salud de la iglesia.',
                youtube: 'https://www.youtube.com/results?search_query=9Marcas+español+Mark+Dever',
                searchName: '9Marcas español',
                tags: ['eclesiología', 'iglesia', 'dever']
            },
            {
                name: 'Chuy Olivares',
                desc: 'Calvary Chapel México. Predicación expositiva.',
                youtube: 'https://www.youtube.com/@PastorChuyOlivares',
                searchName: 'Chuy Olivares',
                tags: ['méxico', 'calvary chapel', 'expositivo']
            },
            {
                name: 'Moisés de Paz',
                desc: 'Guatemala. Predicación expositiva reformada.',
                youtube: 'https://www.youtube.com/results?search_query=Moisés+de+Paz+predicación+reformada',
                searchName: 'Moisés de Paz predicación',
                tags: ['guatemala', 'reformado', 'expositivo']
            },
            {
                name: 'David Barceló',
                desc: 'Iglesia Reformada Barcelona, España.',
                youtube: 'https://www.youtube.com/results?search_query=David+Barceló+Iglesia+Reformada+Barcelona',
                searchName: 'David Barceló reformado',
                tags: ['españa', 'barcelona', 'reformado']
            },
            {
                name: 'G3 Ministries (Español)',
                desc: 'Conferencias reformadas en español.',
                youtube: 'https://www.youtube.com/results?search_query=G3+Ministries+español',
                searchName: 'G3 Ministries español',
                tags: ['conferencias', 'reformado', 'ministerio']
            },
            {
                name: 'Albert Mohler',
                desc: 'Southern Seminary. Teología y liderazgo. Subtitulado.',
                youtube: 'https://www.youtube.com/results?search_query=Albert+Mohler+español+subtitulado',
                searchName: 'Albert Mohler español',
                tags: ['teología', 'seminario', 'liderazgo']
            }
        ];

        // Temas de búsqueda rápida
        this.quickTopics = [
            'Gracia', 'Fe', 'Perdón', 'Oración', 'Salvación',
            'Arrepentimiento', 'Santificación', 'Justificación',
            'Soberanía de Dios', 'Trinidad', 'Espíritu Santo',
            'Segunda Venida', 'Vida Eterna', 'Pecado',
            'Amor de Dios', 'Obediencia', 'Familia cristiana',
            'Matrimonio', 'Crianza', 'Iglesia'
        ];

        this.render();
        this.bindEvents();
    }

    // ==========================================
    // RENDER
    // ==========================================
    render() {
        // Video panel overlay (full-page view)
        this.panel = document.createElement('div');
        this.panel.className = 'videos-panel';
        this.panel.innerHTML = `
            <div class="videos-header">
                <div class="videos-title">&#127909; Prédicas y Enseñanzas</div>
                <button class="videos-close" id="videosClose">&#10005;</button>
            </div>

            <div class="videos-body">
                <!-- Search section -->
                <div class="videos-search-section">
                    <div class="videos-search-wrapper">
                        <span class="videos-search-icon">&#128269;</span>
                        <input type="text" class="videos-search-input" id="videosSearchInput"
                               placeholder="Buscar tema, libro o palabra clave...">
                        <button class="videos-search-btn" id="videosSearchBtn">Buscar en YouTube</button>
                    </div>
                    <div class="videos-quick-topics" id="videosQuickTopics"></div>
                </div>

                <!-- Context suggestion (when reading a chapter) -->
                <div class="videos-context" id="videosContext" style="display:none">
                    <div class="videos-context-title">Prédicas relacionadas con lo que estás leyendo</div>
                    <div class="videos-context-links" id="videosContextLinks"></div>
                </div>

                <!-- Channels grid -->
                <div class="videos-section-title">Canales y Pastores</div>
                <div class="videos-channels-grid" id="videosChannelsGrid"></div>
            </div>
        `;
        document.body.appendChild(this.panel);
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Close button
        document.getElementById('videosClose').addEventListener('click', () => this.close());

        // Search
        document.getElementById('videosSearchBtn').addEventListener('click', () => this.searchYouTube());
        document.getElementById('videosSearchInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.searchYouTube();
        });

        // Render channels
        this.renderChannels();

        // Render quick topics
        this.renderQuickTopics();
    }

    // ==========================================
    // CHANNELS GRID
    // ==========================================
    renderChannels() {
        const grid = document.getElementById('videosChannelsGrid');
        let html = '';

        this.channels.forEach((ch, i) => {
            html += `
                <div class="video-channel-card" data-index="${i}">
                    <div class="channel-card-name">${ch.name}</div>
                    <div class="channel-card-desc">${ch.desc}</div>
                    <div class="channel-card-actions">
                        <a href="${ch.youtube}" target="_blank" rel="noopener" class="channel-btn channel-btn-yt">
                            &#9654; Canal
                        </a>
                        <button class="channel-btn channel-btn-search" data-search="${ch.searchName}">
                            &#128269; Buscar prédicas
                        </button>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;

        // Bind search buttons
        grid.querySelectorAll('.channel-btn-search').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.search + ' predicación';
                this.openYouTubeSearch(query);
            });
        });
    }

    // ==========================================
    // QUICK TOPICS
    // ==========================================
    renderQuickTopics() {
        const container = document.getElementById('videosQuickTopics');
        let html = '';
        this.quickTopics.forEach(topic => {
            html += `<button class="quick-topic-btn" data-topic="${topic}">${topic}</button>`;
        });
        container.innerHTML = html;

        container.querySelectorAll('.quick-topic-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('videosSearchInput').value = btn.dataset.topic;
                this.searchYouTube();
            });
        });
    }

    // ==========================================
    // CONTEXT SUGGESTIONS
    // ==========================================
    updateContext() {
        const app = window.bibliaApp;
        const contextDiv = document.getElementById('videosContext');
        const linksDiv = document.getElementById('videosContextLinks');

        if (!app || !app.currentBook) {
            contextDiv.style.display = 'none';
            return;
        }

        const bookName = app.currentBook.name;
        const chapter = app.currentChapter;
        contextDiv.style.display = 'block';

        // Generate contextual search links for top pastors
        const topPastors = ['Sugel Michelén', 'Miguel Núñez', 'Paul Washer español', 'John MacArthur español', 'Armando Alducín'];
        let html = '';

        topPastors.forEach(pastor => {
            const query = `${bookName} ${chapter} ${pastor} predicación`;
            const url = this.buildYouTubeSearchUrl(query);
            const displayName = pastor.replace(' español', '');
            html += `<a href="${url}" target="_blank" rel="noopener" class="context-link">
                &#9654; ${bookName} ${chapter} - ${displayName}
            </a>`;
        });

        // General search for the book/chapter
        const generalQuery = `${bookName} capítulo ${chapter} predicación expositiva`;
        const generalUrl = this.buildYouTubeSearchUrl(generalQuery);
        html += `<a href="${generalUrl}" target="_blank" rel="noopener" class="context-link context-link-general">
            &#128269; Buscar todas las prédicas sobre ${bookName} ${chapter}
        </a>`;

        linksDiv.innerHTML = html;
    }

    // ==========================================
    // YOUTUBE SEARCH
    // ==========================================
    buildYouTubeSearchUrl(query) {
        return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    }

    searchYouTube() {
        const input = document.getElementById('videosSearchInput');
        const query = input.value.trim();
        if (!query) return;

        const fullQuery = query + ' predicación bíblica reformada';
        this.openYouTubeSearch(fullQuery);
    }

    openYouTubeSearch(query) {
        const url = this.buildYouTubeSearchUrl(query);
        window.open(url, '_blank', 'noopener');
    }

    // ==========================================
    // OPEN / CLOSE
    // ==========================================
    open() {
        this.isOpen = true;
        this.panel.classList.add('active');
        document.getElementById('overlay').classList.add('active');
        this.updateContext();

        // Highlight toolbar button
        const btn = document.getElementById('toggleVideos');
        if (btn) btn.classList.add('active');
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('active');
        document.getElementById('overlay').classList.remove('active');

        const btn = document.getElementById('toggleVideos');
        if (btn) btn.classList.remove('active');
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    // ==========================================
    // GET SUGGESTION FOR BOT
    // ==========================================
    getVideoSuggestion(bookName, chapter, topic) {
        // Returns a formatted suggestion string for the bot
        const suggestions = [];

        // Pick 2-3 relevant pastors
        const pastors = ['Sugel Michelén', 'Miguel Núñez', 'Armando Alducín'];
        pastors.forEach(p => {
            const query = topic
                ? `${p} ${topic} predicación`
                : `${p} ${bookName} ${chapter} predicación`;
            suggestions.push({
                pastor: p,
                url: this.buildYouTubeSearchUrl(query)
            });
        });

        return suggestions;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bibliaVideos = new BibliaVideos();
});
