// Touristas AI Service Worker
const CACHE_NAME = 'touristas-ai-v1.2.0';
const OFFLINE_URL = '/touristas-ai';

// Assets to cache for offline functionality
const urlsToCache = [
  '/touristas-ai',
  '/uploads/touristas-ai-logo.svg',
  '/uploads/sifnos-og-image.jpg',
  '/uploads/hotels/villa-olivia-clara/feature-image.jpeg',
  '/uploads/hotels/alk-hotel-sifnos/alk-hotel-feature.jpeg',
  '/uploads/hotels/filadaki-studios/gregos_6406.webp',
  '/placeholder.svg',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🚀 Touristas AI Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching Touristas AI assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Touristas AI ready for offline use!');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Touristas AI Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Touristas AI Service Worker activated!');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip chrome-extension and unsupported schemes
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://') ||
      event.request.url.startsWith('safari-extension://')) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy for assets
  if (event.request.destination === 'image' || 
      event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      event.request.url.includes('/uploads/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Cache new resources
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          // Fallback for images
          if (event.request.destination === 'image') {
            return caches.match('/placeholder.svg');
          }
        })
    );
    return;
  }

  // For API calls, try network first, then cache
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co') ||
      event.request.url.includes('openrouter.ai')) {
    
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses for offline use
          if (response.status === 200 && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(event.request);
        })
    );
    return;
  }
});

// Background sync for offline hotel bookings
self.addEventListener('sync', (event) => {
  if (event.tag === 'hotel-booking-sync') {
    console.log('🔄 Syncing hotel booking data...');
    event.waitUntil(syncHotelBookings());
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New hotel deals available in Sifnos!',
    icon: '/uploads/touristas-ai-logo.svg',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      url: '/touristas-ai'
    },
    actions: [
      {
        action: 'open',
        title: 'View Deals'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Touristas AI', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked');
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/touristas-ai')
    );
  }
});

// Helper function for syncing hotel bookings
async function syncHotelBookings() {
  try {
    // This would sync any pending bookings made while offline
    const pendingBookings = await getStoredBookings();
    
    for (const booking of pendingBookings) {
      await submitBooking(booking);
      await removeStoredBooking(booking.id);
    }
    
    console.log('✅ Hotel bookings synced successfully');
  } catch (error) {
    console.error('❌ Error syncing hotel bookings:', error);
  }
}

// IndexedDB helpers for offline booking storage
function getStoredBookings() {
  return new Promise((resolve) => {
    // Implementation would use IndexedDB to store offline bookings
    resolve([]);
  });
}

function submitBooking(booking) {
  return fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booking)
  });
}

function removeStoredBooking(bookingId) {
  return new Promise((resolve) => {
    // Implementation would remove booking from IndexedDB
    resolve();
  });
} 