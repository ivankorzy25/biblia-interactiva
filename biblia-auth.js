// ============================================
// BIBLIA AUTH - Google Login
// ============================================
/*
 * CONFIGURACIÓN NECESARIA:
 *
 * 1. Ir a https://console.firebase.google.com
 * 2. Crear proyecto nuevo: "biblia-kor" (o usar uno existente)
 * 3. Agregar app Web (</> ícono)
 * 4. Copiar firebaseConfig y reemplazar en FIREBASE_CONFIG abajo
 * 5. En Authentication → Sign-in method → habilitar "Google"
 * 6. En Authentication → Settings → Authorized domains → agregar "biblia.kor.com.ar"
 * 7. (Opcional para sync) Crear Firestore Database en modo producción
 *    Reglas de Firestore:
 *    rules_version = '2';
 *    service cloud.firestore {
 *      match /databases/{database}/documents {
 *        match /users/{userId}/{document=**} {
 *          allow read, write: if request.auth != null && request.auth.uid == userId;
 *        }
 *      }
 *    }
 */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDk1yFbRPiLbAR_WeiZPwmmZYuCk4nrl9E",
    authDomain: "biblia-kor.firebaseapp.com",
    projectId: "biblia-kor",
    storageBucket: "biblia-kor.firebasestorage.app",
    messagingSenderId: "910835536540",
    appId: "1:910835536540:web:787723fab36812185cd359",
    measurementId: "G-6R8YSWV6QT"
};

class BibliaAuth {
    constructor() {
        this.user = null;
        this.isReady = false;
        // La IA ahora usa las claves del servidor; borrar la que haya quedado guardada
        try { localStorage.removeItem('biblia_ollama_key'); } catch (e) {}
        this.dropdownOpen = false;

        try {
            this.initFirebase();
        } catch (err) {
            console.error('BibliaAuth: Firebase init failed', err);
            this.isReady = true;
        }
    }

    // ==========================================
    // FIREBASE INIT
    // ==========================================
    initFirebase() {
        if (typeof firebase === 'undefined') {
            console.warn('BibliaAuth: Firebase SDK not loaded, auth disabled');
            this.isReady = true;
            return;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.setCustomParameters({ prompt: 'select_account' });

        // Detect Android WebView (popup auth doesn't work there)
        this._isAndroidWebView = /BibliaInteractiva/.test(navigator.userAgent);

        // Handle redirect result (for Android WebView which uses signInWithRedirect)
        if (this._isAndroidWebView) {
            this.auth.getRedirectResult().catch(err => {
                if (err.code !== 'auth/no-auth-event') {
                    console.error('Redirect result error:', err);
                }
            });
        }

        this.auth.onAuthStateChanged(async (user) => {
            this.user = user;
            this.isReady = true;

            if (user) {
                this.hideLoginOverlay();
                this.renderUserButton();
            } else {
                this.removeUserButton();
                this.showLoginOverlay();
            }
        });
    }

    // ==========================================
    // LOGIN OVERLAY
    // ==========================================
    showLoginOverlay() {
        if (document.getElementById('authOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'authOverlay';
        overlay.className = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-modal">
                <div class="auth-logo">&#128214;</div>
                <div class="auth-title">Biblia Interactiva RV1960</div>
                <div class="auth-subtitle">Inici&aacute; sesi&oacute;n para guardar tus notas, favoritos y acceder al Asistente B&iacute;blico con IA</div>
                <button class="auth-google-btn" id="authGoogleBtn">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuar con Google
                </button>

                <div class="auth-divider"><span>o</span></div>

                <div class="auth-email-form" id="authEmailForm">
                    <input type="email" class="auth-email-input" id="authEmailInput" placeholder="Email" autocomplete="email">
                    <input type="password" class="auth-email-input" id="authPasswordInput" placeholder="Contrase&ntilde;a (m&iacute;n. 6 caracteres)" autocomplete="current-password">
                    <button class="auth-email-btn" id="authEmailBtn">Iniciar sesi&oacute;n</button>
                    <button class="auth-email-toggle" id="authEmailToggle">No ten&eacute;s cuenta? <strong>Registrate</strong></button>
                </div>

                <div class="auth-error" id="authError"></div>
                <div class="auth-note">Tu cuenta es gratuita. Solo se usa para guardar tu progreso.</div>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('visible'));

        document.getElementById('authGoogleBtn').addEventListener('click', () => this.signInWithGoogle());

        // Email/Password login
        this._emailIsRegister = false;
        document.getElementById('authEmailBtn')?.addEventListener('click', () => this.signInWithEmail());
        document.getElementById('authEmailToggle')?.addEventListener('click', () => {
            this._emailIsRegister = !this._emailIsRegister;
            const btn = document.getElementById('authEmailBtn');
            const toggle = document.getElementById('authEmailToggle');
            if (btn) btn.textContent = this._emailIsRegister ? 'Crear cuenta' : 'Iniciar sesi\u00f3n';
            if (toggle) toggle.innerHTML = this._emailIsRegister
                ? 'Ya ten\u00e9s cuenta? <strong>Inici\u00e1 sesi\u00f3n</strong>'
                : 'No ten\u00e9s cuenta? <strong>Registrate</strong>';
        });
        document.getElementById('authPasswordInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.signInWithEmail();
        });
    }

    hideLoginOverlay() {
        const overlay = document.getElementById('authOverlay');
        if (!overlay) return;
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 300);
    }

