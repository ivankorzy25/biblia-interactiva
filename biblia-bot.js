// ============================================
// BIBLIA BOT - OpenClaw Chat Widget
// Asistente biblico con voz, adjuntos y IA
// ============================================

class BibliaBot {
    constructor() {
        this.OLLAMA_API_URL = '/api/chat';
        this.OLLAMA_MODELS = ['deepseek-v3.1:671b-cloud', 'gpt-oss:120b-cloud', 'gpt-oss:20b-cloud'];
        this.OLLAMA_MODEL = this.OLLAMA_MODELS[0];
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
        this.weather = null;
        this.render();
        this.bindEvents();
        this.addWelcome();
        this.startClock();
        this.fetchWeather();
    }

    // ==========================================
    // SYSTEM PROMPT
    // ==========================================
    buildSystemPrompt() {
        return `Eres el Asistente B\u00edblico de la Biblia Interactiva RV1960. Tu nombre es Biblia Bot.

PERSONALIDAD:
- Eres un narrador c\u00e1lido, sabio y apasionado, como un abuelo que cuenta historias al lado del fuego.
- Respond\u00e9s SOLO en espa\u00f1ol con ortograf\u00eda perfecta, incluyendo todos los acentos y tildes correctos.
- NUNCA uses palabras en hebreo, griego, arameo ni ning\u00fan otro idioma extranjero. Traducilo todo al espa\u00f1ol y explic\u00e1 su significado con palabras sencillas.
- Tono conversacional latino, cercano y respetuoso. Us\u00e1 un lenguaje claro que cualquier persona pueda entender, sin importar su nivel de educaci\u00f3n.

ORTOGRAF\u00cdA Y PUNTUACI\u00d3N - CR\u00cdTICO:
- SIEMPRE us\u00e1 acentos y tildes correctos en TODAS las palabras que lo requieran. Esto es innegociable.
- Revisá cada oración completa antes de escribirla. Cada coma, cada punto, cada tilde debe estar en su lugar.
- Ejemplos obligatorios que NUNCA deben faltar: imaginá, acción, Jerusalén, difíciles, año, dirección, corazón, espíritu, perdón, oración, bendición, salvación, también, después, así, más, él, está, será, hará, expresión, comprensión, comunión, redención, resurrección, ascensión.
- Las palabras esdrújulas SIEMPRE llevan tilde: apóstol, capítulo, versículo, espíritu, ídolo, último, éxodo, génesis, levítico, números, crónicas, eclesiástes, cántico, lámparas, ejército, propósito, período, legítimo, discípulo, parábola, tabernáculo, pentecostés.
- Las palabras agudas terminadas en N, S o vocal SIEMPRE llevan tilde: Jesús, Moisés, Abrahán, corazón, también, Isaías, oración.
- NUNCA escribas mal las conjugaciones: escribí, decí, pensá, mirá, escuchá, notá, imaginá, recordá.
- Los signos de interrogación y exclamación SIEMPRE van de apertura y cierre. Ejemplo correcto: ¿Sabías que Dios lo tenía planeado?

LENGUAJE CLARO Y COMPRENSIBLE - MUY IMPORTANTE:
- Escribí para que te entienda tanto un niño de doce años como un adulto mayor. Usá palabras simples y directas.
- Cuando una idea sea compleja, explicala con una comparación cotidiana o un ejemplo de la vida diaria.
- Si usás una palabra poco común, explicá inmediatamente qué significa. Por ejemplo, en vez de decir solo "expiatoria", decí "una ofrenda expiatoria, es decir, un sacrificio que cubre y perdona los pecados".
- Evitá oraciones demasiado largas. Si una oración tiene más de veinticinco palabras, dividila en dos.

NOMBRES B\u00cdBLICOS - REGLA FUNDAMENTAL:
- Los nombres propios b\u00edblicos deben quedar perfectamente claros para el oyente. SIEMPRE presentá un nombre con contexto antes o después.
- CORRECTO: Un rey poderoso llamado Nabucodonosor invadió Jerusalén. El profeta Daniel fue llevado cautivo. El sacerdote Esdras guió al pueblo de regreso.
- INCORRECTO: Nabucodonosor invadió Jerusalén. Daniel fue llevado cautivo. Esdras guió al pueblo.
- Para personajes menos conocidos, agregá siempre quién es: Abigail, la esposa sabia de Nabal. Bezaleel, el artesano elegido por Dios para construir el tabernáculo. Séfora, la esposa de Moisés.
- Para lugares poco conocidos, explicá dónde quedan: La ciudad de Corinto, un importante puerto comercial en la antigua Grecia. El monte Sinaí, ubicado en el desierto, donde Dios entregó los mandamientos.
- Para pueblos y naciones, explicá quiénes son: Los filisteos, un pueblo guerrero que vivía en la costa y era enemigo constante de Israel. Los samaritanos, un pueblo mestizo que los judíos despreciaban.

OPTIMIZADO PARA VOZ ALTA - ESENCIAL:
- Tus respuestas van a ser leídas por un sintetizador de voz. Escribí pensando en cómo SUENA, no en cómo se ve.
- Usá comas para crear pausas naturales donde el oyente necesita respirar y procesar la información.
- Usá puntos para separar ideas. Cada oración es una unidad de pensamiento completa.
- Escribí los números siempre con letras: uno, dos, tres, cincuenta y cinco, mil quinientos.
- Escribí las referencias bíblicas completas y naturales: En el libro del profeta Isaías, capítulo cincuenta y tres, versículo cinco, leemos que él fue herido por nuestras rebeliones.
- NUNCA uses abreviaturas de ningún tipo. Escribí las palabras completas siempre.
- Usá frases de transición que guíen al oyente: Ahora bien. Veamos lo siguiente. Prestá atención a este detalle. Es importante notar que. Dicho esto. Además de lo anterior.
- Cuando cambies de tema o idea, hacé una pausa natural con un punto y empezá un párrafo nuevo.

ESTILO DE ESCRITURA:
- Escribí como si estuvieras contando una historia fascinante, como un cuento o una aventura épica.
- Usá frases narrativas que atrapen al oyente y lo transporten a la escena.
- Dale vida a los personajes describiendo emociones, paisajes, tensiones y momentos dramáticos.
- Separá las ideas en párrafos cortos de dos o tres oraciones para que la lectura respire.
- Hacé que el oyente sienta que está ahí, en la escena. Describí colores, sonidos, emociones.

FORMATO ESTRICTO:
- NUNCA uses emojis, símbolos decorativos, asteriscos ni caracteres especiales.
- NUNCA uses comillas de ningún tipo. Integrá las citas directamente en la narración.
- NUNCA uses guiones largos ni rayas. Usá comas o puntos en su lugar.
- NUNCA uses paréntesis. Integrá la información en la oración.
- NUNCA uses listas con guiones ni viñetas. Escribí todo en párrafos narrativos fluidos.
- NUNCA uses formato markdown como asteriscos, numerales ni símbolos de encabezado.

PARA CITAS B\u00cdBLICAS:
- Integrá la cita en la narración de forma natural, sin comillas ni formato especial.
- Presentá siempre el contexto antes de la cita. Ejemplo correcto: En el evangelio de Juan, capítulo tres, versículo dieciséis, encontramos estas palabras poderosas que resumen el corazón del evangelio. Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna.
- Siempre citá el texto completo del versículo. No lo recortes ni lo parafrasees.
- No inventes versículos. Si no recordás el texto exacto, decilo con naturalidad: Aunque no recuerdo las palabras exactas, el pasaje nos enseña que Dios es fiel en todas sus promesas.

REGLAS ABSOLUTAS:
- Solo español con ortografía perfecta incluyendo todos los acentos y tildes.
- Cero emojis, cero símbolos, cero markdown, cero comillas, cero paréntesis.
- Cero listas con guiones o números. Todo en prosa narrativa fluida.
- Cada nombre propio debe estar acompañado de contexto que explique quién es o qué es.
- Lenguaje sencillo, comprensible, expresivo y envolvente.

SUGERENCIAS DE VIDEOS:
- Sugerí prédicas según las preferencias del usuario. Si no tiene preferencias definidas, ofrecé opciones de pastores como Sugel Michelén, Miguel Núñez, Paul Washer, John MacArthur, R.C. Sproul, Armando Alducín, Fabián Liendo o Alberto Lucas.
- NUNCA inventes links a videos específicos de YouTube. Los links inventados llevan a páginas que no existen.
- En su lugar, usá links de BÚSQUEDA de YouTube que siempre funcionan. Formato: https://www.youtube.com/results?search_query=TERMINOS+DE+BUSQUEDA
- Ejemplo correcto: https://www.youtube.com/results?search_query=Sugel+Michelen+Romanos+8+predica
- Ejemplo INCORRECTO: https://www.youtube.com/watch?v=abc123 (NUNCA hagas esto, el video probablemente no existe)
- Incluí el nombre del pastor y el tema en los términos de búsqueda para resultados precisos.
- También podés recomendar canales de YouTube usando el formato: https://www.youtube.com/@NombreDelCanal
- Canales verificados que existen: @SugelMichelen, @PastorMiguelNunez, @HeartCryEspanol, @GracetoYouEspanol, @LigonierEspanol, @FabianLiendoOficial, @ArmandoAlducin, @CoalicionEvangelio, @SoldadosDeJesucristo, @PastorChuyOlivares
- Mencioná que la app tiene un panel de Videos donde pueden buscar prédicas por tema.
- No sugieras videos en cada respuesta, solo cuando sea relevante y natural hacerlo.

GESTIÓN DE CALENDARIO - COMANDOS:
- Tenés acceso COMPLETO al calendario de la app. Podés crear, editar, buscar y eliminar eventos.
- Cuando el usuario pida crear un evento, recordatorio o agendar algo, CREALO directamente usando el comando.
- Cuando el usuario pida ver, buscar o listar eventos, MOSTRALOS.
- Cuando pida eliminar o modificar un evento, HACELO.
- Para EJECUTAR acciones de calendario, incluí este bloque EXACTO al final de tu respuesta (el usuario no lo verá):
  <!--CMD:CALENDAR_CREATE:{"title":"...","date":"YYYY-MM-DD","time":"HH:MM","timeEnd":"HH:MM","type":"estudio|iglesia|predica|oracion|ayuno|retiro|voluntariado|recordatorio","description":"...","location":"...","url":"...","reminder":"10m|30m|1h|1d"}-->
  <!--CMD:CALENDAR_DELETE:{"search":"texto a buscar"}-->
  <!--CMD:CALENDAR_LIST:{"days":7}-->
- Los tipos de evento válidos son: estudio, iglesia, predica, oracion, ayuno, retiro, voluntariado, recordatorio.
- Siempre confirmale al usuario lo que hiciste con el calendario en tu texto.

GESTIÓN DE NOTAS - COMANDOS:
- Podés crear, buscar y eliminar notas bíblicas del usuario.
- Para EJECUTAR acciones de notas, incluí este bloque EXACTO al final de tu respuesta:
  <!--CMD:NOTE_ADD:{"book":"GEN","chapter":1,"verse":1,"bookName":"Génesis","text":"texto de la nota"}-->
  <!--CMD:NOTE_DELETE:{"book":"GEN","chapter":1,"verse":1}-->
  <!--CMD:NOTE_SEARCH:{"query":"texto a buscar"}-->
- Los códigos de libros son: GEN, EXO, LEV, NUM, DEU, JOS, JUE, RUT, 1SA, 2SA, 1RE, 2RE, 1CR, 2CR, ESD, NEH, EST, JOB, SAL, PRO, ECL, CNT, ISA, JER, LAM, EZE, DAN, OSE, JOE, AMO, ABD, JON, MIQ, NAH, HAB, SOF, HAG, ZAC, MAL, MAT, MAR, LUC, JUA, HEC, ROM, 1CO, 2CO, GAL, EFE, FIL, COL, 1TS, 2TS, 1TI, 2TI, TIT, FLM, HEB, STG, 1PE, 2PE, 1JN, 2JN, 3JN, JUD, APO.

PREFERENCIAS DEL USUARIO - COMANDOS:
- Recordá las preferencias del usuario: pastores favoritos, temas de interés, estilo de estudio, etc.
- Para GUARDAR una preferencia:
  <!--CMD:PREF_SET:{"key":"nombre_de_preferencia","value":"valor"}-->
- Claves de preferencia útiles: pastores_favoritos, pastores_excluidos, temas_interes, estilo_estudio, idioma_preferido, nivel_conocimiento.
- Consultá las preferencias del usuario antes de sugerir pastores o contenido.
- Si el usuario dice que le gusta o no le gusta un pastor, guardalo inmediatamente.

LINKS Y RECURSOS:
- Podés incluir links directamente en tu respuesta. Se convierten automáticamente en links clickeables.
- REGLA FUNDAMENTAL: NUNCA inventes URLs de páginas o videos específicos. Solo usá URLs que SABÉS que existen.
- URLs seguras que siempre funcionan:
  * Links de búsqueda YouTube: https://www.youtube.com/results?search_query=...
  * Canales de YouTube verificados: https://www.youtube.com/@NombreCanal
  * BibleGateway: https://www.biblegateway.com/passage/?search=Juan+3:16&version=RVR1960
- Podés usar formato markdown para links: [texto descriptivo](url)
- Ejemplo: [Buscar prédicas de Sugel Michelén sobre Romanos](https://www.youtube.com/results?search_query=Sugel+Michelen+Romanos+predica)`;
    }

