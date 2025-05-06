
import { useEffect, useState } from 'react';

/**
 * CacheBuster component forces the application to refresh 
 * when a new version is detected or on a regular schedule
 */
const CacheBuster = () => {
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    console.log('CacheBuster initialized');

    // Function to clear browser caches using the Cache API
    const clearBrowserCaches = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => {
              console.log(`Clearing cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
          );
          console.log('All caches cleared successfully');
        } catch (error) {
          console.error('Error clearing caches:', error);
        }
      }
    };

    // Force a hard reload of the page
    const forceRefresh = () => {
      console.log('Forcing page refresh');
      window.location.reload(true);
    };

    // Clear caches and force reload
    const clearAndReload = async () => {
      await clearBrowserCaches();
      forceRefresh();
    };

    // Schedule regular cache busting every 15 minutes
    const intervalId = setInterval(() => {
      console.log('Scheduled cache clearing triggered');
      clearAndReload();
    }, 15 * 60 * 1000); // 15 minutes

    // Schedule refresh if the tab becomes visible after being hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        // Only refresh if it's been more than 5 minutes since last refresh
        if (now - lastRefresh > 5 * 60 * 1000) {
          setLastRefresh(now);
          console.log('Tab became visible - clearing caches and refreshing');
          clearAndReload();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // If service worker sends a message that cache was cleared, reload the page
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.action === 'cacheCleared') {
          console.log('Received cache cleared message from ServiceWorker');
          forceRefresh();
        }
      });
    }

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastRefresh]);

  // This component doesn't render anything
  return null;
};

export default CacheBuster;
