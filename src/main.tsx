
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
