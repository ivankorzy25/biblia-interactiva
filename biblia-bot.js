// ============================================
// BIBLIA BOT - OpenClaw Chat Widget
// Asistente biblico con voz, adjuntos y IA
// ============================================

class BibliaBot {
    constructor() {
        this.API_URL = '/v1/chat/completions';
        this.TOKEN = 'a981079aa9900cdacdd68a89da4370db0faf6e729584fdd520cac2e643f24701';
        this.isOpen = false;
        this.isStreaming = false;
        this.messages = [];
        this.attachments = [];
        this.recognition = null;
        this.isRecording = false;
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.dragCounter = 0;
        this.ttsRate = parseFloat(localStorage.getItem('biblia_tts_rate') || '0.95');
        this.ttsVoice = null;
        this.voicesReady = false;
        this.initVoices();

        this.systemPrompt = this.buildSystemPrompt();
        this.render();
        this.bindEvents();
        this.addWelcome();
    }

    // ==========================================
    // SYSTEM PROMPT
    // ==========================================
    buildSystemPrompt() {
        return `Eres el Asistente B\u00edblico de la Biblia Interactiva RV1960. Tu nombre es Biblia Bot.

PERSONALIDAD:
- Eres un narrador c\u00e1lido, sabio y apasionado, como un abuelo que cuenta historias al lado del fuego.
- Respond\u00e9s SOLO en espa\u00f1ol con ortograf\u00eda perfecta, incluyendo todos los acentos y tildes correctos.
- NUNCA uses palabras en hebreo, griego, arameo ni ning\u00fan otro idioma. Si necesit\u00e1s mencionar un t\u00e9rmino original, traducilo al espa\u00f1ol y explic\u00e1 su significado.
- Tono conversacional latino, cercano y respetuoso.

ORTOGRAF\u00cdA - CR\u00cdTICO:
- SIEMPRE us\u00e1 acentos y tildes correctos en todas las palabras que lo requieran.
- Ejemplos obligatorios: imagin\u00e1, acci\u00f3n, Jerusal\u00e9n, Babilonia, dif\u00edciles, a\u00f1o, direcci\u00f3n, coraz\u00f3n, esp\u00edritu, perd\u00f3n, oraci\u00f3n, bendici\u00f3n, salvaci\u00f3n, tambi\u00e9n, despu\u00e9s, as\u00ed, m\u00e1s, \u00e9l, est\u00e1, ser\u00e1, har\u00e1.
- Revis\u00e1 cada palabra antes de escribirla. La ortograf\u00eda perfecta es innegociable.

ESTILO DE ESCRITURA - MUY IMPORTANTE:
- Escrib\u00ed como si estuvieras contando una historia fascinante, como un cuento o una aventura \u00e9pica.
- Us\u00e1 frases narrativas que atrapen al oyente y lo transporten a la escena.
- Dale vida a los personajes describiendo emociones, paisajes, tensiones y momentos dram\u00e1ticos.
- Us\u00e1 pausas naturales con comas y puntos para dar ritmo a la lectura.
- NUNCA uses emojis, s\u00edmbolos decorativos, asteriscos ni caracteres especiales.
- NUNCA uses comillas de ning\u00fan tipo. Integr\u00e1 las citas directamente en la narraci\u00f3n.
- NUNCA uses guiones largos ni rayas. Us\u00e1 comas o puntos en su lugar.
- NUNCA uses par\u00e9ntesis. Integr\u00e1 la informaci\u00f3n en la oraci\u00f3n.
- NUNCA uses listas con guiones ni vi\u00f1etas. Escrib\u00ed todo en p\u00e1rrafos narrativos fluidos.
- NUNCA uses formato markdown como asteriscos, numerales ni s\u00edmbolos de encabezado.
- Escrib\u00ed los n\u00fameros de vers\u00edculos con palabras de forma natural.
- Separ\u00e1 las ideas en p\u00e1rrafos cortos de dos o tres oraciones para que la lectura respire.

PARA CITAS B\u00cdBLICAS:
- Integr\u00e1 la cita en la narraci\u00f3n de forma natural, sin comillas.
- En vez de citar formalmente, decilo as\u00ed, por ejemplo: En el evangelio de Juan, cap\u00edtulo tres, vers\u00edculo diecis\u00e9is, encontramos estas palabras poderosas. Porque de tal manera am\u00f3 Dios al mundo, que ha dado a su Hijo unig\u00e9nito, para que todo aquel que en \u00e9l cree no se pierda, mas tenga vida eterna.
- Siempre cit\u00e1 el texto completo del vers\u00edculo integrado en la narraci\u00f3n.

CONTEXTO:
- El usuario est\u00e1 usando la Biblia Interactiva RV1960 en su navegador.
- Tus respuestas van a ser le\u00eddas en voz alta por un sintetizador de voz, as\u00ed que escrib\u00ed pensando en c\u00f3mo suena, no en c\u00f3mo se ve.
- Evit\u00e1 abreviaturas. Escrib\u00ed las palabras completas siempre.

REGLAS ABSOLUTAS:
- Solo espa\u00f1ol con ortograf\u00eda perfecta incluyendo acentos y tildes.
- Cero emojis, cero s\u00edmbolos, cero markdown, cero comillas.
- Cero listas con guiones o n\u00fameros.
- Todo en prosa narrativa fluida y envolvente.
- No inventes vers\u00edculos. Si no record\u00e1s exactamente, indicalo con naturalidad.

SUGERENCIAS DE VIDEOS:
- Cuando el usuario pida profundizar en un tema, libro o pasaje, suger\u00ed que mire pr\u00e9dicas de pastores reformados como Sugel Michel\u00e9n, Miguel N\u00fa\u00f1ez, Paul Washer, John MacArthur, R.C. Sproul, Armando Alduc\u00edn, Fabi\u00e1n Liendo o Alberto Lucas.
- Integr\u00e1 la sugerencia naturalmente en tu respuesta, por ejemplo: Si quer\u00e9s profundizar en este pasaje, te recomiendo buscar las pr\u00e9dicas de Sugel Michel\u00e9n sobre Romanos, o las ense\u00f1anzas de John MacArthur en Grace to You en espa\u00f1ol.
- Tambi\u00e9n pod\u00e9s mencionar que la app tiene un panel de Videos donde pueden buscar pr\u00e9dicas por tema.
- No sugieras videos en cada respuesta, solo cuando sea relevante y natural hacerlo.

CALENDARIO:
- La app tiene un calendario integrado donde el usuario puede agendar eventos de iglesia, estudios b\u00edblicos, prédicas, reuniones y m\u00e1s.
- Si el usuario menciona que tiene que ir a la iglesia, ver un video, reunirse con alguien o cualquier actividad, pod\u00e9s sugerirle que lo agende en el calendario de la app.
- Pod\u00e9s mencionar que el calendario acepta ubicaciones con Google Maps, enlaces URL, fotos, audio, video y notas.
- No sugieras el calendario en cada respuesta, solo cuando surja naturalmente.`;
    }

