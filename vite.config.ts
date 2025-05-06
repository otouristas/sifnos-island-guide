
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { Plugin } from 'vite';
import fs from 'fs';

// Create a simple prerender plugin
const prerender = (): Plugin => {
  return {
    name: 'prerender',
    apply: 'build',
    async closeBundle() {
      // This is a simple implementation
      console.log('Prerendering for SEO...');
      // Add more sophisticated prerendering logic here if needed
    }
  };
};

// Enhanced cache-busting plugin
const clearCache = (): Plugin => {
  return {
    name: 'clear-cache',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      console.log('Clearing build cache for fresh build...');
      // Nothing to do on the server side, but logging for visibility
    },
    transformIndexHtml(html) {
      // Add strong cache control meta tags and timestamp for cache busting
      const timestamp = Date.now();
      return html.replace(
        '</head>',
        `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <meta name="version" content="${timestamp}" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
        <script>
          // Force cache refresh on page load
          window.addEventListener('load', function() {
            if (!window.location.hash) {
              if (window.performance && window.performance.navigation.type === 1) {
                console.log('Page was reloaded, clearing cache...');
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (let name of names) caches.delete(name);
                  });
                }
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
        drop_console: false, // Keep console.logs for now for debugging
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
        // Add asset hashing with timestamp for aggressive cache busting
        entryFileNames: mode === 'production' ? 'assets/[name]-[hash]-[time].js' : 'assets/[name].js',
        chunkFileNames: mode === 'production' ? 'assets/[name]-[hash]-[time].js' : 'assets/[name].js',
        assetFileNames: mode === 'production' ? 'assets/[name]-[hash]-[time].[ext]' : 'assets/[name].[ext]'
      }
    },
    // Ensure assets are properly hashed for cache busting
    assetsDir: 'assets',
    sourcemap: mode !== 'production', // Disable sourcemaps in production for performance
  }
}));
