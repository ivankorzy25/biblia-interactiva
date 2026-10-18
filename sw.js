// Service Worker - Biblia Interactiva RV1960
const CACHE_NAME = 'biblia-rv1960-v17';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './biblia-app.js',
    './biblia-data.js',
    './biblia-referencias.js',
    './biblia-titulos.js',
    './biblia-jesus-words.js',
    './biblia-comentario.js',
    './biblia-comentario.css',
    './biblia-bot.js',
    './biblia-bot.css',
    './biblia-auth.js',
    './biblia-auth.css',
    './biblia-ambient.js',
    './biblia-ambient.css',
    './biblia-videos.js',
    './biblia-videos.css',
    './biblia-calendar.js',
    './biblia-calendar.css',
    './biblia-recursos.js',
    './biblia-recursos.css',
    './biblia-context.js',
    './biblia-context.css',
    './biblia-versiones.js',
    './biblia-versiones.css',
    './biblia-timeline-data.js',
    './biblia-images-data.js',
    './biblia-infographics-data.js',
    './biblia-youversion.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install - cache all assets (salteando la caché HTTP para no guardar versiones viejas)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' }))))
            .then(() => self.skipWaiting())
    );
});

// Activate - clean old caches; si venía de una versión anterior, recargar las pestañas abiertas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            const old = keys.filter(key => key !== CACHE_NAME);
            return Promise.all(old.map(key => caches.delete(key)))
                .then(() => self.clients.claim())
                .then(() => old.length ? self.clients.matchAll({ type: 'window' }) : [])
                .then(clients => clients.forEach(client => client.navigate(client.url).catch(() => {})));
        })
    );
});

// Fetch - páginas: red primero (un deploy nuevo se ve al instante); resto: cache first, then network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(response => {
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return response;
            }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./')))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) {
                    // Return cache but update in background
                    const fetchPromise = fetch(event.request).then(response => {
                        if (response && response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    }).catch(() => {});
                    return cached;
                }
                return fetch(event.request).then(response => {
                    if (response && response.status === 200 && event.request.method === 'GET') {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                });
            })
    );
});