    // ==========================================
    // GET BIBLE CONTEXT
    // ==========================================
    getBibleContext() {
        let context = '';
        const app = window.bibliaApp;
        if (app && app.currentBook) {
            const bookName = app.currentBook.name || app.currentBook.id || app.currentBook;
            context += `\n[El usuario esta leyendo: ${bookName} capitulo ${app.currentChapter}]`;
        }
        // Include upcoming calendar events
        const cal = window.bibliaCalendar;
        if (cal) {
            const upcoming = cal.getUpcomingForBot(7);
            if (upcoming) {
                context += `\n[Pr\u00f3ximos eventos en el calendario del usuario:\n${upcoming}]`;
            }
        }
        return context;
    }

    // ==========================================
    // RENDER
    // ==========================================
    render() {
        // Toggle button
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'bot-toggle';
        this.toggleBtn.innerHTML = '\u{1F4D6}';
        this.toggleBtn.title = 'Asistente Biblico';

        // Panel
        this.panel = document.createElement('div');
        this.panel.className = 'bot-panel';
        this.panel.innerHTML = `
            <div class="bot-resize" id="botResize"></div>
            <div class="bot-header" id="botHeader">
                <div class="bot-avatar">\u{1F4D6}</div>
                <div class="bot-header-info">
                    <div class="bot-header-name">Biblia Bot</div>
                    <div class="bot-header-status">Conectado \u00B7 IA + Ollama</div>
                </div>
                <div class="bot-header-btns">
                    <button class="bot-header-btn" id="botSettingsToggle" title="Configurar voz">&#9881;</button>
                    <button class="bot-header-btn" id="botMaximize" title="Maximizar">\u26F6</button>
                    <button class="bot-header-btn bot-close" title="Cerrar">\u00D7</button>
                </div>
            </div>
            <div class="bot-nowplaying" id="botNowPlaying">
                <span class="bot-nowplaying-label">Reproduciendo</span>
                <div class="bot-nowplaying-dots"><span></span><span></span><span></span></div>
                <button class="bot-nowplaying-btn" id="npPause" title="Pausar">\u23F8</button>
                <button class="bot-nowplaying-btn bot-np-stop" id="npStop" title="Detener">\u25A0</button>
            </div>
            <div class="bot-actions">
                <button class="bot-action-btn" data-action="versiculo">&#128220; Versiculo del dia</button>
                <button class="bot-action-btn" data-action="explicar">&#128161; Explicar pasaje</button>
                <button class="bot-action-btn" data-action="buscar-tema">&#128270; Buscar por tema</button>
                <button class="bot-action-btn" data-action="devocional">&#128591; Devocional</button>
                <button class="bot-action-btn" data-action="plan">&#128197; Plan de lectura</button>
                <button class="bot-action-btn" data-action="personaje">&#128100; Personajes</button>
                <button class="bot-action-btn" data-action="oracion">&#128588; Oracion</button>
                <button class="bot-action-btn" data-action="quiz">&#127919; Quiz biblico</button>
            </div>
            <div class="bot-tts-settings" id="botTtsSettings">
                <div class="bot-tts-settings-row">
                    <label class="bot-tts-label">Voz:</label>
                    <select class="bot-tts-voice-select" id="botVoiceSelect"></select>
                </div>
                <div class="bot-tts-settings-row">
                    <label class="bot-tts-label">Velocidad:</label>
                    <input type="range" class="bot-tts-speed-global" id="botSpeedGlobal" min="0.5" max="1.8" step="0.05" value="${this.ttsRate}">
                    <span class="bot-tts-speed-label" id="botSpeedLabel">${this.ttsRate}x</span>
                </div>
            </div>
            <div class="bot-messages" id="botMessages"></div>
            <div class="bot-dropzone" id="botDropzone">
                <span class="bot-dropzone-icon">&#128206;</span>
                <span>Suelta tu archivo aqui</span>
            </div>
            <div class="bot-input-area">
                <div class="bot-input-attachments" id="botAttachments"></div>
                <div class="bot-input-row">
                    <button class="bot-input-btn bot-btn-attach" id="botAttachBtn" title="Adjuntar archivo">&#128206;</button>
                    <textarea class="bot-input" id="botInput" placeholder="Pregunta sobre la Biblia..." rows="1"></textarea>
                    <button class="bot-input-btn bot-btn-mic" id="botMicBtn" title="Hablar">&#127908;</button>
                    <button class="bot-input-btn bot-btn-send" id="botSendBtn" title="Enviar">&#10148;</button>
                </div>
            </div>
            <input type="file" id="botFileInput" multiple hidden accept="image/*,.pdf,.txt,.doc,.docx">
        `;

        // Karaoke panel
        this.karaokePanel = document.createElement('div');
        this.karaokePanel.className = 'bot-karaoke';
        this.karaokePanel.innerHTML = `
            <div class="bot-karaoke-header">
                <span class="bot-karaoke-title">\u{1F3A4} Lectura en voz alta</span>
                <div class="bot-karaoke-controls">
                    <button class="bot-karaoke-btn" id="karaokePause" title="Pausar">\u23F8</button>
                    <button class="bot-karaoke-btn" id="karaokeClose" title="Cerrar">\u00D7</button>
                </div>
            </div>
            <div class="bot-karaoke-body" id="karaokeBody"></div>
            <div class="bot-karaoke-progress"><div class="bot-karaoke-progress-fill" id="karaokeProgress"></div></div>
        `;

        document.body.appendChild(this.toggleBtn);
        document.body.appendChild(this.panel);
        document.body.appendChild(this.karaokePanel);

        // Cache elements
        this.karaokeBody = this.karaokePanel.querySelector('#karaokeBody');
        this.karaokeProgressEl = this.karaokePanel.querySelector('#karaokeProgress');
        this.karaokePauseBtn = this.karaokePanel.querySelector('#karaokePause');
        this.karaokeCloseBtn = this.karaokePanel.querySelector('#karaokeClose');
        this.messagesEl = this.panel.querySelector('#botMessages');
        this.inputEl = this.panel.querySelector('#botInput');
        this.sendBtn = this.panel.querySelector('#botSendBtn');
        this.micBtn = this.panel.querySelector('#botMicBtn');
        this.attachBtn = this.panel.querySelector('#botAttachBtn');
        this.fileInput = this.panel.querySelector('#botFileInput');
        this.attachmentsEl = this.panel.querySelector('#botAttachments');
        this.dropzone = this.panel.querySelector('#botDropzone');
        this.closeBtn = this.panel.querySelector('.bot-close');
        this.headerEl = this.panel.querySelector('#botHeader');
        this.maximizeBtn = this.panel.querySelector('#botMaximize');
        this.resizeEl = this.panel.querySelector('#botResize');
        this.settingsToggle = this.panel.querySelector('#botSettingsToggle');
        this.ttsSettingsEl = this.panel.querySelector('#botTtsSettings');
        this.voiceSelectEl = this.panel.querySelector('#botVoiceSelect');
        this.speedGlobalEl = this.panel.querySelector('#botSpeedGlobal');
        this.speedLabelEl = this.panel.querySelector('#botSpeedLabel');
        this.nowPlayingEl = this.panel.querySelector('#botNowPlaying');
        this.npPauseBtn = this.panel.querySelector('#npPause');
        this.npStopBtn = this.panel.querySelector('#npStop');
        this.isMaximized = false;
        this.settingsOpen = false;
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Toggle
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.toggle());

