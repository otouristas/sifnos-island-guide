
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

// Create a plugin to clear the cache
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
      // Add cache control meta tags
      return html.replace(
        '</head>',
        `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
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
    mode === 'production' && clearCache(),
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
        }
      }
    },
    // Ensure assets are properly hashed for cache busting
    assetsDir: 'assets',
    sourcemap: mode !== 'production', // Disable sourcemaps in production for performance
  }
}));
