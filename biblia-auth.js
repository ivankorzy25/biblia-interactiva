// ============================================
// BIBLIA AUTH - Google Login + Ollama Cloud API
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
        this.ollamaKey = localStorage.getItem('biblia_ollama_key') || null;
        this.isReady = false;
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
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.setCustomParameters({ prompt: 'select_account' });

        this.auth.onAuthStateChanged(user => {
            this.user = user;
            this.isReady = true;

            if (user) {
                this.hideLoginOverlay();
                this.renderUserButton();
                this.ollamaKey = localStorage.getItem('biblia_ollama_key') || null;
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
                <div class="auth-error" id="authError"></div>
                <div class="auth-note">Tu cuenta es gratuita. Solo se usa para guardar tu progreso.</div>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('visible'));

        document.getElementById('authGoogleBtn').addEventListener('click', () => this.signInWithGoogle());
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
            <button class="user-dropdown-item" id="ddApiKey">&#128273; Mi API Key de Ollama</button>
            <button class="user-dropdown-item" id="ddUsage" onclick="window.open('https://ollama.com/settings','_blank')">&#128202; Ver mi uso</button>
            <div class="user-dropdown-divider"></div>
            <button class="user-dropdown-item danger" id="ddLogout">&#128682; Cerrar sesi&oacute;n</button>
        `;
        container.appendChild(dropdown);

        // Events
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.getElementById('ddApiKey').addEventListener('click', () => {
            this.closeDropdown();
            this.showKeyPanel();
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
    // ONBOARDING WIZARD
    // ==========================================
    showKeySetupWizard() {
        if (document.getElementById('wizardOverlay')) return;

        const name = this.user ? (this.user.displayName || 'Usuario').split(' ')[0] : 'Usuario';

        const overlay = document.createElement('div');
        overlay.id = 'wizardOverlay';
        overlay.className = 'wizard-overlay';
        overlay.innerHTML = `
            <div class="wizard-modal">
                <div class="wizard-stepper">
                    <div class="wizard-step-dot active" data-step="0"></div>
                    <div class="wizard-step-dot" data-step="1"></div>
                    <div class="wizard-step-dot" data-step="2"></div>
                    <div class="wizard-step-dot" data-step="3"></div>
                </div>

                <!-- Step 0: Welcome -->
                <div class="wizard-step-content active" data-step="0">
                    <div class="wizard-title">&iexcl;Bienvenido/a, ${name}! &#128075;</div>
                    <div class="wizard-text">Para usar el Asistente B&iacute;blico con IA necesit&aacute;s tu propia cuenta gratuita de Ollama. Esto significa que:</div>
                    <ul class="wizard-features">
                        <li><span class="check">&#10003;</span> Us&aacute;s tus propios cr&eacute;ditos gratuitos (no los de nadie m&aacute;s)</li>
                        <li><span class="check">&#10003;</span> Tu privacidad est&aacute; protegida (las conversaciones van directo a Ollama)</li>
                        <li><span class="check">&#10003;</span> Es 100% gratis para uso personal</li>
                        <li><span class="check">&#10003;</span> El proceso tarda menos de 2 minutos</li>
                    </ul>
                    <button class="wizard-btn-primary" id="wizStep0Next">Empezar &#8594;</button>
                </div>

                <!-- Step 1: Create Ollama account -->
                <div class="wizard-step-content" data-step="1">
                    <div class="wizard-title">Paso 1 de 3: Crear tu cuenta en Ollama</div>
                    <div class="wizard-highlight-box">
                        <span class="box-icon">&#127760;</span>
                        <span>Ollama es el servicio de IA que alimenta el Asistente B&iacute;blico. Te da acceso GRATUITO a modelos de IA muy potentes.</span>
                    </div>
                    <button class="wizard-btn-secondary" onclick="window.open('https://ollama.com/signin','_blank')">&#128279; Abrir Ollama.com</button>
                    <ol class="wizard-instructions">
                        <li><span class="step-icon">&#128433;</span> Hac&eacute; click en &ldquo;Sign in&rdquo; &rarr; &ldquo;Sign up with Google&rdquo;</li>
                        <li><span class="step-icon">&#10003;</span> Us&aacute; la misma cuenta Google con la que entraste ac&aacute;</li>
                        <li><span class="step-icon">&#10024;</span> &iexcl;Listo! Ya ten&eacute;s tu cuenta</li>
                    </ol>
                    <label class="wizard-checkbox">
                        <input type="checkbox" id="wizCreatedAccount">
                        Ya cre&eacute; mi cuenta en Ollama
                    </label>
                    <button class="wizard-btn-primary" id="wizStep1Next" disabled>Siguiente &#8594;</button>
                </div>

                <!-- Step 2: Get API Key -->
                <div class="wizard-step-content" data-step="2">
                    <div class="wizard-title">Paso 2 de 3: Generar tu API Key</div>
                    <button class="wizard-btn-secondary" onclick="window.open('https://ollama.com/settings/keys','_blank')">&#128273; Ir a mis API Keys</button>
                    <ol class="wizard-instructions">
                        <li><span class="step-icon">&#128433;</span> Hac&eacute; click en &ldquo;Add API Key&rdquo;</li>
                        <li>
                            <span class="step-icon">&#128221;</span>
                            <span>En el nombre escrib&iacute;: <strong>biblia</strong>
                            <button class="wizard-btn-copy" id="wizCopyName">Copiar nombre</button></span>
                        </li>
                        <li><span class="step-icon">&#128274;</span> Hac&eacute; click en &ldquo;Create&rdquo;</li>
                        <li>
                            <span class="step-icon">&#128203;</span>
                            <span>Copi&aacute; la clave generada<br>&#9888;&#65039; <em>Importante: Solo la ver&aacute;s una vez. Copiala ahora.</em></span>
                        </li>
                    </ol>
                    <div class="wizard-key-input-wrapper">
                        <input type="password" class="wizard-key-input" id="wizKeyInput" placeholder="Peg&aacute; tu API Key ac&aacute; (ej: 1015cd95b2684f5898...)">
                        <button class="wizard-key-toggle" id="wizKeyToggle">&#128065;</button>
                    </div>
                    <button class="wizard-btn-primary" id="wizVerifyKey">Verificar y Guardar &#8594;</button>
                    <div class="wizard-error" id="wizKeyError"></div>
                    <div class="wizard-warning" id="wizKeyWarning">
                        <span>&#9888;&#65039; No se pudo verificar la clave. &iquest;Guardamos igual?</span>
                        <button class="wizard-btn-primary" id="wizSaveAnyway" style="font-size:14px;padding:10px">Guardar de todos modos</button>
                    </div>
                </div>

                <!-- Step 3: Done! -->
                <div class="wizard-step-content" data-step="3">
                    <div class="wizard-success-check">&#9989;</div>
                    <div class="wizard-title">&iexcl;Ya est&aacute; configurado! &#127881;</div>
                    <div class="wizard-text">Tu Asistente B&iacute;blico ahora usa tu cuenta personal de Ollama. Ten&eacute;s acceso gratuito a modelos de IA potentes.</div>
                    <div class="wizard-status-box">
                        <div class="wizard-status-row">&#128994; Sesi&oacute;n: <strong id="wizStatusName"></strong></div>
                        <div class="wizard-status-row">&#128273; API Key: <strong id="wizStatusKey"></strong></div>
                        <div class="wizard-status-row">&#10003; Verificada correctamente</div>
                    </div>
                    <div class="wizard-usage-note">
                        Ollama te da l&iacute;mites semanales y por sesi&oacute;n gratuitos. Pod&eacute;s ver tu uso en cualquier momento desde tu perfil.
                    </div>
                    <button class="wizard-btn-primary" id="wizOpenBot">&#128214; Abrir el Asistente B&iacute;blico</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('visible'));

        this.wizardStep = 0;
        this.bindWizardEvents();
    }

    bindWizardEvents() {
        // Step 0 → 1
        document.getElementById('wizStep0Next')?.addEventListener('click', () => this.goToWizardStep(1));

        // Step 1: checkbox enables next
        const cb = document.getElementById('wizCreatedAccount');
        const nextBtn = document.getElementById('wizStep1Next');
        cb?.addEventListener('change', () => { if (nextBtn) nextBtn.disabled = !cb.checked; });
        nextBtn?.addEventListener('click', () => this.goToWizardStep(2));

        // Step 2: copy name
        document.getElementById('wizCopyName')?.addEventListener('click', () => {
            navigator.clipboard.writeText('biblia').then(() => {
                const btn = document.getElementById('wizCopyName');
                if (btn) { btn.textContent = '¡Copiado!'; setTimeout(() => btn.textContent = 'Copiar nombre', 1500); }
            });
        });

        // Toggle password visibility
        document.getElementById('wizKeyToggle')?.addEventListener('click', () => {
            const input = document.getElementById('wizKeyInput');
            if (!input) return;
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            document.getElementById('wizKeyToggle').textContent = isPass ? '🙈' : '👁';
        });

        // Verify key
        document.getElementById('wizVerifyKey')?.addEventListener('click', () => this.verifyAndSaveKey());

        // Save anyway (network error)
        document.getElementById('wizSaveAnyway')?.addEventListener('click', () => {
            const key = document.getElementById('wizKeyInput')?.value?.trim();
            if (key) {
                this.saveOllamaKey(key);
                this.goToWizardStep(3);
            }
        });

        // Step 3: open bot
        document.getElementById('wizOpenBot')?.addEventListener('click', () => {
            this.closeWizard();
            // Open bot if available
            if (window.bibliaBot && !window.bibliaBot.isOpen) {
                const fab = document.getElementById('botFab');
                if (fab) fab.click();
            }
        });
    }

    goToWizardStep(step) {
        this.wizardStep = step;

        // Update dots
        document.querySelectorAll('.wizard-step-dot').forEach(dot => {
            const s = parseInt(dot.dataset.step);
            dot.classList.toggle('active', s === step);
            dot.classList.toggle('done', s < step);
        });

        // Show/hide steps
        document.querySelectorAll('.wizard-step-content').forEach(el => {
            el.classList.toggle('active', parseInt(el.dataset.step) === step);
        });

        // Step 3: fill status
        if (step === 3) {
            const nameEl = document.getElementById('wizStatusName');
            const keyEl = document.getElementById('wizStatusKey');
            if (nameEl) nameEl.textContent = this.user?.displayName || 'Usuario';
            if (keyEl && this.ollamaKey) {
                keyEl.textContent = '••••••••' + this.ollamaKey.slice(-6);
            }
        }
    }

    async verifyAndSaveKey() {
        const input = document.getElementById('wizKeyInput');
        const btn = document.getElementById('wizVerifyKey');
        const errEl = document.getElementById('wizKeyError');
        const warnEl = document.getElementById('wizKeyWarning');
        const key = input?.value?.trim();

        if (!key) {
            if (errEl) { errEl.textContent = '❌ Ingresá tu API Key.'; errEl.classList.add('visible'); }
            return;
        }

        if (errEl) errEl.classList.remove('visible');
        if (warnEl) warnEl.classList.remove('visible');
        if (btn) { btn.disabled = true; btn.innerHTML = '<div class="auth-spinner"></div> Verificando tu clave...'; }

        try {
            const res = await fetch('https://ollama.com/api/tags', {
                headers: { 'Authorization': `Bearer ${key}` }
            });

            if (res.ok) {
                this.saveOllamaKey(key);
                this.goToWizardStep(3);
            } else if (res.status === 401 || res.status === 403) {
                if (errEl) {
                    errEl.textContent = '❌ La clave no es válida. Verificá que la copiaste completa.';
                    errEl.classList.add('visible');
                }
            } else {
                // Unexpected status, offer save anyway
                if (warnEl) warnEl.classList.add('visible');
            }
        } catch (e) {
            // Network error — offer save anyway
            console.warn('Key verification network error:', e);
            if (warnEl) warnEl.classList.add('visible');
        }

        if (btn) { btn.disabled = false; btn.innerHTML = 'Verificar y Guardar →'; }
    }

    saveOllamaKey(key) {
        this.ollamaKey = key;
        localStorage.setItem('biblia_ollama_key', key);
    }

    closeWizard() {
        const overlay = document.getElementById('wizardOverlay');
        if (!overlay) return;
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 300);
    }

    // ==========================================
    // API KEY PANEL (from header dropdown)
    // ==========================================
    showKeyPanel() {
        if (document.getElementById('keyPanelOverlay')) return;

        const maskedKey = this.ollamaKey
            ? '••••••••' + this.ollamaKey.slice(-6)
            : 'No configurada';

        const overlay = document.createElement('div');
        overlay.id = 'keyPanelOverlay';
        overlay.className = 'key-panel-overlay';
        overlay.innerHTML = `
            <div class="key-panel" style="position:relative">
                <button class="key-panel-close" id="keyPanelClose">&#10005;</button>
                <div class="key-panel-title">&#128273; Mi API Key de Ollama</div>
                <div class="key-panel-current">${maskedKey}</div>
                <div class="key-panel-actions">
                    ${this.ollamaKey ? `<button class="key-panel-btn" id="kpCopyKey">&#128203; Copiar key completa</button>` : ''}
                    <button class="key-panel-btn" id="kpChangeKey">&#128260; ${this.ollamaKey ? 'Cambiar' : 'Configurar'} mi API Key</button>
                    <button class="key-panel-btn" onclick="window.open('https://ollama.com/settings','_blank')">&#128202; Ver mi uso en Ollama</button>
                </div>
                <div class="key-panel-note">Tu API key se guarda solo en este dispositivo/navegador.</div>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('visible'));

        // Events
        document.getElementById('keyPanelClose')?.addEventListener('click', () => this.closeKeyPanel());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this.closeKeyPanel(); });

        document.getElementById('kpCopyKey')?.addEventListener('click', () => {
            if (this.ollamaKey) {
                navigator.clipboard.writeText(this.ollamaKey).then(() => {
                    const btn = document.getElementById('kpCopyKey');
                    if (btn) { btn.textContent = '✅ ¡Copiada!'; setTimeout(() => btn.innerHTML = '📋 Copiar key completa', 1500); }
                });
            }
        });

        document.getElementById('kpChangeKey')?.addEventListener('click', () => {
            this.closeKeyPanel();
            this.showKeySetupWizard();
            // Jump to step 2 directly
            setTimeout(() => this.goToWizardStep(2), 100);
        });
    }

    closeKeyPanel() {
        const overlay = document.getElementById('keyPanelOverlay');
        if (!overlay) return;
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 200);
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