        // Send
        this.sendBtn.addEventListener('click', () => this.send());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.send();
            }
        });

        // Auto-resize input
        this.inputEl.addEventListener('input', () => {
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 100) + 'px';
        });

        // Quick actions
        this.panel.querySelectorAll('.bot-action-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
        });

        // Mic
        this.micBtn.addEventListener('click', () => this.toggleMic());

        // Attach
        this.attachBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag & drop
        this.panel.addEventListener('dragenter', (e) => {
            e.preventDefault();
            this.dragCounter++;
            this.dropzone.classList.add('active');
        });
        this.panel.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dragCounter--;
            if (this.dragCounter === 0) this.dropzone.classList.remove('active');
        });
        this.panel.addEventListener('dragover', (e) => e.preventDefault());
        this.panel.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dragCounter = 0;
            this.dropzone.classList.remove('active');
            if (e.dataTransfer.files.length) this.handleFiles(e.dataTransfer.files);
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.toggle();
        });

        // Maximize
        this.maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMaximize();
        });
        // Double-click header to maximize
        this.headerEl.addEventListener('dblclick', (e) => {
            if (!e.target.closest('button')) this.toggleMaximize();
        });

        // Settings toggle
        this.settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.settingsOpen = !this.settingsOpen;
            this.ttsSettingsEl.classList.toggle('open', this.settingsOpen);
            this.settingsToggle.classList.toggle('active', this.settingsOpen);
        });

        // Global speed slider - applies in real time
        this.speedGlobalEl.addEventListener('input', () => {
            this.ttsRate = parseFloat(this.speedGlobalEl.value);
            this.speedLabelEl.textContent = this.ttsRate.toFixed(2) + 'x';
            localStorage.setItem('biblia_tts_rate', this.ttsRate.toString());
        });

        // Voice select
        this.voiceSelectEl.addEventListener('change', () => {
            const voices = this.synth.getVoices();
            const selected = voices.find(v => v.voiceURI === this.voiceSelectEl.value);
            if (selected) {
                this.ttsVoice = selected;
                localStorage.setItem('biblia_tts_voice', selected.voiceURI);
            }
        });

        // Now Playing bar (fixed in header)
        this.npPauseBtn.addEventListener('click', () => {
            if (this.synth.paused) {
                this.synth.resume();
                this.npPauseBtn.innerHTML = '\u23F8';
                this.npPauseBtn.title = 'Pausar';
            } else {
                this.synth.pause();
                this.npPauseBtn.innerHTML = '\u25B6';
                this.npPauseBtn.title = 'Continuar';
            }
        });
        this.npStopBtn.addEventListener('click', () => {
            this.stopSpeech();
        });

        // Karaoke controls
        this.karaokeCloseBtn.addEventListener('click', () => {
            this.stopSpeech();
            this.closeKaraoke();
        });
        this.karaokePauseBtn.addEventListener('click', () => {
            if (this.synth.paused) {
                this.synth.resume();
                this.karaokePauseBtn.innerHTML = '\u23F8';
                this.karaokePauseBtn.title = 'Pausar';
            } else {
                this.synth.pause();
                this.karaokePauseBtn.innerHTML = '\u25B6';
                this.karaokePauseBtn.title = 'Continuar';
            }
        });

        // Drag to move (on header)
        this.setupDrag();

        // Resize (on corner handle)
        this.setupResize();

        // "Explicar con IA" button in verse action menu
        const explainBtn = document.getElementById('actionExplainAI');
        if (explainBtn) {
            explainBtn.addEventListener('click', () => {
                const app = window.bibliaApp;
                if (!app || !app.selectedVerse) return;
                const { bookName, chapter, verse, book } = app.selectedVerse;
                const verseText = app.getVerseText(book, chapter, verse);
                // Close verse menu
                document.getElementById('verseActions').classList.remove('active');
                // Open bot and send
                this.explainVerse(bookName, chapter, verse, verseText);
            });
        }
    }

    // ==========================================
    // EXPLAIN VERSE (called from verse menu)
    // ==========================================
    explainVerse(bookName, chapter, verse, verseText) {
        if (!this.isOpen) this.toggle();
        const prompt = `Explicame este versiculo en detalle:\n\n**${bookName} ${chapter}:${verse}** "${verseText}"\n\nIncluye: contexto historico, significado en el original, aplicacion practica y versiculos relacionados.`;
        this.inputEl.value = prompt;
        setTimeout(() => this.send(), 400);
    }

    // ==========================================
    // TOGGLE
    // ==========================================
    toggle() {
        this.isOpen = !this.isOpen;
        this.panel.classList.toggle('open', this.isOpen);
        this.toggleBtn.classList.toggle('active', this.isOpen);
        this.toggleBtn.innerHTML = this.isOpen ? '\u2715' : '\u{1F4D6}';
        if (this.isOpen) {
            setTimeout(() => this.inputEl.focus(), 350);
        }
        if (!this.isOpen && this.isMaximized) {
            this.toggleMaximize();
        }
    }

    // ==========================================
    // MAXIMIZE
    // ==========================================
    toggleMaximize() {
        this.isMaximized = !this.isMaximized;
        this.panel.classList.toggle('maximized', this.isMaximized);
        this.maximizeBtn.innerHTML = this.isMaximized ? '\u2750' : '\u26F6';
        this.maximizeBtn.title = this.isMaximized ? 'Restaurar' : 'Maximizar';
        if (this.isMaximized) {
            this._prevStyle = {
                top: this.panel.style.top,
                left: this.panel.style.left,
                width: this.panel.style.width,
                height: this.panel.style.height,
                right: this.panel.style.right,
                bottom: this.panel.style.bottom
            };
        } else if (this._prevStyle) {
            Object.assign(this.panel.style, this._prevStyle);
        }
    }

    // ==========================================
    // DRAG TO MOVE
    // ==========================================
    setupDrag() {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const onMouseDown = (e) => {
            // Don't drag from buttons
            if (e.target.closest('button')) return;
            if (this.isMaximized) return;
            isDragging = true;
            this.panel.classList.add('dragging');

            const rect = this.panel.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;

            // Switch to top/left positioning
            this.panel.style.right = 'auto';
            this.panel.style.bottom = 'auto';
            this.panel.style.left = rect.left + 'px';
            this.panel.style.top = rect.top + 'px';

            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            // Clamp to viewport
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 100));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50));
            this.panel.style.left = newLeft + 'px';
            this.panel.style.top = newTop + 'px';
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            this.panel.classList.remove('dragging');
        };

        this.headerEl.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Touch support
        this.headerEl.addEventListener('touchstart', (e) => {
            if (e.target.closest('button')) return;
            onMouseDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, preventDefault: () => e.preventDefault() });
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) onMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
        }, { passive: true });
        document.addEventListener('touchend', onMouseUp);
    }

    // ==========================================
    // RESIZE
    // ==========================================
    setupResize() {
        let isResizing = false;
        let startX, startY, startW, startH, startLeft, startTop;

        const onMouseDown = (e) => {
            if (this.isMaximized) return;
            isResizing = true;
            this.panel.classList.add('resizing');
            const rect = this.panel.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startW = rect.width;
            startH = rect.height;
            startLeft = rect.left;
            startTop = rect.top;

            // Switch to top/left + explicit size
            this.panel.style.right = 'auto';
            this.panel.style.bottom = 'auto';
            this.panel.style.left = rect.left + 'px';
            this.panel.style.top = rect.top + 'px';
            this.panel.style.width = rect.width + 'px';
            this.panel.style.height = rect.height + 'px';

            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isResizing) return;
            // Drag top-left corner: width/height grow opposite
            const dx = startX - e.clientX;
            const dy = startY - e.clientY;
            const newW = Math.max(300, startW + dx);
            const newH = Math.max(350, startH + dy);
            const newLeft = startLeft - (newW - startW);
            const newTop = startTop - (newH - startH);
            this.panel.style.width = newW + 'px';
            this.panel.style.height = newH + 'px';
            this.panel.style.left = Math.max(0, newLeft) + 'px';
            this.panel.style.top = Math.max(0, newTop) + 'px';
        };

        const onMouseUp = () => {
            if (!isResizing) return;
            isResizing = false;
            this.panel.classList.remove('resizing');
        };

        this.resizeEl.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Touch
        this.resizeEl.addEventListener('touchstart', (e) => {
            onMouseDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, preventDefault: () => e.preventDefault() });
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (isResizing) onMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
        }, { passive: true });
        document.addEventListener('touchend', onMouseUp);
    }

    // ==========================================
    // WELCOME MESSAGE
    // ==========================================
    addWelcome() {
        this.addMessage('assistant', `**Shalom!** Soy tu Asistente Biblico \u{1F4D6}\n\nPuedo ayudarte con:\n- \u{1F50D} Buscar y explicar versiculos\n- \u{1F4AC} Reflexiones y devocionales\n- \u{1F3AF} Quiz biblico interactivo\n- \u{1F399}\uFE0F Escucharme leer en voz alta\n- \u{1F4CE} Analizar imagenes/archivos\n\n\u00BFEn que puedo ayudarte hoy?`);
    }

    // ==========================================
    // QUICK ACTIONS
    // ==========================================
    handleAction(action) {
        const ctx = this.getBibleContext();
        const prompts = {
            'versiculo': 'Dame un versiculo inspirador para hoy con una breve reflexion.',
            'explicar': ctx
                ? `Explicame el contexto historico, significado y aplicacion practica del capitulo que estoy leyendo.${ctx}`
                : 'Explicame un pasaje importante de la Biblia con su contexto historico y aplicacion practica.',
            'buscar-tema': 'Dame 5 versiculos sobre esperanza y fe con una breve explicacion de cada uno.',
            'devocional': `Hazme un devocional corto para hoy con un versiculo, reflexion y oracion.${ctx}`,
            'plan': 'Sugerime un plan de lectura biblica de 7 dias para conocer mejor a Dios.',
            'personaje': 'Cuentame sobre un personaje biblico importante: su historia, lecciones y versiculos clave.',
            'oracion': `Guiame en una oracion basada en la Escritura.${ctx}`,
            'quiz': 'Hazme un quiz biblico con 3 preguntas de opcion multiple. Espera mi respuesta antes de dar las respuestas correctas.'
        };
        this.inputEl.value = prompts[action] || '';
        this.send();
    }

    // ==========================================
    // SPEECH TO TEXT
    // ==========================================
    toggleMic() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.addMessage('system', 'Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'es-ES';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.micBtn.classList.add('recording');
            this.inputEl.placeholder = 'Escuchando...';
        };

        this.recognition.onresult = (e) => {
            let transcript = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                transcript += e.results[i][0].transcript;
            }
            this.inputEl.value = transcript;
            this.inputEl.dispatchEvent(new Event('input'));
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            this.micBtn.classList.remove('recording');
            this.inputEl.placeholder = 'Pregunta sobre la Biblia...';
            // Auto-send if there's text
            if (this.inputEl.value.trim()) {
                this.send();
            }
        };

        this.recognition.onerror = (e) => {
            this.isRecording = false;
            this.micBtn.classList.remove('recording');
            this.inputEl.placeholder = 'Pregunta sobre la Biblia...';
            if (e.error !== 'aborted') {
                this.addMessage('system', 'Error de microfono: ' + e.error);
            }
        };

        this.recognition.start();
    }

    // ==========================================
    // TEXT TO SPEECH
    // ==========================================
    initVoices() {
        const savedVoiceURI = localStorage.getItem('biblia_tts_voice');

        const pickVoice = () => {
            const voices = this.synth.getVoices();
            if (!voices.length) return;
            this.voicesReady = true;

            // Filter Spanish voices for the selector
            const esVoices = voices.filter(v => v.lang.startsWith('es'));
            const otherVoices = voices.filter(v => !v.lang.startsWith('es'));

            // Populate voice select
            if (this.voiceSelectEl) {
                this.voiceSelectEl.innerHTML = '';
                if (esVoices.length) {
                    const grpEs = document.createElement('optgroup');
                    grpEs.label = 'Espanol';
                    esVoices.forEach(v => {
                        const opt = document.createElement('option');
                        opt.value = v.voiceURI;
                        const region = v.lang.replace('es-', '');
                        const tag = region === 'AR' ? 'Argentina' : region === 'MX' ? 'Mexico' : region === 'US' ? 'Latino US' : region === 'ES' ? 'Espana' : region === 'CO' ? 'Colombia' : region === 'CL' ? 'Chile' : region;
                        opt.textContent = `${v.name} (${tag})`;
                        grpEs.appendChild(opt);
                    });
                    this.voiceSelectEl.appendChild(grpEs);
                }
                if (otherVoices.length) {
                    const grpOther = document.createElement('optgroup');
                    grpOther.label = 'Otros idiomas';
                    otherVoices.slice(0, 15).forEach(v => {
                        const opt = document.createElement('option');
                        opt.value = v.voiceURI;
                        opt.textContent = `${v.name} (${v.lang})`;
                        grpOther.appendChild(opt);
                    });
                    this.voiceSelectEl.appendChild(grpOther);
                }
            }

            // Restore saved voice or auto-pick
            if (savedVoiceURI) {
                const saved = voices.find(v => v.voiceURI === savedVoiceURI);
                if (saved) {
                    this.ttsVoice = saved;
                    if (this.voiceSelectEl) this.voiceSelectEl.value = saved.voiceURI;
                    return;
                }
            }

            // Auto-pick priority: Argentine > Latin American > Spain
            this.ttsVoice =
                esVoices.find(v => v.lang === 'es-AR') ||
                esVoices.find(v => v.lang === 'es-MX' && /google|microsoft|natural/i.test(v.name)) ||
                esVoices.find(v => v.lang === 'es-MX') ||
                esVoices.find(v => v.lang === 'es-US') ||
                esVoices.find(v => v.lang.startsWith('es-') && v.lang !== 'es-ES') ||
                esVoices.find(v => v.lang === 'es-ES' && /google|microsoft|natural/i.test(v.name)) ||
                esVoices.find(v => v.lang === 'es-ES') ||
                esVoices[0] || voices[0];

            if (this.ttsVoice && this.voiceSelectEl) {
                this.voiceSelectEl.value = this.ttsVoice.voiceURI;
            }
        };
        pickVoice();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = pickVoice;
        }
    }

    appendTtsBar(container, text) {
        const ttsBar = document.createElement('div');
        ttsBar.className = 'bot-tts-bar';
        ttsBar.innerHTML = '<button class="bot-tts-btn bot-tts-play" title="Leer en voz alta">\u25B6</button>'
            + '<button class="bot-tts-btn bot-tts-pause" title="Pausar" style="display:none">\u23F8</button>'
            + '<button class="bot-tts-btn bot-tts-stop" title="Detener" style="display:none">\u25A0</button>';
        const playBtn = ttsBar.querySelector('.bot-tts-play');
        const pauseBtn = ttsBar.querySelector('.bot-tts-pause');
        const stopBtn = ttsBar.querySelector('.bot-tts-stop');

        playBtn.addEventListener('click', () => {
            if (this.synth.paused) {
                this.synth.resume();
                playBtn.style.display = 'none';
                pauseBtn.style.display = '';
            } else {
                this.stopSpeech();
                this.activeTtsBar = ttsBar;
                playBtn.style.display = 'none';
                pauseBtn.style.display = '';
                stopBtn.style.display = '';
                ttsBar.classList.add('active');
                this.speak(text);
            }
        });
        pauseBtn.addEventListener('click', () => {
            this.synth.pause();
            pauseBtn.style.display = 'none';
            playBtn.style.display = '';
            playBtn.title = 'Continuar';
        });
        stopBtn.addEventListener('click', () => {
            this.stopSpeech();
        });
        container.appendChild(ttsBar);
    }

    stopSpeech() {
        this.synth.cancel();
        this.currentUtterance = null;
        this.resetTtsBar();
        this.hideNowPlaying();
        this.closeKaraoke();
        // Restore ambient volume
        if (window.bibliaAmbient) window.bibliaAmbient.restoreAfterSpeech();
    }

    resetTtsBar() {
        if (this.activeTtsBar) {
            this.activeTtsBar.classList.remove('active');
            const play = this.activeTtsBar.querySelector('.bot-tts-play');
            const pause = this.activeTtsBar.querySelector('.bot-tts-pause');
            const stop = this.activeTtsBar.querySelector('.bot-tts-stop');
            if (play) { play.style.display = ''; play.innerHTML = '\u25B6'; play.title = 'Leer en voz alta'; }
            if (pause) pause.style.display = 'none';
            if (stop) stop.style.display = 'none';
            this.activeTtsBar = null;
        }
    }

    openKaraoke(chunks) {
        this.karaokePanel.classList.add('open');
        this.karaokePauseBtn.innerHTML = '\u23F8';
        this.karaokePauseBtn.title = 'Pausar';
        // Render all chunks as spans
        this.karaokeBody.innerHTML = chunks.map((chunk, i) =>
            `<span class="karaoke-chunk" data-idx="${i}">${chunk.replace(/</g, '&lt;').replace(/>/g, '&gt;')} </span>`
        ).join('');
        this.karaokeProgressEl.style.width = '0%';
    }

    closeKaraoke() {
        this.karaokePanel.classList.remove('open');
    }

    highlightKaraokeChunk(index, total) {
        // Remove previous highlights
        this.karaokeBody.querySelectorAll('.karaoke-chunk').forEach(el => {
            const idx = parseInt(el.dataset.idx);
            el.classList.toggle('past', idx < index);
            el.classList.toggle('active', idx === index);
            el.classList.remove('future');
            if (idx > index) el.classList.add('future');
        });
        // Scroll active into view
        const active = this.karaokeBody.querySelector('.karaoke-chunk.active');
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Update progress bar
        this.karaokeProgressEl.style.width = ((index + 1) / total * 100) + '%';
    }

    showNowPlaying() {
        this.nowPlayingEl.classList.add('active');
        this.npPauseBtn.innerHTML = '\u23F8';
        this.npPauseBtn.title = 'Pausar';
    }

    hideNowPlaying() {
        this.nowPlayingEl.classList.remove('active');
    }

    speak(text) {
        const clean = this.cleanForSpeech(text);
        if (!clean.trim()) return;

        const chunks = this.splitTextForSpeech(clean);
        this.showNowPlaying();
        this.openKaraoke(chunks);

        // Auto-play ambient music and fade for speech
        if (window.bibliaAmbient) {
            window.bibliaAmbient.autoPlay(text);
            window.bibliaAmbient.fadeForSpeech();
        }

        this.speakChunks(chunks);
    }

    cleanForSpeech(text) {
        return text
            // Remove code blocks
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]+`/g, '')
            // Remove all markdown formatting
            .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/^#{1,6}\s+/gm, '')
            .replace(/^>\s+/gm, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Remove URLs
            .replace(/https?:\/\/\S+/g, '')
            // Remove ALL emojis (comprehensive Unicode ranges)
            .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
            .replace(/[\u{2600}-\u{27BF}]/gu, '')
            .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
            .replace(/[\u{200D}]/gu, '')
            .replace(/[\u{20E3}]/gu, '')
            .replace(/[\u{E0020}-\u{E007F}]/gu, '')
            // Remove non-Latin scripts (Hebrew, Greek, Aramaic, Arabic)
            .replace(/[\u{0590}-\u{05FF}]/gu, '')  // Hebrew
            .replace(/[\u{0600}-\u{06FF}]/gu, '')  // Arabic
            .replace(/[\u{0370}-\u{03FF}]/gu, '')  // Greek
            .replace(/[\u{10900}-\u{1091F}]/gu, '') // Phoenician
            .replace(/[\u{10840}-\u{1085F}]/gu, '') // Aramaic
            // Remove all types of quotes and dashes
            .replace(/[""''«»「」『』‹›]/g, '')
            .replace(/["']/g, '')
            .replace(/[—–\u2013\u2014\u2015]/g, ', ')
            // Remove decorative and special symbols
            .replace(/[★☆✦✧✨✩✪✫✬✭✮✯✰⭐♦♥♠♣◆◇○●◎■□▪▫►▼◄▲△▽☑☐✓✔✕✖✗✘☛☞✝†‡§¶©®™°±×÷∞≈≠≤≥]/g, '')
            // Remove bullets and list markers
            .replace(/^[\u2022\u2023\u25E6\u2043\u2219\-]\s*/gm, '')
            .replace(/^\d+\.\s+/gm, '')
            // Remove parentheses, brackets, braces (keep content)
            .replace(/[()[\]{}]/g, '')
            // Remove colons at end of headers/labels (they sound robotic)
            .replace(/:\s*$/gm, '.')
            .replace(/:\s+/g, ', ')
            // Clean repeated punctuation
            .replace(/([.!?,;])\1+/g, '$1')
            // Replace semicolons with natural pauses
            .replace(/;/g, ',')
            // Paragraph breaks become pauses
            .replace(/\n{2,}/g, '.\n')
            .replace(/\n/g, '. ')
            // Clean whitespace
            .replace(/[ \t]+/g, ' ')
            .replace(/^\s+/gm, '')
            // Remove leading/trailing commas or periods from cleanup artifacts
            .replace(/^[.,\s]+/gm, '')
            .replace(/\.\s*\./g, '.')
            .replace(/,\s*\./g, '.')
            .replace(/,\s*,/g, ',')
            .trim();
    }

    splitTextForSpeech(text) {
        // Split at sentence boundaries first
        const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
        const chunks = [];
        let current = '';
        for (const s of sentences) {
            const trimmed = s.trim();
            if (!trimmed) continue;
            // If adding this sentence keeps us under limit, group them
            if ((current + ' ' + trimmed).length < 150 && current) {
                current += ' ' + trimmed;
            } else if (current) {
                chunks.push(current.trim());
                current = trimmed;
            } else {
                current = trimmed;
            }
            // If current chunk is long, break at comma
            if (current.length > 180) {
                const commaIdx = current.lastIndexOf(',', 150);
                if (commaIdx > 50) {
                    chunks.push(current.substring(0, commaIdx + 1).trim());
                    current = current.substring(commaIdx + 1).trim();
                }
            }
        }
        if (current.trim()) chunks.push(current.trim());
        // Filter empty chunks
        return chunks.filter(c => c.length > 2);
    }

    speakChunks(chunks, index = 0) {
        if (index >= chunks.length) {
            this.currentUtterance = null;
            this.resetTtsBar();
            this.hideNowPlaying();
            if (window.bibliaAmbient) window.bibliaAmbient.restoreAfterSpeech();
            // Mark all as past, keep karaoke open briefly
            this.karaokeProgressEl.style.width = '100%';
            this.karaokeBody.querySelectorAll('.karaoke-chunk').forEach(el => {
                el.classList.remove('active', 'future');
                el.classList.add('past');
            });
            return;
        }

        // Highlight current chunk in karaoke
        this.highlightKaraokeChunk(index, chunks.length);

        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.lang = this.ttsVoice ? this.ttsVoice.lang : 'es-AR';
        utterance.rate = this.ttsRate;
        utterance.pitch = 1.02;
        this.currentUtterance = utterance;

        if (this.ttsVoice) {
            utterance.voice = this.ttsVoice;
        }

        utterance.onend = () => {
            this.speakChunks(chunks, index + 1);
        };
        utterance.onerror = () => {
            this.currentUtterance = null;
            this.resetTtsBar();
            this.closeKaraoke();
        };

        this.synth.speak(utterance);
    }

    // ==========================================
    // FILE HANDLING
    // ==========================================
    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                this.addMessage('system', `${file.name} es demasiado grande (max 10MB)`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.attachments.push({
                    name: file.name,
                    type: file.type,
                    data: e.target.result,
                    size: file.size
                });
                this.renderAttachments();
            };

            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
        this.fileInput.value = '';
    }

    renderAttachments() {
        this.attachmentsEl.innerHTML = this.attachments.map((att, i) => {
            const icon = att.type.startsWith('image/') ? '\u{1F5BC}\uFE0F' : '\u{1F4C4}';
            const size = (att.size / 1024).toFixed(1) + 'KB';
            return `<div class="bot-attachment">
                <span class="bot-attachment-icon">${icon}</span>
                <span class="bot-attachment-name">${att.name} (${size})</span>
                <button class="bot-attachment-remove" data-idx="${i}">\u00D7</button>
            </div>`;
        }).join('');

        this.attachmentsEl.querySelectorAll('.bot-attachment-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this.attachments.splice(parseInt(btn.dataset.idx), 1);
                this.renderAttachments();
            });
        });
    }

    // ==========================================
    // ADD MESSAGE TO UI
    // ==========================================
    addMessage(role, content) {
        const div = document.createElement('div');
        div.className = `bot-msg ${role}`;

        if (role === 'assistant') {
            div.innerHTML = this.renderMarkdown(content);
            this.appendTtsBar(div, content);
        } else {
            div.textContent = content;
        }

        this.messagesEl.appendChild(div);
        this.scrollToBottom();
        return div;
    }

    showTyping() {
        const div = document.createElement('div');
        div.className = 'bot-typing';
        div.id = 'botTyping';
        div.innerHTML = '<span></span><span></span><span></span>';
        this.messagesEl.appendChild(div);
        this.scrollToBottom();
    }

    hideTyping() {
        const el = this.messagesEl.querySelector('#botTyping');
        if (el) el.remove();
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        });
    }

    // ==========================================
    // MARKDOWN RENDERER
    // ==========================================
    renderMarkdown(text) {
        return text
            // Code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Blockquote
            .replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')
            // Headers
            .replace(/^### (.+)$/gm, '<strong style="font-size:15px">$1</strong>')
            .replace(/^## (.+)$/gm, '<strong style="font-size:16px">$1</strong>')
            .replace(/^# (.+)$/gm, '<strong style="font-size:17px">$1</strong>')
            // Unordered list
            .replace(/^[-*]\s(.+)$/gm, '\u2022 $1')
            // Ordered list
            .replace(/^\d+\.\s(.+)$/gm, (_, p1) => '\u2022 ' + p1)
            // Line breaks
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    // ==========================================
    // SEND MESSAGE
    // ==========================================
    async send() {
        const text = this.inputEl.value.trim();
        if ((!text && this.attachments.length === 0) || this.isStreaming) return;

        // Build user content
        let userContent = text;
        if (this.attachments.length > 0) {
            const attDescriptions = this.attachments.map(a => {
                if (a.type.startsWith('image/')) {
                    return `[Imagen adjunta: ${a.name}]`;
                }
                return `[Archivo adjunto: ${a.name}]\nContenido:\n${a.data.substring(0, 3000)}`;
            }).join('\n');
            userContent = text + '\n\n' + attDescriptions;
        }

        const ctx = this.getBibleContext();
        if (ctx) userContent += ctx;

        // Show user message
        const displayText = text || `\u{1F4CE} ${this.attachments.map(a => a.name).join(', ')}`;
        this.addMessage('user', displayText);

        // Clear input
        this.inputEl.value = '';
        this.inputEl.style.height = 'auto';
        this.attachments = [];
        this.renderAttachments();

        // Add to history
        this.messages.push({ role: 'user', content: userContent });

        // Stream response
        await this.streamResponse();
    }

    // ==========================================
    // STREAM RESPONSE FROM OPENCLAW
    // ==========================================
    async streamResponse() {
        this.isStreaming = true;
        this.sendBtn.disabled = true;
        this.showTyping();

        const body = {
            model: 'openclaw:main',
            stream: true,
            messages: [
                { role: 'system', content: this.systemPrompt },
                ...this.messages.slice(-20) // Keep last 20 messages for context
            ]
        };

        let fullResponse = '';
        let responseDiv = null;

        try {
            const res = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.TOKEN}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errText}`);
            }

            this.hideTyping();

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullResponse += delta;
                            if (!responseDiv) {
                                responseDiv = this.addMessage('assistant', fullResponse);
                            } else {
                                // Re-render preserving TTS bar
                                const ttsBar = responseDiv.querySelector('.bot-tts-bar');
                                responseDiv.innerHTML = this.renderMarkdown(fullResponse);
                                if (ttsBar) responseDiv.appendChild(ttsBar);
                            }
                            this.scrollToBottom();
                        }
                    } catch (e) {
                        // Skip unparseable chunks
                    }
                }
            }

            // Rebuild TTS bar with final text after streaming completes
            if (responseDiv) {
                const oldBar = responseDiv.querySelector('.bot-tts-bar');
                if (oldBar) oldBar.remove();
                this.appendTtsBar(responseDiv, fullResponse);
            }

            if (fullResponse) {
                this.messages.push({ role: 'assistant', content: fullResponse });
            }

        } catch (err) {
            this.hideTyping();
            console.error('BibliaBot error:', err);
            this.addMessage('system', `Error de conexion: ${err.message}. Verifica que OpenClaw este corriendo.`);
        }

        this.isStreaming = false;
        this.sendBtn.disabled = false;
    }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the BibliaApp to load
    setTimeout(() => {
        window.bibliaBot = new BibliaBot();
    }, 500);
});
