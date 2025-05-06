// Service Worker for HotelsSifnos.com
const CACHE_NAME = 'hotelssifnos-cache-v1';
const BUILD_VERSION = Date.now().toString();

// Add Build version to self
self.BUILD_VERSION = BUILD_VERSION;

// Install event - cache basic assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install with build version:', BUILD_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
      ]);
    }).then(() => {
      console.log('[ServiceWorker] Successfully installed');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate with build version:', BUILD_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, then cache strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip browser-sync and chrome-extension requests
  if (event.request.url.includes('browser-sync') || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // For image requests, use cache-then-network strategy
  if (event.request.destination === 'image') {
    handleImageRequest(event);
    return;
  }
  
  // For HTML and other critical resources, use network-first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response for next time
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});

// Handle image requests separately with cache-busting
function handleImageRequest(event) {
  // Create a new URL with cache busting parameter
  const url = new URL(event.request.url);
  url.searchParams.set('v', BUILD_VERSION);
  
  // Create a new request with the cache-busted URL
  const cacheBustedRequest = new Request(url.toString(), {
    headers: event.request.headers,
    mode: event.request.mode,
    credentials: event.request.credentials,
    redirect: event.request.redirect
  });
  
  event.respondWith(
    // Try cache first
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise fetch from network with cache busting
      return fetch(cacheBustedRequest)
        .then((response) => {
          // Cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If all fails, return nothing
          return new Response('Image not available', {
            status: 404,
            statusText: 'Not found'
          });
        });
    })
  );
}

// Message event - handle cache clearing
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[ServiceWorker] Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('[ServiceWorker] All caches cleared');
        clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'CACHE_CLEARED',
              timestamp: Date.now()
            });
          });
        });
      })
    );
  }
});
