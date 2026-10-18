// Service Worker - Biblia Interactiva RV1960
const CACHE_NAME = 'biblia-rv1960-v15';
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

// Install - cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch - cache first, then network
self.addEventListener('fetch', event => {
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
