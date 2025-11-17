console.log('[MAIN.TSX] 🚀 Starting main.tsx execution');

import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('[MAIN.TSX] ✅ React imported successfully:', React);
console.log('[MAIN.TSX] ✅ ReactDOM imported successfully:', ReactDOM);
console.log('[MAIN.TSX] React available?', typeof React !== 'undefined');
console.log('[MAIN.TSX] ReactDOM available?', typeof ReactDOM !== 'undefined');

import App from './App.tsx';
console.log('[MAIN.TSX] ✅ App imported successfully');

import './index.css';
console.log('[MAIN.TSX] ✅ CSS imported successfully');

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
  
  // Force reload cached resources - MODIFY to avoid affecting MailerLite
  const forceReload = document.createElement('script');
  forceReload.textContent = `
    // Force cache refresh
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          if ((name.includes('hotelssifnos') || name.includes('touristas')) && !name.includes('mailerlite')) {
            caches.delete(name);
          }
        }
      });
    }
    
    // Add timestamp to all image URLs to bypass cache
    window.addEventListener('load', function() {
      setTimeout(function() {
        document.querySelectorAll('img').forEach(function(img) {
          if (!img.dataset.nocache && !img.closest('.ml-form-embedContainer')) { // Skip images with data-nocache attribute or within MailerLite forms
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
      '/uploads/touristas-ai-logo.svg'
    ];
    
    preloadLinks.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.endsWith('.svg') ? 'image' : 'fetch';
      document.head.appendChild(link);
    });
    
    // Add a flag to indicate that we're ready for MailerLite
    window.mailerliteReady = true;
  `;
  document.head.appendChild(forceReload);
  
  console.log('Added cache prevention meta tags with build version:', buildVersion);
};

// Enhanced SSR detection
const isSSR = typeof window === 'undefined' || import.meta.env.SSR;

// Client-side rendering
console.log('[MAIN.TSX] 🎯 Starting client-side rendering');
console.log('[MAIN.TSX] isSSR:', isSSR);

if (!isSSR) {
  console.log('[MAIN.TSX] 📍 Looking for root element');
  const root = document.getElementById('root');
  console.log('[MAIN.TSX] Root element found:', root);
  
  if (root) {
    // Add cache prevention meta tags
    addCachePreventionMeta();
    
    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'production') {
      console.log('Initializing performance monitoring');
      // Here you would normally initialize real performance monitoring
      // like Google Analytics, New Relic, etc.
    }

    // Set initial scroll position
    window.scrollTo(0, 0);
    
    // Render with optional Strict Mode based on environment
    const StrictModeWrapper = process.env.NODE_ENV === 'development' 
      ? React.StrictMode 
      : React.Fragment;
    
    console.log('[MAIN.TSX] 🎨 Creating React root and rendering App');
    console.log('[MAIN.TSX] StrictModeWrapper:', StrictModeWrapper);
    console.log('[MAIN.TSX] App component:', App);
    
    ReactDOM.createRoot(root).render(
      <StrictModeWrapper>
        <App />
      </StrictModeWrapper>
    );
    
    console.log('[MAIN.TSX] ✅ Render complete');
  } else {
    console.error('[MAIN.TSX] ❌ Root element not found!');
  }
} else {
  console.log('[MAIN.TSX] ⚠️ SSR mode detected, skipping client render');
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
