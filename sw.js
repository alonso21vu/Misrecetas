const CACHE_NAME = 'recetario-cache-v1';
const urlsToCache = [
  '/MisRecetas/',
  '/MisRecetas/index.html',
  '/MisRecetas/app.js',
  '/MisRecetas/manifest.json',
  '/MisRecetas/icon-192.png',
  '/MisRecetas/icon-512.png',
  'https://cdn.tailwindcss.com'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/MisRecetas/index.html');
        }
      });
    })
  );
});