// ============================================
// BIBLIA AMBIENT MUSIC - Background Player
// Streams royalty-free worship music by mood
// ============================================

class BibliaAmbient {
    constructor() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = parseFloat(localStorage.getItem('biblia_ambient_vol') || '0.25');
        this.isPlaying = false;
        this.currentMood = null;
        this.currentTrackIdx = 0;
        this.tracks = this.buildPlaylist();
        this.render();
        this.bindEvents();
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
                <div class="ambient-now" id="ambientNow"></div>
                <div class="ambient-vol-row">
                    <span class="ambient-vol-icon">&#128264;</span>
                    <input type="range" class="ambient-vol" id="ambientVol" min="0" max="0.5" step="0.01" value="${this.audio.volume}">
                    <span class="ambient-vol-icon">&#128266;</span>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);

        this.toggleBtn = this.container.querySelector('#ambientToggle');
        this.panel = this.container.querySelector('#ambientPanel');
        this.moodsEl = this.container.querySelector('#ambientMoods');
        this.nowEl = this.container.querySelector('#ambientNow');
        this.volSlider = this.container.querySelector('#ambientVol');

        // Render mood buttons
        this.moodsEl.innerHTML = Object.entries(this.tracks).map(([key, cat]) =>
            `<button class="ambient-mood-btn" data-mood="${key}">${cat.label}</button>`
        ).join('');
    }

    bindEvents() {
        let panelOpen = false;
        this.toggleBtn.addEventListener('click', () => {
            panelOpen = !panelOpen;
            this.panel.classList.toggle('open', panelOpen);
            this.toggleBtn.classList.toggle('active', this.isPlaying);
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

        this.volSlider.addEventListener('input', () => {
            this.audio.volume = parseFloat(this.volSlider.value);
            localStorage.setItem('biblia_ambient_vol', this.audio.volume.toString());
        });

        this.audio.addEventListener('error', () => {
            // Try next track on error
            this.nextTrack();
        });
    }

    playMood(mood, trackIdx = 0) {
        this.currentMood = mood;
        this.currentTrackIdx = trackIdx;
        const cat = this.tracks[mood];
        if (!cat || !cat.tracks.length) return;

        const track = cat.tracks[trackIdx % cat.tracks.length];
        this.audio.src = track.url;
        this.audio.play().catch(() => {});
        this.isPlaying = true;
        this.toggleBtn.classList.add('active');
        this.nowEl.textContent = track.name;

        // Highlight active mood button
        this.moodsEl.querySelectorAll('.ambient-mood-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mood === mood);
        });
    }

    nextTrack() {
        if (!this.currentMood) return;
        const cat = this.tracks[this.currentMood];
        this.currentTrackIdx = (this.currentTrackIdx + 1) % cat.tracks.length;
        this.playMood(this.currentMood, this.currentTrackIdx);
    }

    stop() {
        this.audio.pause();
        this.audio.src = '';
        this.isPlaying = false;
        this.currentMood = null;
        this.toggleBtn.classList.remove('active');
        this.nowEl.textContent = '';
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
