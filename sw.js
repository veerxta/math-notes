/**
 * Math Notes — Offline-First Service Worker
 * Strategi Caching:
 * - Pre-cache: shell aplikasi lokal, daftar mata kuliah, manifest, ikon, dan aset inti KaTeX CDN.
 * - Cache-First: semua aset dari cdn.jsdelivr.net (KaTeX CSS, JS, dan seluruh font .woff2/.woff/.ttf).
 * - Stale-While-Revalidate: semua halaman HTML, CSS, dan JS lokal.
 */

'use strict';

const STATIC_CACHE = 'math-notes-static-v1';
const CDN_CACHE = 'math-notes-cdn-v1';
const ACTIVE_CACHES = [STATIC_CACHE, CDN_CACHE];

const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './courses/analisis-real/index.html',
  './courses/aljabar-linear/index.html',
  './courses/aljabar-linear/bab-1-ruang-vektor.html'
];

const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(function (cache) {
        return cache.addAll(LOCAL_ASSETS);
      }),
      caches.open(CDN_CACHE).then(function (cache) {
        return Promise.all(
          CDN_ASSETS.map(function (url) {
            return fetch(url, { mode: 'cors' })
              .then(function (response) {
                if (response && (response.ok || response.type === 'opaque')) {
                  return cache.put(url, response);
                }
                return null;
              })
              .catch(function () {
                return null;
              });
          })
        );
      })
    ]).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            return !ACTIVE_CACHES.includes(name);
          })
          .map(function (oldName) {
            return caches.delete(oldName);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/**
 * Cache-First untuk cdn.jsdelivr.net (KaTeX CSS, JS, dan font .woff2)
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
    await cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

/**
 * Stale-While-Revalidate untuk file HTML/CSS/JS lokal
 */
async function staleWhileRevalidate(event, cacheName) {
  const request = event.request;
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const networkPromise = fetch(request)
    .then(function (networkResponse) {
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(function () {
      return null;
    });

  event.waitUntil(networkPromise);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  if (request.mode === 'navigate') {
    const fallback = await cache.match('./index.html');
    if (fallback) {
      return fallback;
    }
  }

  return new Response('Offline — konten belum tersimpan di cache.', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(cacheFirst(event.request, CDN_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event, STATIC_CACHE));
  }
});
