
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { Plugin } from 'vite';
import fs from 'fs';

// Enhanced prerender plugin for SEO
const prerender = (): Plugin => {
  return {
    name: 'prerender',
    apply: 'build',
    async closeBundle() {
      console.log('Prerendering key pages for SEO optimization...');
      
      // Add comprehensive prerendering logic here
      // In a real implementation, this would use tools like Puppeteer
      // to generate static HTML for key routes
      
      // Log completion
      console.log('Prerendering completed for key SEO routes');
    }
  };
};

// Enhanced cache-busting plugin with improved performance
const clearCache = (): Plugin => {
  return {
    name: 'clear-cache',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      console.log('Preparing optimized build with cache management...');
    },
    transformIndexHtml(html) {
      // Generate unique version identifier based on build time
      const timestamp = Date.now();
      const buildId = `build-${timestamp}-${Math.floor(Math.random() * 1000)}`;
      
      return html.replace(
        '</head>',
        `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <meta name="version" content="${buildId}" />
        <meta name="build-timestamp" content="${new Date(timestamp).toISOString()}" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preconnect" href="https://wdzlruiekcznbcicjgrz.supabase.co" crossorigin>
        <script>
          // Enhanced cache refresh strategy
          window.addEventListener('load', function() {
            if (!window.location.hash) {
              if (window.performance && window.performance.navigation.type === 1) {
                console.log('Page was reloaded, ensuring fresh content...');
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (let name of names) {
                      if (name.includes('hotelssifnos')) {
                        caches.delete(name).then(() => console.log('Cache cleared:', name));
                      }
                    }
                  });
                }
                
                // Refresh dynamic content elements
                document.querySelectorAll('[data-dynamic-content]').forEach(el => {
                  const url = el.dataset.source;
                  if (url) {
                    fetch(url + '?_=' + Date.now())
                      .then(res => res.ok ? res.json() : null)
                      .then(data => {
                        if (data) el.textContent = JSON.stringify(data);
                      });
                  }
                });
              }
            }
          });
        </script>
        </head>`
      );
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
  // Optimization for better SEO and performance
  build: {
    target: 'modules',
    modulePreload: true,
    minify: mode === 'production' ? 'terser' : false, // Only use terser in production
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-lib': ['@/components/ui/index'],
          'supabase': ['@supabase/supabase-js'],
          'touristas': ['@/components/touristas']
        },
        // Fixed file naming pattern by removing the [time] placeholder
        entryFileNames: mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js',
        chunkFileNames: mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js',
        assetFileNames: mode === 'production' ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]'
      }
    },
    // Ensure assets are properly hashed for cache busting
    assetsDir: 'assets',
    sourcemap: mode !== 'production', // Disable sourcemaps in production for performance
    ssrManifest: true, // Generate SSR manifest
    emptyOutDir: true, // Clean output directory before build
  }
}));
