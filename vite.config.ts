
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { Plugin } from 'vite';
import fs from 'fs';

// Create a prerender plugin for SEO
const prerender = (): Plugin => {
  return {
    name: 'prerender',
    apply: 'build',
    async closeBundle() {
      console.log('Prerendering for SEO...');
      // Add more sophisticated prerendering logic here if needed
    }
  };
};

// Ultra aggressive cache-busting plugin for production
const clearCache = (): Plugin => {
  return {
    name: 'clear-cache',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      console.log('Applying ultra aggressive cache busting for production build...');
    },
    transformIndexHtml(html) {
      // Generate a completely unique identifier for this build
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
      const randomValue1 = Math.floor(Math.random() * 1000000000).toString(36);
      const randomValue2 = Math.random().toString(36).substring(2);
      const uniqueBuildId = `${timestamp}-${randomValue1}-${randomValue2}`;
      
      // Add meta tags that force cache invalidation
      return html.replace(
        '</head>',
        `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="-1" />
        <meta name="version" content="${uniqueBuildId}" />
        <meta name="build-timestamp" content="${Date.now()}" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
        <script>
          // Ultra aggressive cache busting on page load
          (function() {
            console.log('Executing ultra aggressive cache busting...');
            
            // Clear all caches immediately
            if ('caches' in window) {
              caches.keys().then(function(names) {
                for (let name of names) {
                  console.log('Clearing cache:', name);
                  caches.delete(name);
                }
              });
            }
            
            // Force reload service worker
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) {
                  registration.unregister();
                  console.log('Service worker unregistered');
                }
              });
            }
            
            function forceRefreshResources() {
              console.log('Forcing resource refresh...');
              
              // Target all <img> elements
              document.querySelectorAll('img').forEach(function(img) {
                if (img.src && !img.src.includes('placeholder.svg')) {
                  const cacheBuster = '${uniqueBuildId}';
                  const originalSrc = img.src.split('?')[0];
                  img.src = originalSrc + '?v=' + cacheBuster + '&t=' + Date.now();
                }
              });
              
              // Target all CSS resources
              document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
                const href = link.getAttribute('href');
                if (href) {
                  const originalHref = href.split('?')[0];
                  link.href = originalHref + '?v=${uniqueBuildId}&t=' + Date.now();
                }
              });
              
              // Target all JS resources
              document.querySelectorAll('script[src]').forEach(function(script) {
                const src = script.getAttribute('src');
                if (src) {
                  const originalSrc = src.split('?')[0];
                  const newScript = document.createElement('script');
                  newScript.src = originalSrc + '?v=${uniqueBuildId}&t=' + Date.now();
                  script.parentNode.replaceChild(newScript, script);
                }
              });
            }
            
            // Execute immediately
            forceRefreshResources();
            
            // And again after a short delay
            setTimeout(forceRefreshResources, 1000);
            
            // Also refresh resources on window focus
            window.addEventListener('focus', forceRefreshResources);
            
            // Force a full page reload every 5 minutes if the tab stays open
            setTimeout(function() {
              window.location.reload(true);
            }, 300000);
          })();
        </script>
        </head>`
      );
    },
    configureServer(server) {
      // Force aggressive cache busting in development server
      server.middlewares.use((req, res, next) => {
        // Add headers to prevent caching in development
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'production' && prerender(),
    clearCache(), // Run in all modes to prevent caching issues
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Enhanced SSR features
  ssr: {
    // SSR specific config
    noExternal: ['react-helmet'],
    target: 'node',
    format: 'esm'
  },
  // Ultra aggressive anti-caching optimization for production
  build: {
    target: 'modules',
    modulePreload: true,
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-lib': ['@/components/ui/index'],
          'supabase': ['@supabase/supabase-js']
        },
        // Use ultra aggressive timestamp + multiple random values for cache busting
        entryFileNames: `assets/[name]-[hash]-${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}.[ext]`
      }
    },
    assetsDir: 'assets',
    sourcemap: mode !== 'production',
    // Force clean builds every time
    emptyOutDir: true
  }
}));
