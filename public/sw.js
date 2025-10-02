const CACHE_NAME = 'vigilance-v2';
const urlsToCache = [
  '/',
  '/login/',
  '/dashboard/',
  '/manifest.json',
  '/logoi.png',
  '/user.png',
  '/homename.png',
  '/ic_baseline-home.png',
  '/mage_dashboard-fill.png',
  '/bxs_user.png',
  '/mdi_cog.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});