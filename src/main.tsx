
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Generate a unique version identifier for this build
const buildVersion = Date.now().toString();

// Add runtime cache prevention meta tags
const addCachePreventionMeta = () => {
  // Add cache control meta tags
  const metaCacheControl = document.createElement('meta');
  metaCacheControl.httpEquiv = 'Cache-Control';
  metaCacheControl.content = 'no-cache, no-store, must-revalidate';
  document.head.appendChild(metaCacheControl);
  
  const metaPragma = document.createElement('meta');
  metaPragma.httpEquiv = 'Pragma';
  metaPragma.content = 'no-cache';
  document.head.appendChild(metaPragma);
  
  const metaExpires = document.createElement('meta');
  metaExpires.httpEquiv = 'Expires';
  metaExpires.content = '0';
  document.head.appendChild(metaExpires);
  
  // Add build version as custom meta tag
  const metaBuildVersion = document.createElement('meta');
  metaBuildVersion.name = 'build-version';
  metaBuildVersion.content = buildVersion;
  document.head.appendChild(metaBuildVersion);
  
  // Force reload cached resources
  const forceReload = document.createElement('script');
  forceReload.textContent = `
    // Force cache refresh
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
    }
    // Add timestamp to all image URLs to bypass cache
    window.addEventListener('load', function() {
      setTimeout(function() {
        document.querySelectorAll('img').forEach(function(img) {
          const timestamp = new Date().getTime();
          const randomVal = Math.floor(Math.random() * 1000);
          if (img.src.indexOf('?') === -1) {
            img.src = img.src + '?v=' + timestamp + '-' + randomVal;
          } else {
            img.src = img.src.split('?')[0] + '?v=' + timestamp + '-' + randomVal;
          }
        });
      }, 300);
    });
  `;
  document.head.appendChild(forceReload);
  
  console.log('Added cache prevention meta tags with build version:', buildVersion);
};

// Detect if we're running in SSR mode or client mode
const isSSR = import.meta.env.SSR;

// Client-side rendering
if (!isSSR) {
  const root = document.getElementById('root');
  
  if (root) {
    // Add cache prevention meta tags
    addCachePreventionMeta();
    
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

// For SSR, export the App component
export { App };
