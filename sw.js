/**
 * Math Notes — Offline-First Service Worker
 * Strategi Caching:
 * - Pre-cache: shell aplikasi lokal, daftar mata kuliah, manifest, ikon, dan aset inti KaTeX CDN.
 * - Cache-First: semua aset dari cdn.jsdelivr.net (KaTeX CSS, JS, dan seluruh font .woff2/.woff/.ttf).
 * - Stale-While-Revalidate: semua halaman HTML, CSS, dan JS lokal.
 */

'use strict';

const STATIC_CACHE = 'math-notes-static-v4';
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
  './courses/linear-algebra/index.html',
  './courses/linear-algebra/bab-1-ruang-vektor.html',
  './courses/multivariable-calculus/index.html',
  './courses/multivariable-calculus/bab-1-fungsi-dua-peubah-dan-limit.html',
  './courses/multivariable-calculus/bab-2-turunan-parsial-dan-aplikasinya.html',
  './courses/multivariable-calculus/bab-3-integral-lipat-dan-aplikasinya.html',
  './courses/systems-mathematics/index.html',
  './courses/numerical-methods/index.html',
  './courses/operations-research-1/index.html',
  './courses/simulation-techniques/index.html'
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
 * Mencocokkan request di cache dengan mengabaikan query string,
 * serta menangani path direktori yang berakhiran '/' menuju 'index.html'.
 */
async function matchInCache(cache, request) {
  const directMatch = await cache.match(request, { ignoreSearch: true });
  if (directMatch) {
    return directMatch;
  }

  try {
    const url = new URL(request.url);
    if (url.pathname.endsWith('/')) {
      const indexUrl = new URL(url.pathname + 'index.html', url.origin);
      return await cache.match(indexUrl.href, { ignoreSearch: true });
    }
  } catch (_) {
    // Abaikan jika URL tidak valid
  }

  return null;
}

/**
 * Halaman HTML5 standalone saat navigasi gagal dalam kondisi offline
 */
function offlineFallbackResponse() {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline — Math Notes</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #faf8f5;
      color: #1e2024;
    }
    @media (prefers-color-scheme: dark) {
      body { background: #121418; color: #e5e7eb; }
      .card { background: #1e222a; border-color: #2b303c; }
      p { color: #adb5bd; }
    }
    .card {
      max-width: 460px;
      padding: 1.75rem;
      border-radius: 10px;
      background: #ffffff;
      border: 1px solid #dfdbd2;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    }
    h1 { margin: 0 0 0.75rem; font-size: 1.35rem; }
    p { margin: 0 0 1.25rem; line-height: 1.6; color: #4a4f58; }
    button {
      background: #2563eb;
      color: #ffffff;
      border: 0;
      border-radius: 6px;
      padding: 0.6rem 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>Halaman Belum Tersedia Offline</h1>
    <p>Koneksi internet sedang terputus dan halaman ini belum tersimpan di cache lokal Math Notes.</p>
    <button type="button" onclick="history.back()">← Kembali ke Halaman Sebelumnya</button>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Cache-First untuk cdn.jsdelivr.net (KaTeX CSS, JS, dan font .woff2)
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request, { ignoreSearch: true });

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_) {
    return new Response('', {
      status: 504,
      statusText: 'Offline'
    });
  }
}

/**
 * Stale-While-Revalidate untuk file HTML/CSS/JS lokal
 */
async function staleWhileRevalidate(event, cacheName) {
  const request = event.request;
  const cache = await caches.open(cacheName);
  const cachedResponse = await matchInCache(cache, request);

  const networkPromise = fetch(request)
    .then(function (networkResponse) {
      if (networkResponse && networkResponse.ok) {
        return cache.put(request, networkResponse.clone()).then(function () {
          return networkResponse;
        });
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
    return offlineFallbackResponse();
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
