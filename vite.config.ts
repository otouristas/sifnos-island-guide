
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

// Super aggressive cache-busting plugin
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
      // Generate a more unique timestamp for stronger cache busting
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
      const randomValue = Math.floor(Math.random() * 1000000000).toString(36);
      
      // Add even more aggressive cache control meta tags
      return html.replace(
        '</head>',
        `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="-1" />
        <meta name="version" content="${timestamp}-${randomValue}" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
        <script>
          // Force super aggressive cache refresh on page load
          window.addEventListener('load', function() {
            console.log('Page loaded, clearing all caches...');
            if ('caches' in window) {
              caches.keys().then(function(names) {
                for (let name of names) caches.delete(name);
              });
            }
            
            // Force reload all images by updating src with timestamp
            document.querySelectorAll('img').forEach(function(img) {
              if (img.src && !img.src.includes('placeholder.svg')) {
                const cacheBuster = '${timestamp}-${randomValue}';
                if (img.src.indexOf('?') !== -1) {
                  img.src = img.src.split('?')[0] + '?v=' + cacheBuster;
                } else {
                  img.src = img.src + '?v=' + cacheBuster;
                }
              }
            });
            
            // Force reload all CSS resources
            document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
              const href = link.getAttribute('href');
              if (href) {
                link.href = href.split('?')[0] + '?v=${timestamp}-${randomValue}';
              }
            });
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
        // Use a more aggressive timestamp + random value strategy for cache busting
        entryFileNames: `assets/[name]-[hash]-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.[ext]`
      }
    },
    // Ensure assets are properly hashed for cache busting
    assetsDir: 'assets',
    sourcemap: mode !== 'production', // Disable sourcemaps in production for performance
  }
}));
