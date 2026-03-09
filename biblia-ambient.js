// ============================================
// BIBLIA AMBIENT MUSIC - Background Player
// Streams royalty-free worship music by mood
// ============================================

class BibliaAmbient {
    constructor() {
        this.audio = new Audio();
        this.audio.loop = false;
        this.audio.volume = parseFloat(localStorage.getItem('biblia_ambient_vol') || '0.25');
        this.isPlaying = false;
        this.currentMood = null;
        this.currentTrackIdx = 0;
        this.shuffleAll = localStorage.getItem('biblia_ambient_shuffle') !== 'false';
        this.tracks = this.buildPlaylist();
        this._shuffleQueue = [];   // cola barajada de todos los tracks
        this._shufflePos   = 0;
        this._buildShuffleQueue();
        this.render();
        this.bindEvents();
    }

    // Construye una cola barajada de todos los tracks de todos los moods
    _buildShuffleQueue() {
        const all = [];
        for (const [mood, cat] of Object.entries(this.tracks)) {
            cat.tracks.forEach((t, i) => all.push({ mood, idx: i, ...t }));
        }
        // Fisher-Yates shuffle
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }
        this._shuffleQueue = all;
        this._shufflePos   = 0;
    }

    _randomIdxExcluding(len, exclude) {
        if (len <= 1) return 0;
        let r;
        do { r = Math.floor(Math.random() * len); } while (r === exclude);
        return r;
    }

    buildPlaylist() {
        const IA = 'https://archive.org/download';
        return {
            peaceful: {
                label: 'Paz y Meditaci\u00f3n',
                tracks: [
                    { name: 'Adoraci\u00f3n en Piano - Tiempo con Dios', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20Alone%20With%20God%203%20Hour%20Prayer%20Time%20Music%20%20Christian%20Meditation%20Music%20%20Peaceful%20Relaxation%20Music.mp3` },
                    { name: 'Tiempo a Solas con Dios - 3 Horas', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20Time%20ALONE%20with%20GOD%20%203%20Hour%20Peaceful%20Music%20%20Meditation%20Music%20%20Prayer%20Music%20%20Relaxation%20Music.mp3` },
                    { name: 'Piano de Oraci\u00f3n Profunda', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20PRAY%20Deep%20Prayer%20Music%20%20Peaceful%20Piano%20Instrumental%20%20Time%20With%20Holy%20Spirit%20%20Spontaneous%20Worship.mp3` },
                    { name: 'M\u00fasica Instrumental para Orar', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20Musica%20instrumental%20para%20orar%20%20Instrumental%20worship%20music%20for%20pray.mp3` },
                    { name: 'Mi Tiempo de Oraci\u00f3n', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20My%20Prayer%20Time%20%20Instrumental%20Prayer%20%20Worship%20Music.mp3` },
                ]
            },
            worship: {
                label: 'Adoraci\u00f3n y Alabanza',
                tracks: [
                    { name: 'Hillsong - Dos Horas de Piano', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20Hillsong%20%20Two%20Hours%20of%20Worship%20Piano.mp3` },
                    { name: 'Hillsong, Elevation, Bethel - Piano', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20Two%20Hours%20of%20Worship%20Piano%20%20Hillsong%20%20Elevation%20%20Bethel%20%20Jesus%20Culture%20%20Passion%20%20Kari%20Jobe%20%281%29.mp3` },
                    { name: '30 Canciones Cristianas en Piano', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%2030%20Contemporary%20Christian%20Songs%20on%20Piano.mp3` },
                    { name: 'Ofrezco Mi Vida - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20I%20Offer%20My%20Life%20%28Instrumental%29.mp3` },
                    { name: 'Jes\u00fas Te Entronamos - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20Jesus%20We%20Enthrone%20You%20%28Instrumental%29.mp3` },
                ]
            },
            prayer: {
                label: 'Oraci\u00f3n Profunda',
                tracks: [
                    { name: 'Oraci\u00f3n Profunda - Esp\u00edritu Santo', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20PRAY%20Deep%20Prayer%20Music%20%20Peaceful%20Piano%20Instrumental%20%20Time%20With%20Holy%20Spirit%20%20Spontaneous%20Worship%20%281%29.mp3` },
                    { name: 'Oraci\u00f3n Prof\u00e9tica y Guerrera', url: `${IA}/dear-god-worship-instrumentals-2020/30%20Minutes%20Deep%20Prayer%20Music%20Prophetic%20Worship%20Intercession%20%26%20Warfare%20Time%20With%20Holy%20Spiri.mp3` },
                    { name: 'Intercesi\u00f3n - 1 Hora', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20PRAY%201%20Hour%20Deep%20Prayer%20Music%20%20Alone%20With%20God%20%20Spontaneous%20Worship%20Music%20%20Christian%20Meditation.mp3` },
                    { name: 'Way Maker - Instrumental Worship', url: `${IA}/dear-god-worship-instrumentals-2020/Worship%20Instrumental%20Medley%20%282%29%20Way%20Maker%20Awesome%20God%20Make%20Room%20Time%20With%20Holy%20Spirit.mp3` },
                ]
            },
            solemn: {
                label: 'Solemne y Reflexivo',
                tracks: [
                    { name: 'Celebra Su Gloria - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20Celebrate%20His%20Glory%20%28Instrumental%29.mp3` },
                    { name: 'Celebra Su Majestad - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20Celebrate%20His%20Majesty%20%28Instrumental%29.mp3` },
                    { name: 'Emmanuel Ha Venido - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20Emmanuel%20Has%20Come%20%28Instrumental%29.mp3` },
                    { name: 'Tiempo a Solas - Piano Pac\u00edfico', url: `${IA}/y-2mate.com-alone-with-god-3-hour-prayer-time-music-christian-meditation-music-p/y2mate.com%20-%20Time%20ALONE%20with%20GOD%20%203%20Hour%20Peaceful%20Music%20%20Meditation%20Music%20%20Prayer%20Music%20%20Relaxation%20Music.mp3` },
                ]
            },
            joyful: {
                label: 'Alegr\u00eda y Celebraci\u00f3n',
                tracks: [
                    { name: 'Un Rey Ha Nacido - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20A%20King%20Is%20Born%20%28Instrumental%29.mp3` },
                    { name: 'Celebra Su Nacimiento - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20Celebrate%20His%20Birth%20%28Instrumental%29.mp3` },
                    { name: 'Celebra Su Reinado - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20Celebrate%20His%20Reign%20%28Instrumental%29.mp3` },
                    { name: 'Escuchen los \u00c1ngeles - Don Moen', url: `${IA}/MaranathaLatinYoSeQueSiCristo_201811/Don%20Moen%20-%20Hark%20the%20Herald%20Angels%20Sing%20%28Instrumental%29.mp3` },
                ]
            }
        };
    }

    // Mood mapping for biblical topics
    getMoodForTopic(text) {
        const lower = text.toLowerCase();
        if (/oraci[oó]n|orar|clam[ao]|intercesi[oó]n|ayun[ao]/i.test(lower)) return 'prayer';
        if (/alegr[ií]a|gozo|celebra|fiesta|danz[ao]|canta|alaba/i.test(lower)) return 'joyful';
        if (/muerte|juicio|pecado|castigo|lament|dolor|sufr|cruz|sacrif/i.test(lower)) return 'solemn';
        if (/ador[ao]|gloria|santo|majestad|trono|cielo|resu[cr]it/i.test(lower)) return 'worship';
        return 'peaceful';
    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'ambient-player';
        this.container.innerHTML = `
            <button class="ambient-toggle" id="ambientToggle" title="M\u00fasica ambiente">&#9835;</button>
            <div class="ambient-panel" id="ambientPanel">
                <div class="ambient-header">M\u00fasica Ambiente</div>
                <div class="ambient-moods" id="ambientMoods"></div>
                <div class="ambient-now-section" id="ambientNowSection">
                    <div class="ambient-now-text" id="ambientNow"></div>
                    <div class="ambient-controls">
                        <button class="ambient-ctrl-btn" id="ambientPlayPause" title="Pausar">&#9208;</button>
                        <button class="ambient-ctrl-btn" id="ambientNext" title="Siguiente">&#9197;</button>
                        <button class="ambient-ctrl-btn" id="ambientShuffle" title="Aleatorio entre todos los temas">&#128256;</button>
                        <button class="ambient-ctrl-btn" id="ambientStop" title="Detener">&#9209;</button>
                        <button class="ambient-ctrl-btn ambient-mute-btn" id="ambientMute" title="Silenciar">&#128266;</button>
                    </div>
                </div>
                <div class="ambient-vol-row">
                    <span class="ambient-vol-icon">&#128264;</span>
                    <input type="range" class="ambient-vol" id="ambientVol" min="0" max="0.5" step="0.01" value="${this.audio.volume}">
                    <span class="ambient-vol-icon">&#128266;</span>
                    <span class="ambient-vol-pct" id="ambientVolPct">${Math.round(this.audio.volume / 0.5 * 100)}%</span>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);

        this.toggleBtn = this.container.querySelector('#ambientToggle');
        this.panel = this.container.querySelector('#ambientPanel');
        this.moodsEl = this.container.querySelector('#ambientMoods');
        this.nowEl = this.container.querySelector('#ambientNow');
        this.nowSection = this.container.querySelector('#ambientNowSection');
        this.volSlider = this.container.querySelector('#ambientVol');
        this.volPctEl = this.container.querySelector('#ambientVolPct');
        this.playPauseBtn  = this.container.querySelector('#ambientPlayPause');
        this.nextBtn       = this.container.querySelector('#ambientNext');
        this.shuffleBtn    = this.container.querySelector('#ambientShuffle');
        this.stopBtnEl     = this.container.querySelector('#ambientStop');
        this.muteBtn       = this.container.querySelector('#ambientMute');
        this._updateShuffleBtn();

        // Render mood buttons
        this.moodsEl.innerHTML = Object.entries(this.tracks).map(([key, cat]) =>
            `<button class="ambient-mood-btn" data-mood="${key}">${cat.label}</button>`
        ).join('');
    }

    bindEvents() {
        this._panelOpen = false;
        this._muted = false;
        this._savedMuteVol = 0;

        this.toggleBtn.addEventListener('click', () => {
            this._panelOpen = !this._panelOpen;
            this.panel.classList.toggle('open', this._panelOpen);
        });

        this.moodsEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.ambient-mood-btn');
            if (!btn) return;
            const mood = btn.dataset.mood;
            if (this.currentMood === mood && this.isPlaying) {
                this.stop();
            } else {
                this.playMood(mood);
            }
        });

        // Play/Pause
        this.playPauseBtn.addEventListener('click', () => {
            if (!this.isPlaying) return;
            if (this.audio.paused) {
                this.audio.play().catch(() => {});
                this.playPauseBtn.innerHTML = '\u23CF';
                this.playPauseBtn.title = 'Pausar';
                this.toggleBtn.classList.add('active');
            } else {
                this.audio.pause();
                this.playPauseBtn.innerHTML = '\u25B6';
                this.playPauseBtn.title = 'Reproducir';
                this.toggleBtn.classList.remove('active');
            }
        });

        // Next track
        this.nextBtn.addEventListener('click', () => {
            if (this.isPlaying || this.currentMood) this.nextTrack();
        });

        // Shuffle toggle
        this.shuffleBtn.addEventListener('click', () => {
            this.shuffleAll = !this.shuffleAll;
            localStorage.setItem('biblia_ambient_shuffle', this.shuffleAll);
            if (this.shuffleAll) this._buildShuffleQueue();
            this._updateShuffleBtn();
        });

        // Stop
        this.stopBtnEl.addEventListener('click', () => {
            this.stop();
        });

        // Mute/unmute
        this.muteBtn.addEventListener('click', () => {
            if (this._muted) {
                this.audio.volume = this._savedMuteVol;
                this.volSlider.value = this._savedMuteVol;
                this.muteBtn.innerHTML = '\u{1F50A}';
                this.muteBtn.title = 'Silenciar';
                this._muted = false;
            } else {
                this._savedMuteVol = this.audio.volume;
                this.audio.volume = 0;
                this.volSlider.value = 0;
                this.muteBtn.innerHTML = '\u{1F507}';
                this.muteBtn.title = 'Activar sonido';
                this._muted = true;
            }
            this.updateVolPct();
        });

        // Volume slider
        this.volSlider.addEventListener('input', () => {
            this.audio.volume = parseFloat(this.volSlider.value);
            localStorage.setItem('biblia_ambient_vol', this.audio.volume.toString());
            this._muted = this.audio.volume === 0;
            this.muteBtn.innerHTML = this._muted ? '\u{1F507}' : '\u{1F50A}';
            this.updateVolPct();
        });

        this.audio.addEventListener('error', () => {
            this.nextTrack();
        });

        // Auto-advance to next track when current ends
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
    }

    updateVolPct() {
        if (this.volPctEl) {
            this.volPctEl.textContent = Math.round(this.audio.volume / 0.5 * 100) + '%';
        }
    }

    playMood(mood, trackIdx) {
        this.currentMood = mood;
        const cat = this.tracks[mood];
        if (!cat || !cat.tracks.length) return;

        // If no explicit index given, start at random position
        if (trackIdx === undefined) {
            trackIdx = Math.floor(Math.random() * cat.tracks.length);
        }
        this.currentTrackIdx = trackIdx % cat.tracks.length;

        const track = cat.tracks[this.currentTrackIdx];
        this.audio.src = track.url;
        this.audio.play().catch(() => {});
        this.isPlaying = true;
        this.toggleBtn.classList.add('active');
        this.nowEl.textContent = track.name;
        this.nowSection.classList.add('visible');
        this.playPauseBtn.innerHTML = '\u23CF';
        this.playPauseBtn.title = 'Pausar';

        this.moodsEl.querySelectorAll('.ambient-mood-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mood === mood);
        });
    }

    nextTrack() {
        if (this.shuffleAll) {
            // Pick next from global shuffled queue
            this._shufflePos = (this._shufflePos + 1) % this._shuffleQueue.length;
            if (this._shufflePos === 0) this._buildShuffleQueue(); // re-shuffle when queue loops
            const t = this._shuffleQueue[this._shufflePos];
            this.playMood(t.mood, t.idx);
        } else {
            // Random within same mood (skip current)
            if (!this.currentMood) return;
            const cat = this.tracks[this.currentMood];
            this.currentTrackIdx = this._randomIdxExcluding(cat.tracks.length, this.currentTrackIdx);
            this.playMood(this.currentMood, this.currentTrackIdx);
        }
    }

    _updateShuffleBtn() {
        if (!this.shuffleBtn) return;
        this.shuffleBtn.style.opacity = this.shuffleAll ? '1' : '0.4';
        this.shuffleBtn.title = this.shuffleAll
            ? 'Aleatorio global (activo) — click para desactivar'
            : 'Aleatorio dentro del mood — click para modo global';
    }

    stop() {
        this.audio.pause();
        this.audio.src = '';
        this.isPlaying = false;
        this.currentMood = null;
        this.toggleBtn.classList.remove('active');
        this.nowEl.textContent = '';
        this.nowSection.classList.remove('visible');
        this.moodsEl.querySelectorAll('.ambient-mood-btn').forEach(btn => btn.classList.remove('active'));
    }

    // Called by BibliaBot to auto-play ambient for a topic
    autoPlay(text) {
        const mood = this.getMoodForTopic(text);
        if (!this.isPlaying) {
            this.playMood(mood);
        }
    }

    // Fade volume for TTS (lower when speaking, restore when done)
    fadeForSpeech() {
        if (!this.isPlaying) return;
        this._savedVol = this.audio.volume;
        this.audio.volume = Math.max(0.05, this.audio.volume * 0.3);
    }

    restoreAfterSpeech() {
        if (this._savedVol !== undefined) {
            this.audio.volume = this._savedVol;
            this._savedVol = undefined;
        }
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.bibliaAmbient = new BibliaAmbient();
    }, 800);
});