    async signInWithGoogle() {
        const btn = document.getElementById('authGoogleBtn');
        const errEl = document.getElementById('authError');
        if (!btn) return;

        btn.classList.add('loading');
        btn.innerHTML = '<div class="auth-spinner"></div> Conectando...';
        if (errEl) errEl.classList.remove('visible');

        try {
            // Android WebView: use redirect (popup doesn't work in WebView)
            if (this._isAndroidWebView) {
                await this.auth.signInWithRedirect(this.provider);
                return;
            }
            await this.auth.signInWithPopup(this.provider);
        } catch (err) {
            console.error('Auth popup error:', err);
            if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
                try {
                    await this.auth.signInWithRedirect(this.provider);
                    return;
                } catch (redirectErr) {
                    this.showAuthError('No se pudo iniciar sesión. Intentá de nuevo.');
                }
            } else if (err.code === 'auth/cancelled-popup-request') {
                // User cancelled, do nothing
            } else {
                this.showAuthError('Error al iniciar sesión: ' + (err.message || 'Intentá de nuevo'));
            }

            btn.classList.remove('loading');
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
            `;
        }
    }

    async signInWithEmail() {
        const emailEl = document.getElementById('authEmailInput');
        const passEl = document.getElementById('authPasswordInput');
        const btn = document.getElementById('authEmailBtn');
        const errEl = document.getElementById('authError');
        const email = emailEl?.value?.trim();
        const pass = passEl?.value;

        if (!email || !pass) {
            this.showAuthError('Complet\u00e1 email y contrase\u00f1a.');
            return;
        }
        if (pass.length < 6) {
            this.showAuthError('La contrase\u00f1a debe tener al menos 6 caracteres.');
            return;
        }

        if (errEl) errEl.classList.remove('visible');
        const origText = btn?.textContent;
        if (btn) { btn.disabled = true; btn.innerHTML = '<div class="auth-spinner"></div> Conectando...'; }

        try {
            if (this._emailIsRegister) {
                await this.auth.createUserWithEmailAndPassword(email, pass);
            } else {
                await this.auth.signInWithEmailAndPassword(email, pass);
            }
        } catch (err) {
            console.error('Email auth error:', err);
            const msgs = {
                'auth/user-not-found': 'No existe una cuenta con ese email. Registrate primero.',
                'auth/wrong-password': 'Contrase\u00f1a incorrecta.',
                'auth/invalid-credential': 'Email o contrase\u00f1a incorrectos.',
                'auth/email-already-in-use': 'Ya existe una cuenta con ese email. Inici\u00e1 sesi\u00f3n.',
                'auth/invalid-email': 'El email no es v\u00e1lido.',
                'auth/weak-password': 'La contrase\u00f1a es muy d\u00e9bil (m\u00edn. 6 caracteres).',
                'auth/too-many-requests': 'Demasiados intentos. Esper\u00e1 un momento.',
            };
            this.showAuthError(msgs[err.code] || 'Error: ' + (err.message || 'Intent\u00e1 de nuevo'));
            if (btn) { btn.disabled = false; btn.textContent = origText; }
        }
    }

    showAuthError(msg) {
        const errEl = document.getElementById('authError');
        if (errEl) {
            errEl.textContent = msg;
            errEl.classList.add('visible');
        }
    }

    // ==========================================
    // USER BUTTON (Header)
    // ==========================================
    renderUserButton() {
        this.removeUserButton();
        const container = document.getElementById('authContainer');
        if (!container || !this.user) return;

        const firstName = (this.user.displayName || 'Usuario').split(' ')[0];
        const photo = this.user.photoURL || '';

        const btn = document.createElement('button');
        btn.className = 'user-btn';
        btn.id = 'userBtn';
        btn.innerHTML = `
            ${photo ? `<img class="user-avatar" src="${photo}" alt="${firstName}" referrerpolicy="no-referrer">` : ''}
            <span class="user-name">${firstName}</span>
        `;
        container.appendChild(btn);

        // Dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.id = 'userDropdown';
        dropdown.innerHTML = `
            <div class="user-dropdown-header">
                ${photo ? `<img class="user-dropdown-avatar" src="${photo}" alt="" referrerpolicy="no-referrer">` : ''}
                <div class="user-dropdown-info">
                    <div class="user-dropdown-name">${this.user.displayName || 'Usuario'}</div>
                    <div class="user-dropdown-email">${this.user.email || ''}</div>
                </div>
            </div>
            <div class="user-dropdown-divider"></div>
            <button class="user-dropdown-item danger" id="ddLogout">&#128682; Cerrar sesi&oacute;n</button>
        `;
        container.appendChild(dropdown);

        // Events
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.getElementById('ddLogout').addEventListener('click', () => {
            this.closeDropdown();
            this.signOut();
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) this.closeDropdown();
        });
    }

    removeUserButton() {
        const container = document.getElementById('authContainer');
        if (container) container.innerHTML = '';
    }

    toggleDropdown() {
        const dd = document.getElementById('userDropdown');
        if (!dd) return;
        this.dropdownOpen = !this.dropdownOpen;
        dd.classList.toggle('open', this.dropdownOpen);
    }

    closeDropdown() {
        const dd = document.getElementById('userDropdown');
        if (dd) dd.classList.remove('open');
        this.dropdownOpen = false;
    }

    async signOut() {
        try {
            await this.auth.signOut();
        } catch (err) {
            console.error('Sign out error:', err);
        }
    }

    // ==========================================
    // TOKEN DE SESIÓN (para /api/chat)
    // ==========================================
    async getIdToken() {
        if (!this.user) return null;
        try {
            return await this.user.getIdToken();
        } catch (err) {
            console.warn('BibliaAuth: no se pudo obtener el token', err.message);
            return null;
        }
    }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.bibliaAuth = new BibliaAuth();
    } catch (err) {
        console.error('BibliaAuth failed to initialize:', err);
    }
});
