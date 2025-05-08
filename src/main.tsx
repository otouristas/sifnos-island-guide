
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Generate a unique version identifier for this build
const buildVersion = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
  
  // Add last updated meta tag
  const metaLastUpdated = document.createElement('meta');
  metaLastUpdated.name = 'last-updated';
  metaLastUpdated.content = new Date().toISOString();
  document.head.appendChild(metaLastUpdated);
  
  // Force reload cached resources
  const forceReload = document.createElement('script');
  forceReload.textContent = `
    // Force cache refresh
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          if (name.includes('hotelssifnos') || name.includes('touristas')) {
            caches.delete(name);
          }
        }
      });
    }
    
    // Add timestamp to all image URLs to bypass cache
    window.addEventListener('load', function() {
      setTimeout(function() {
        document.querySelectorAll('img').forEach(function(img) {
          if (!img.dataset.nocache) { // Skip images with data-nocache attribute
            const timestamp = new Date().getTime();
            const randomVal = Math.floor(Math.random() * 1000);
            if (img.src.indexOf('?') === -1) {
              img.src = img.src + '?v=' + timestamp + '-' + randomVal;
            } else {
              img.src = img.src.split('?')[0] + '?v=' + timestamp + '-' + randomVal;
            }
          }
        });
      }, 300);
    });
    
    // Preload key resources
    const preloadLinks = [
      '/fonts/inter.woff2',
      '/uploads/touristas-ai-logo.svg'
    ];
    
    preloadLinks.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.endsWith('.woff2') ? 'font' : 
                url.endsWith('.svg') ? 'image' : 
                'fetch';
      if (url.endsWith('.woff2')) {
        link.setAttribute('crossorigin', 'anonymous');
      }
      document.head.appendChild(link);
    });
  `;
  document.head.appendChild(forceReload);
  
  console.log('Added cache prevention meta tags with build version:', buildVersion);
};

// Enhanced SSR detection
const isSSR = typeof window === 'undefined' || import.meta.env.SSR;

// Client-side rendering
if (!isSSR) {
  const root = document.getElementById('root');
  
  if (root) {
    // Add cache prevention meta tags
    addCachePreventionMeta();
    
    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'production') {
      console.log('Initializing performance monitoring');
      // Here you would normally initialize real performance monitoring
      // like Google Analytics, New Relic, etc.
    }
    
    // Render with optional Strict Mode based on environment
    const StrictModeWrapper = process.env.NODE_ENV === 'development' 
      ? React.StrictMode 
      : React.Fragment;
    
    ReactDOM.createRoot(root).render(
      <StrictModeWrapper>
        <App />
      </StrictModeWrapper>
    );
  }
}

// For SSR, export the App component
export { App };

// Also export helper functions for SSR
export const generateMetaTags = () => {
  return {
    buildVersion,
    lastUpdated: new Date().toISOString(),
  };
};