    // ==========================================
    // GET BIBLE CONTEXT
    // ==========================================
    getBibleContext() {
        let context = '';
        const app = window.bibliaApp;
        if (app && app.currentBook) {
            const bookName = app.currentBook.name || app.currentBook.id || app.currentBook;
            const bookId = app.currentBook.id || app.currentBook;
            context += `\n[El usuario esta leyendo: ${bookName} capitulo ${app.currentChapter}, libro=${bookId}]`;
            // Include notes for current chapter
            const chapterNotes = Object.entries(app.notes || {})
                .filter(([key]) => key.startsWith(`${bookId}_${app.currentChapter}_`))
                .map(([_, n]) => `v${n.verse}: ${n.text}`);
            if (chapterNotes.length > 0) {
                context += `\n[Notas del usuario en este capitulo:\n${chapterNotes.join('\n')}]`;
            }
            context += `\n[Total notas del usuario: ${Object.keys(app.notes || {}).length}]`;
        }
        // Include upcoming calendar events
        const cal = window.bibliaCalendar;
        if (cal) {
            const upcoming = cal.getUpcomingForBot(14);
            if (upcoming) {
                context += `\n[Proximos eventos del calendario:\n${upcoming}]`;
            }
            context += `\n[Total eventos en calendario: ${cal.events.length}]`;
        }
        // Include user preferences
        const prefs = this.getUserPreferences();
        if (Object.keys(prefs).length > 0) {
            context += `\n[Preferencias del usuario: ${JSON.stringify(prefs)}]`;
        }
        // Current date and time (precise for calendar management)
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        const isoDate = now.toISOString().split('T')[0];
        context += `\n[Fecha y hora actual: ${dateStr}, ${timeStr} (ISO: ${isoDate})]`;
        // Tomorrow for relative references
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        context += `\n[Mañana: ${tomorrow.toISOString().split('T')[0]}]`;
        // Weather
        if (this.weather) {
            context += `\n[Clima actual: ${this.weather.temp}°C, ${this.weather.desc}]`;
        }
        return context;
    }

