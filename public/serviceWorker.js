
// Service worker to prevent caching
const CACHE_NAME = 'hotels-sifnos-cache-' + Date.now();

// Install event
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing new service worker...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating new service worker...');
  
  // Delete all caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('[ServiceWorker] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  
  // Claim all clients so the new service worker takes effect immediately
  self.clients.claim();
});

// Fetch event - force network-first approach and prevent caching
self.addEventListener('fetch', event => {
  // Add cache busting parameter to all URLs
  const url = new URL(event.request.url);
  
  // Don't modify requests to other domains
  if (url.origin === self.location.origin) {
    // Add cache busting for non-API requests
    if (!url.pathname.includes('/api/') && 
        !url.pathname.includes('/functions/') &&
        !url.pathname.endsWith('.woff2') &&
        !url.pathname.endsWith('.woff') &&
        !url.pathname.endsWith('.ttf')) {
      
      // Add or replace cache busting parameter
      url.searchParams.set('_sw_cache_bust', Date.now() + '-' + Math.random());
      
      // Create a new request with the modified URL
      const modifiedRequest = new Request(url.href, {
        method: event.request.method,
        headers: event.request.headers,
        mode: event.request.mode,
        credentials: event.request.credentials,
        redirect: event.request.redirect
      });
      
      event.respondWith(
        fetch(modifiedRequest, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        .catch(error => {
          console.error('[ServiceWorker] Fetch failed:', error);
          // Fall back to original request if fetch fails
          return fetch(event.request);
        })
      );
    } else {
      // For API requests or font files, just use network-first with no caching
      event.respondWith(
        fetch(event.request, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        .catch(error => {
          console.error('[ServiceWorker] Fetch failed:', error);
          return new Response('Network error', { status: 503 });
        })
      );
    }
  } else {
    // For external domains, use default fetch behavior
    event.respondWith(fetch(event.request));
  }
});

// Message event - respond to cache clearing requests
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'clearCache') {
    console.log('[ServiceWorker] Clearing all caches by request');
    
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('[ServiceWorker] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        // Notify client that caches have been cleared
        if (event.source) {
          event.source.postMessage({
            action: 'cacheCleared',
            timestamp: Date.now()
          });
        }
      })
    );
  }
});
