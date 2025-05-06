
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register service worker for cache busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Add cache busting parameter to ensure we always get a fresh service worker
    const swUrl = `/serviceWorker.js?v=${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Check for updates every minute
        setInterval(() => {
          registration.update()
            .then(() => console.log('ServiceWorker update check completed'))
            .catch(error => console.error('ServiceWorker update failed:', error));
        }, 60000);
        
        // Force clear cache every 5 minutes
        setInterval(() => {
          if (registration.active) {
            registration.active.postMessage({ action: 'clearCache' });
          }
        }, 300000);
        
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Detect if we're running in SSR mode or client mode
const isSSR = import.meta.env.SSR;

// Client-side rendering
if (!isSSR) {
  const root = document.getElementById('root');
  
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

// For SSR, export the App component
export { App };
