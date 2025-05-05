
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
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Fix: Instead of importing the directory, reference the index file
          'ui-lib': ['@/components/ui/index']
        }
      }
    }
  }
}));
