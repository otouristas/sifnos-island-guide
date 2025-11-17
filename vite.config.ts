import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { Plugin } from 'vite';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { componentTagger } from "lovable-tagger";

// Enhanced prerender plugin with Puppeteer for SEO optimization
const prerender = (): Plugin => {
  return {
    name: 'prerender',
    apply: 'build',
    async closeBundle() {
      console.log('Starting advanced prerendering for SEO optimization...');
      
      // Key routes that should be prerendered for SEO
      const routes = [
        '/',
        '/hotels',
        '/locations',
        '/hotel-types',
        '/blog',
        '/about',
        '/travel-guide',
        '/beaches',
        '/touristas-ai',
        '/faq',
        '/contact',
        '/pricing',
        '/privacy-policy',
        '/terms-of-service',
        '/cookie-policy'
      ];
      
      // Output directory
      const outputDir = path.resolve(__dirname, 'dist');
      
      try {
        // Launch puppeteer
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        
        for (const route of routes) {
          console.log(`Prerendering route: ${route}`);
          
          // Create page
          const page = await browser.newPage();
          
          // Set viewport
          await page.setViewport({ width: 1200, height: 800 });
          
          // We're building a static file, so we'll use file:// protocol
          const htmlPath = path.join(outputDir, route === '/' ? 'index.html' : `${route.substring(1)}.html`);
          
          // Check if HTML file exists
          if (!fs.existsSync(htmlPath)) {
            console.log(`Skipping ${route} - HTML file not found at ${htmlPath}`);
            continue;
          }
          
          // Navigate to the page
          await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
          
          // Wait for all content to load properly (fix for timeout issues)
          // Using setTimeout instead of waitForTimeout which isn't available in this Puppeteer version
          await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
          
          // Get the prerendered HTML
          const html = await page.content();
          
          // Create the directory path if it doesn't exist
          const dirPath = path.dirname(htmlPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          // Write the file
          fs.writeFileSync(htmlPath, html);
          
          console.log(`✅ Prerendered ${route}`);
          
          // Close page
          await page.close();
        }
        
        // Close browser
        await browser.close();
        console.log('Prerendering completed successfully!');
      } catch (error) {
        console.error('Error during prerendering:', error);
      }
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

// Directory resolver plugin to handle directory imports correctly
const directoryResolver = (): Plugin => {
  return {
    name: 'directory-resolver',
    resolveId(source, importer) {
      if (source && importer && !source.startsWith('.') && !source.startsWith('/') && !path.isAbsolute(source)) {
        return null; // Skip non-relative imports
      }
      
      if (source && fs.existsSync(source) && fs.statSync(source).isDirectory()) {
        const indexFile = path.join(source, 'index.ts');
        if (fs.existsSync(indexFile)) {
          return indexFile;
        }
        
        const indexTsxFile = path.join(source, 'index.tsx');
        if (fs.existsSync(indexTsxFile)) {
          return indexTsxFile;
        }
      }
      
      return null;
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
    mode === 'development' && componentTagger(),
    directoryResolver(), // Add our directory resolver plugin
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
    target: 'esnext',
    modulePreload: {
      polyfill: true
    },
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : []
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor code into separate chunks
          if (id.includes('node_modules')) {
            // Keep React, React-DOM, and React-Router in the main vendor chunk
            // to ensure they're always available when contexts load
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-components';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }
          // Keep contexts in the main bundle to ensure React is loaded first
          if (id.includes('src/contexts/')) {
            return 'contexts';
          }
          // Split pages into separate chunks
          if (id.includes('src/pages/')) {
            const page = id.split('src/pages/')[1].split('/')[0].replace('.tsx', '');
            return `page-${page}`;
          }
        },
        entryFileNames: mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js',
        chunkFileNames: mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js',
        assetFileNames: mode === 'production' ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]'
      }
    },
    assetsDir: 'assets',
    sourcemap: mode !== 'production',
    ssrManifest: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
  }
}));