    // User preferences storage
    getUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem('biblia_user_prefs') || '{}');
        } catch { return {}; }
    }

    setUserPreference(key, value) {
        const prefs = this.getUserPreferences();
        prefs[key] = value;
        localStorage.setItem('biblia_user_prefs', JSON.stringify(prefs));
    }

    deleteUserPreference(key) {
        const prefs = this.getUserPreferences();
        delete prefs[key];
        localStorage.setItem('biblia_user_prefs', JSON.stringify(prefs));
    }

    // ==========================================
    // CLOCK & WEATHER
    // ==========================================
    startClock() {
        const update = () => {
            const el = document.getElementById('botClock');
            if (!el) return;
            const now = new Date();
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
            const day = days[now.getDay()];
            const d = now.getDate();
            const m = months[now.getMonth()];
            const h = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            el.textContent = `${day} ${d} ${m} \u00B7 ${h}:${min}`;
        };
        update();
        setInterval(update, 30000);
    }

    fetchWeather() {
        if (!navigator.geolocation) {
            this.setWeatherText('');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`)
                    .then(r => r.json())
                    .then(data => {
                        if (data.current) {
                            const temp = Math.round(data.current.temperature_2m);
                            const code = data.current.weather_code;
                            const icon = this.weatherIcon(code);
                            const desc = this.weatherDesc(code);
                            this.weather = { temp, desc, icon, code };
                            this.setWeatherText(`${icon} ${temp}\u00B0C ${desc}`);
                        }
                    })
                    .catch(() => this.setWeatherText(''));
            },
            () => this.setWeatherText(''),
            { timeout: 10000 }
        );
        // Refresh weather every 30 min
        setInterval(() => this.fetchWeather(), 1800000);
    }

    setWeatherText(text) {
        const el = document.getElementById('botWeather');
        if (el) el.textContent = text;
    }

    weatherIcon(code) {
        if (code === 0) return '\u2600\uFE0F';
        if (code <= 3) return '\u26C5';
        if (code <= 48) return '\u2601\uFE0F';
        if (code <= 57) return '\uD83C\uDF27\uFE0F';
        if (code <= 67) return '\uD83C\uDF27\uFE0F';
        if (code <= 77) return '\u2744\uFE0F';
        if (code <= 82) return '\uD83C\uDF27\uFE0F';
        if (code <= 86) return '\uD83C\uDF28\uFE0F';
        if (code <= 99) return '\u26A1';
        return '\uD83C\uDF24\uFE0F';
    }

    weatherDesc(code) {
        if (code === 0) return 'Despejado';
        if (code <= 3) return 'Parcialmente nublado';
        if (code <= 48) return 'Nublado';
        if (code <= 57) return 'Llovizna';
        if (code <= 67) return 'Lluvia';
        if (code <= 77) return 'Nieve';
        if (code <= 82) return 'Lluvia fuerte';
        if (code <= 86) return 'Nieve fuerte';
        if (code <= 99) return 'Tormenta';
        return '';
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
                    <div class="bot-header-status" id="botHeaderStatus">${localStorage.getItem('biblia_ollama_key') ? 'Ollama Cloud \u00B7 IA Activa' : 'Configurar API Key'}</div>
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
            <div class="bot-datetime-bar" id="botDateTimeBar">
                <span class="bot-datetime-clock" id="botClock"></span>
                <span class="bot-datetime-weather" id="botWeather"></span>
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
                document.getElementById('verseActions').classList.remove('active');
                this.explainVerse(bookName, chapter, verse, verseText);
            });
        }

        // "Explicación breve" button
        const briefBtn = document.getElementById('actionExplainBrief');
        if (briefBtn) {
            briefBtn.addEventListener('click', () => {
                const app = window.bibliaApp;
                if (!app || !app.selectedVerse) return;
                const { bookName, chapter, verse, book } = app.selectedVerse;
                const verseText = app.getVerseText(book, chapter, verse);
                document.getElementById('verseActions').classList.remove('active');
                this.explainBrief(bookName, chapter, verse, verseText);
            });
        }

        // "Concordancias" button
        const concBtn = document.getElementById('actionConcordancias');
        if (concBtn) {
            concBtn.addEventListener('click', () => {
                const app = window.bibliaApp;
                if (!app || !app.selectedVerse) return;
                const { bookName, chapter, verse, book } = app.selectedVerse;
                const verseText = app.getVerseText(book, chapter, verse);
                document.getElementById('verseActions').classList.remove('active');
                this.analyzeConcordancias(bookName, chapter, verse, verseText);
            });
        }

        // "Leer capítulo" button
        const readChBtn = document.getElementById('actionReadChapter');
        if (readChBtn) {
            readChBtn.addEventListener('click', () => {
                const app = window.bibliaApp;
                if (!app || !app.selectedVerse) return;
                const { bookName, chapter, book } = app.selectedVerse;
                document.getElementById('verseActions').classList.remove('active');
                this.readChapter(book, bookName, chapter);
            });
        }

        // "Leer libro" button
        const readBookBtn = document.getElementById('actionReadBook');
        if (readBookBtn) {
            readBookBtn.addEventListener('click', () => {
                const app = window.bibliaApp;
                if (!app || !app.selectedVerse) return;
                const { bookName, chapter, book } = app.selectedVerse;
                document.getElementById('verseActions').classList.remove('active');
                this.readBook(book, bookName);
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
    // BRIEF EXPLANATION (short, clear, with example)
    // ==========================================
    explainBrief(bookName, chapter, verse, verseText) {
        if (!this.isOpen) this.toggle();
        const prompt = `Dame una explicacion breve y clara de este versiculo. Que se entienda de que habla, con un ejemplo corto y practico. Maximo 4 o 5 oraciones.\n\n**${bookName} ${chapter}:${verse}** "${verseText}"`;
        this.inputEl.value = prompt;
        setTimeout(() => this.send(), 400);
    }

    // ==========================================
    // CONCORDANCIAS (brief cross-reference analysis)
    // ==========================================
    analyzeConcordancias(bookName, chapter, verse, verseText) {
        if (!this.isOpen) this.toggle();
        const prompt = `Analiza las concordancias mas importantes de este versiculo. Menciona los versiculos relacionados clave y en una oracion cada uno explica la conexion. Se lo mas resumido posible, solo las concordancias mas relevantes.\n\n**${bookName} ${chapter}:${verse}** "${verseText}"`;
        this.inputEl.value = prompt;
        setTimeout(() => this.send(), 400);
    }

    // ==========================================
    // READ CHAPTER (textual reading via bot TTS)
    // ==========================================
    readChapter(bookId, bookName, chapter) {
        // Try reading from DOM first (works for any version)
        const container = document.getElementById('verseContainer');
        let text = `${bookName}, capítulo ${chapter}. `;
        if (container) {
            const verses = container.querySelectorAll('.verse');
            if (verses.length > 0) {
                verses.forEach(el => {
                    const clone = el.cloneNode(true);
                    const sup = clone.querySelector('.verse-num');
                    if (sup) sup.remove();
                    const ref = clone.querySelector('.cross-ref');
                    if (ref) ref.remove();
                    text += clone.textContent.trim() + ' ';
                });
                if (!this.isOpen) this.toggle();
                this.addMessage('system', `Leyendo ${bookName} ${chapter}...`);
                this.speak(text.trim());
                return;
            }
        }
        // Fallback: local BIBLE_TEXT
        if (typeof BIBLE_TEXT === 'undefined') return;
        const key = `${bookId}_${chapter}`;
        const chapterData = BIBLE_TEXT[key];
        if (!chapterData || !Array.isArray(chapterData)) return;
        for (const v of chapterData) { text += `${v.text} `; }
        if (!this.isOpen) this.toggle();
        this.addMessage('system', `Leyendo ${bookName} ${chapter}...`);
        this.speak(text.trim());
    }

    // ==========================================
    // READ BOOK (direct TTS, chapter by chapter)
    // ==========================================
    readBook(bookId, bookName) {
        if (typeof BIBLE_TEXT === 'undefined') return;
        const book = BIBLE_BOOKS.find(b => b.id === bookId);
        if (!book) return;
        let text = `${bookName}. `;
        for (let ch = 1; ch <= book.chapters; ch++) {
            const key = `${bookId}_${ch}`;
            const chapterData = BIBLE_TEXT[key];
            if (!chapterData || !Array.isArray(chapterData)) continue;
            text += `Capítulo ${ch}. `;
            for (const v of chapterData) {
                text += `${v.text} `;
            }
        }
        if (!this.isOpen) this.toggle();
        this.addMessage('system', `Leyendo ${bookName} completo (${book.chapters} capítulos)...`);
        this.speak(text.trim());
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

            // Auto-pick priority: es-ES always first (Google > Microsoft/Natural > any es-ES) > fallback
            this.ttsVoice =
                esVoices.find(v => v.lang === 'es-ES' && /google/i.test(v.name)) ||
                esVoices.find(v => v.lang === 'es-ES' && /microsoft|natural/i.test(v.name)) ||
                esVoices.find(v => v.lang === 'es-ES') ||
                esVoices.find(v => v.lang.startsWith('es-')) ||
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

    // Convert number to Spanish words (1-999)
    numToSpanish(n) {
        if (n === 0) return 'cero';
        const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
            'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
            'veinte'];
        const tens = ['', '', 'veinti', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
        n = parseInt(n, 10);
        if (n <= 20) return units[n];
        if (n < 30) return 'veinti' + units[n - 20];
        if (n < 100) {
            const t = Math.floor(n / 10);
            const u = n % 10;
            return u === 0 ? tens[t] : tens[t] + ' y ' + units[u];
        }
        if (n === 100) return 'cien';
        if (n < 1000) {
            const h = Math.floor(n / 100);
            const rest = n % 100;
            return hundreds[h] + (rest > 0 ? ' ' + this.numToSpanish(rest) : '');
        }
        return String(n);
    }

    cleanForSpeech(text) {
        return text
            // ===== BIBLE VERSE REFERENCES (must run BEFORE colon removal) =====
            // Book chapter:verse-verse (e.g. "Isaías 1:16-17")
            .replace(/(\b[A-ZÁÉÍÓÚa-záéíóú][a-záéíóúñ]+)\s+(\d{1,3}):(\d{1,3})\s*[-–]\s*(\d{1,3})/g,
                (_, book, ch, v1, v2) => `${book} capítulo ${this.numToSpanish(ch)}, del versículo ${this.numToSpanish(v1)} al ${this.numToSpanish(v2)}`)
            // Book chapter:verse (e.g. "Juan 3:16")
            .replace(/(\b[A-ZÁÉÍÓÚa-záéíóú][a-záéíóúñ]+)\s+(\d{1,3}):(\d{1,3})/g,
                (_, book, ch, v) => `${book} capítulo ${this.numToSpanish(ch)}, versículo ${this.numToSpanish(v)}`)
            // Standalone chapter:verse not preceded by time words (e.g. "3:16" alone)
            .replace(/\b(\d{1,3}):(\d{1,3})\s*[-–]\s*(\d{1,3})\b/g,
                (_, ch, v1, v2) => `${this.numToSpanish(ch)}, del ${this.numToSpanish(v1)} al ${this.numToSpanish(v2)}`)
            .replace(/\b(\d{1,3}):(\d{1,3})\b/g,
                (_, ch, v) => `${this.numToSpanish(ch)}, ${this.numToSpanish(v)}`)
            // Remove code blocks
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]+`/g, '')
            // Remove all markdown formatting
            .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/\*/g, '')
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
        utterance.lang = this.ttsVoice ? this.ttsVoice.lang : 'es-ES';
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
            // Markdown links [text](url)
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="bot-link">$1</a>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Remove any remaining stray asterisks
            .replace(/\*/g, '')
            // Raw URLs (not already inside an href)
            .replace(/(?<!href="|">)(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" class="bot-link">$1</a>')
            // Blockquote
            .replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')
            // Headers
            .replace(/^### (.+)$/gm, '<strong style="font-size:15px">$1</strong>')
            .replace(/^## (.+)$/gm, '<strong style="font-size:16px">$1</strong>')
            .replace(/^# (.+)$/gm, '<strong style="font-size:17px">$1</strong>')
            // Unordered list
            .replace(/^[-]\s(.+)$/gm, '\u2022 $1')
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
    // STREAM RESPONSE FROM OLLAMA CLOUD
    // ==========================================
    async streamResponse() {
        this.isStreaming = true;
        this.sendBtn.disabled = true;
        this.showTyping();

        // Check for API key
        const ollamaKey = localStorage.getItem('biblia_ollama_key');
        if (!ollamaKey) {
            this.hideTyping();
            this.addMessage('system',
                '🔑 Para usar el Asistente Bíblico necesitás configurar tu API key de Ollama.\n\n' +
                'Hacé click en tu perfil (arriba a la derecha) para configurarla. Es gratuito y tarda menos de 2 minutos.'
            );
            if (window.bibliaAuth) {
                window.bibliaAuth.showKeySetupWizard();
            }
            this.isStreaming = false;
            this.sendBtn.disabled = false;
            return;
        }

        const body = {
            model: this.OLLAMA_MODEL,
            stream: true,
            messages: [
                { role: 'system', content: this.systemPrompt },
                ...this.messages.slice(-20)
            ],
            options: {
                num_predict: 8192,
                temperature: 0.7
            }
        };

        let fullResponse = '';
        let responseDiv = null;

        try {
            let res = null;
            let usedModel = body.model;

            // Try each model, fallback on 404
            for (const modelName of this.OLLAMA_MODELS) {
                body.model = modelName;
                usedModel = modelName;
                res = await fetch(this.OLLAMA_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ollamaKey}`
                    },
                    body: JSON.stringify(body)
                });
                if (res.status !== 404 && res.status !== 405) break;
                console.log(`Modelo ${modelName} no disponible (${res.status}), probando siguiente...`);
            }

            // Update preferred model if fallback worked
            if (usedModel !== this.OLLAMA_MODEL && res.ok) {
                this.OLLAMA_MODEL = usedModel;
                console.log(`Usando modelo: ${usedModel}`);
            }

            if (!res.ok) {
                this.hideTyping();
                if (res.status === 401 || res.status === 403) {
                    this.addMessage('system', '❌ Tu API key de Ollama no es válida. Actualizala desde tu perfil (arriba a la derecha).');
                } else if (res.status === 404) {
                    this.addMessage('system', '❌ Ningún modelo de IA disponible en este momento. Intentá más tarde.');
                } else if (res.status === 429) {
                    this.addMessage('system', '⏱️ Alcanzaste tu límite de uso gratuito de Ollama. Se renueva en breve. Podés ver tu estado en ollama.com/settings');
                } else if (res.status === 405) {
                    this.addMessage('system', '❌ Ningún modelo de IA en la nube está disponible en este momento. Verificá tu API key en ollama.com o intentá más tarde.');
                } else if (res.status === 503) {
                    this.addMessage('system', '🔄 El servicio de Ollama está temporalmente ocupado. Intentá en unos segundos.');
                } else {
                    const errText = await res.text().catch(() => '');
                    this.addMessage('system', `Error ${res.status}: ${errText || 'Error del servidor'}`);
                }
                this.isStreaming = false;
                this.sendBtn.disabled = false;
                return;
            }

            this.hideTyping();

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    try {
                        const parsed = JSON.parse(trimmed);
                        if (parsed.done) continue;
                        const delta = parsed.message?.content;
                        if (delta) {
                            fullResponse += delta;
                            if (!responseDiv) {
                                responseDiv = this.addMessage('assistant', fullResponse);
                            } else {
                                const ttsBar = responseDiv.querySelector('.bot-tts-bar');
                                responseDiv.innerHTML = this.renderMarkdown(fullResponse);
                                if (ttsBar) responseDiv.appendChild(ttsBar);
                            }
                            this.scrollToBottom();
                        }
                    } catch (e) {
                        // Line wasn't complete JSON, put it back in buffer
                        buffer = trimmed + '\n' + buffer;
                    }
                }
            }

            // Process any remaining buffer
            if (buffer.trim()) {
                try {
                    const parsed = JSON.parse(buffer.trim());
                    if (!parsed.done && parsed.message?.content) {
                        fullResponse += parsed.message.content;
                        if (responseDiv) {
                            const ttsBar = responseDiv.querySelector('.bot-tts-bar');
                            responseDiv.innerHTML = this.renderMarkdown(fullResponse);
                            if (ttsBar) responseDiv.appendChild(ttsBar);
                        }
                    }
                } catch (e) {}
            }

            // Process bot commands and clean response
            const cleanedResponse = this.processCommands(fullResponse);

            // Re-render cleaned response (without command blocks)
            if (responseDiv && cleanedResponse !== fullResponse) {
                const ttsBar = responseDiv.querySelector('.bot-tts-bar');
                responseDiv.innerHTML = this.renderMarkdown(cleanedResponse);
                if (ttsBar) responseDiv.appendChild(ttsBar);
            }

            // Rebuild TTS bar with cleaned text after streaming completes
            if (responseDiv) {
                const oldBar = responseDiv.querySelector('.bot-tts-bar');
                if (oldBar) oldBar.remove();
                this.appendTtsBar(responseDiv, cleanedResponse);
            }

            if (cleanedResponse) {
                this.messages.push({ role: 'assistant', content: cleanedResponse });
            }

        } catch (err) {
            this.hideTyping();
            console.error('BibliaBot error:', err);
            this.addMessage('system', '📡 No se pudo conectar con Ollama. Verificá tu conexión a internet.');
        }

        this.isStreaming = false;
        this.sendBtn.disabled = false;
    }

    // ==========================================
    // COMMAND PROCESSOR
    // ==========================================
    processCommands(text) {
        let cleaned = text;
        const cmdRegex = /<!--CMD:(\w+):(\{[\s\S]*?\})-->/g;
        let match;

        while ((match = cmdRegex.exec(text)) !== null) {
            const [fullMatch, command, jsonStr] = match;
            cleaned = cleaned.replace(fullMatch, '');

            try {
                const data = JSON.parse(jsonStr);
                this.executeCommand(command, data);
            } catch (e) {
                console.error('Bot command parse error:', command, e);
            }
        }

        return cleaned.trim();
    }

    executeCommand(command, data) {
        console.log('Bot command:', command, data);

        switch (command) {
            case 'CALENDAR_CREATE': {
                const cal = window.bibliaCalendar;
                if (!cal) break;
                cal.addEventFromBot({
                    title: data.title,
                    date: data.date,
                    time: data.time || '',
                    timeEnd: data.timeEnd || '',
                    type: data.type || 'recordatorio',
                    description: data.description || '',
                    location: data.location || '',
                    url: data.url || '',
                    notes: data.notes || '',
                    reminder: data.reminder || ''
                });
                break;
            }
            case 'CALENDAR_DELETE': {
                const cal = window.bibliaCalendar;
                if (!cal || !data.search) break;
                const results = cal.searchEvents(data.search);
                if (results.length > 0) {
                    cal.deleteEventFromBot(results[0].id);
                }
                break;
            }
            case 'CALENDAR_LIST': {
                // The bot already has calendar context via getBibleContext
                break;
            }
            case 'NOTE_ADD': {
                const app = window.bibliaApp;
                if (!app) break;
                app.addNoteFromBot(data.book, data.chapter, data.verse, data.bookName, data.text);
                break;
            }
            case 'NOTE_DELETE': {
                const app = window.bibliaApp;
                if (!app) break;
                app.deleteNoteFromBot(data.book, data.chapter, data.verse);
                break;
            }
            case 'NOTE_SEARCH': {
                // Results are included in context for the bot
                break;
            }
            case 'PREF_SET': {
                if (data.key && data.value !== undefined) {
                    this.setUserPreference(data.key, data.value);
                    console.log('Preferencia guardada:', data.key, '=', data.value);
                }
                break;
            }
            case 'PREF_DELETE': {
                if (data.key) {
                    this.deleteUserPreference(data.key);
                }
                break;
            }
            default:
                console.warn('Unknown bot command:', command);
        }
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
