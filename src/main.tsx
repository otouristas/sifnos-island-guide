
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
