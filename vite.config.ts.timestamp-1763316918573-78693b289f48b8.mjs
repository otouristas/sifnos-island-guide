// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import fs from "fs";
import puppeteer from "file:///home/project/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
var prerender = () => {
  return {
    name: "prerender",
    apply: "build",
    async closeBundle() {
      console.log("Starting advanced prerendering for SEO optimization...");
      const routes = [
        "/",
        "/hotels",
        "/locations",
        "/hotel-types",
        "/blog",
        "/about",
        "/travel-guide",
        "/beaches",
        "/touristas-ai",
        "/faq",
        "/contact",
        "/pricing",
        "/privacy-policy",
        "/terms-of-service",
        "/cookie-policy"
      ];
      const outputDir = path.resolve(__vite_injected_original_dirname, "dist");
      try {
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        for (const route of routes) {
          console.log(`Prerendering route: ${route}`);
          const page = await browser.newPage();
          await page.setViewport({ width: 1200, height: 800 });
          const htmlPath = path.join(outputDir, route === "/" ? "index.html" : `${route.substring(1)}.html`);
          if (!fs.existsSync(htmlPath)) {
            console.log(`Skipping ${route} - HTML file not found at ${htmlPath}`);
            continue;
          }
          await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
          await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 2e3)));
          const html = await page.content();
          const dirPath = path.dirname(htmlPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          fs.writeFileSync(htmlPath, html);
          console.log(`\u2705 Prerendered ${route}`);
          await page.close();
        }
        await browser.close();
        console.log("Prerendering completed successfully!");
      } catch (error) {
        console.error("Error during prerendering:", error);
      }
    }
  };
};
var clearCache = () => {
  return {
    name: "clear-cache",
    apply: "build",
    enforce: "pre",
    buildStart() {
      console.log("Preparing optimized build with cache management...");
    },
    transformIndexHtml(html) {
      const timestamp = Date.now();
      const buildId = `build-${timestamp}-${Math.floor(Math.random() * 1e3)}`;
      return html.replace(
        "</head>",
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
var directoryResolver = () => {
  return {
    name: "directory-resolver",
    resolveId(source, importer) {
      if (source && importer && !source.startsWith(".") && !source.startsWith("/") && !path.isAbsolute(source)) {
        return null;
      }
      if (source && fs.existsSync(source) && fs.statSync(source).isDirectory()) {
        const indexFile = path.join(source, "index.ts");
        if (fs.existsSync(indexFile)) {
          return indexFile;
        }
        const indexTsxFile = path.join(source, "index.tsx");
        if (fs.existsSync(indexTsxFile)) {
          return indexTsxFile;
        }
      }
      return null;
    }
  };
};
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    directoryResolver(),
    // Add our directory resolver plugin
    mode === "production" && prerender(),
    clearCache()
    // Run in all modes to prevent caching issues
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  // Enhanced SSR features
  ssr: {
    // SSR specific config
    noExternal: ["react-helmet"],
    target: "node",
    format: "esm"
  },
  // Optimization for better SEO and performance
  build: {
    target: "modules",
    modulePreload: true,
    minify: mode === "production" ? "terser" : false,
    // Only use terser in production
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        // Remove console logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-lib": ["@/components/ui/index"],
          "supabase": ["@supabase/supabase-js"],
          "touristas": ["@/components/touristas/index"]
        },
        // Fixed file naming pattern by removing the [time] placeholder
        entryFileNames: mode === "production" ? "assets/[name]-[hash].js" : "assets/[name].js",
        chunkFileNames: mode === "production" ? "assets/[name]-[hash].js" : "assets/[name].js",
        assetFileNames: mode === "production" ? "assets/[name]-[hash].[ext]" : "assets/[name].[ext]"
      }
    },
    // Ensure assets are properly hashed for cache busting
    assetsDir: "assets",
    sourcemap: mode !== "production",
    // Disable sourcemaps in production for performance
    ssrManifest: true,
    // Generate SSR manifest
    emptyOutDir: true
    // Clean output directory before build
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcHVwcGV0ZWVyIGZyb20gJ3B1cHBldGVlcic7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gRW5oYW5jZWQgcHJlcmVuZGVyIHBsdWdpbiB3aXRoIFB1cHBldGVlciBmb3IgU0VPIG9wdGltaXphdGlvblxuY29uc3QgcHJlcmVuZGVyID0gKCk6IFBsdWdpbiA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ByZXJlbmRlcicsXG4gICAgYXBwbHk6ICdidWlsZCcsXG4gICAgYXN5bmMgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgYWR2YW5jZWQgcHJlcmVuZGVyaW5nIGZvciBTRU8gb3B0aW1pemF0aW9uLi4uJyk7XG4gICAgICBcbiAgICAgIC8vIEtleSByb3V0ZXMgdGhhdCBzaG91bGQgYmUgcHJlcmVuZGVyZWQgZm9yIFNFT1xuICAgICAgY29uc3Qgcm91dGVzID0gW1xuICAgICAgICAnLycsXG4gICAgICAgICcvaG90ZWxzJyxcbiAgICAgICAgJy9sb2NhdGlvbnMnLFxuICAgICAgICAnL2hvdGVsLXR5cGVzJyxcbiAgICAgICAgJy9ibG9nJyxcbiAgICAgICAgJy9hYm91dCcsXG4gICAgICAgICcvdHJhdmVsLWd1aWRlJyxcbiAgICAgICAgJy9iZWFjaGVzJyxcbiAgICAgICAgJy90b3VyaXN0YXMtYWknLFxuICAgICAgICAnL2ZhcScsXG4gICAgICAgICcvY29udGFjdCcsXG4gICAgICAgICcvcHJpY2luZycsXG4gICAgICAgICcvcHJpdmFjeS1wb2xpY3knLFxuICAgICAgICAnL3Rlcm1zLW9mLXNlcnZpY2UnLFxuICAgICAgICAnL2Nvb2tpZS1wb2xpY3knXG4gICAgICBdO1xuICAgICAgXG4gICAgICAvLyBPdXRwdXQgZGlyZWN0b3J5XG4gICAgICBjb25zdCBvdXRwdXREaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICAvLyBMYXVuY2ggcHVwcGV0ZWVyXG4gICAgICAgIGNvbnN0IGJyb3dzZXIgPSBhd2FpdCBwdXBwZXRlZXIubGF1bmNoKHtcbiAgICAgICAgICBoZWFkbGVzczogdHJ1ZSxcbiAgICAgICAgICBhcmdzOiBbJy0tbm8tc2FuZGJveCcsICctLWRpc2FibGUtc2V0dWlkLXNhbmRib3gnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHJvdXRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBQcmVyZW5kZXJpbmcgcm91dGU6ICR7cm91dGV9YCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ3JlYXRlIHBhZ2VcbiAgICAgICAgICBjb25zdCBwYWdlID0gYXdhaXQgYnJvd3Nlci5uZXdQYWdlKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gU2V0IHZpZXdwb3J0XG4gICAgICAgICAgYXdhaXQgcGFnZS5zZXRWaWV3cG9ydCh7IHdpZHRoOiAxMjAwLCBoZWlnaHQ6IDgwMCB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBXZSdyZSBidWlsZGluZyBhIHN0YXRpYyBmaWxlLCBzbyB3ZSdsbCB1c2UgZmlsZTovLyBwcm90b2NvbFxuICAgICAgICAgIGNvbnN0IGh0bWxQYXRoID0gcGF0aC5qb2luKG91dHB1dERpciwgcm91dGUgPT09ICcvJyA/ICdpbmRleC5odG1sJyA6IGAke3JvdXRlLnN1YnN0cmluZygxKX0uaHRtbGApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENoZWNrIGlmIEhUTUwgZmlsZSBleGlzdHNcbiAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoaHRtbFBhdGgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU2tpcHBpbmcgJHtyb3V0ZX0gLSBIVE1MIGZpbGUgbm90IGZvdW5kIGF0ICR7aHRtbFBhdGh9YCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gTmF2aWdhdGUgdG8gdGhlIHBhZ2VcbiAgICAgICAgICBhd2FpdCBwYWdlLmdvdG8oYGZpbGU6Ly8ke2h0bWxQYXRofWAsIHsgd2FpdFVudGlsOiAnbmV0d29ya2lkbGUwJyB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBXYWl0IGZvciBhbGwgY29udGVudCB0byBsb2FkIHByb3Blcmx5IChmaXggZm9yIHRpbWVvdXQgaXNzdWVzKVxuICAgICAgICAgIC8vIFVzaW5nIHNldFRpbWVvdXQgaW5zdGVhZCBvZiB3YWl0Rm9yVGltZW91dCB3aGljaCBpc24ndCBhdmFpbGFibGUgaW4gdGhpcyBQdXBwZXRlZXIgdmVyc2lvblxuICAgICAgICAgIGF3YWl0IHBhZ2UuZXZhbHVhdGUoKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKSk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gR2V0IHRoZSBwcmVyZW5kZXJlZCBIVE1MXG4gICAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IHBhZ2UuY29udGVudCgpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgZGlyZWN0b3J5IHBhdGggaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgIGNvbnN0IGRpclBhdGggPSBwYXRoLmRpcm5hbWUoaHRtbFBhdGgpO1xuICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhkaXJQYXRoKSkge1xuICAgICAgICAgICAgZnMubWtkaXJTeW5jKGRpclBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBXcml0ZSB0aGUgZmlsZVxuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaHRtbFBhdGgsIGh0bWwpO1xuICAgICAgICAgIFxuICAgICAgICAgIGNvbnNvbGUubG9nKGBcdTI3MDUgUHJlcmVuZGVyZWQgJHtyb3V0ZX1gKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBDbG9zZSBwYWdlXG4gICAgICAgICAgYXdhaXQgcGFnZS5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDbG9zZSBicm93c2VyXG4gICAgICAgIGF3YWl0IGJyb3dzZXIuY2xvc2UoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1ByZXJlbmRlcmluZyBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5IScpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZHVyaW5nIHByZXJlbmRlcmluZzonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcblxuLy8gRW5oYW5jZWQgY2FjaGUtYnVzdGluZyBwbHVnaW4gd2l0aCBpbXByb3ZlZCBwZXJmb3JtYW5jZVxuY29uc3QgY2xlYXJDYWNoZSA9ICgpOiBQbHVnaW4gPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjbGVhci1jYWNoZScsXG4gICAgYXBwbHk6ICdidWlsZCcsXG4gICAgZW5mb3JjZTogJ3ByZScsXG4gICAgYnVpbGRTdGFydCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdQcmVwYXJpbmcgb3B0aW1pemVkIGJ1aWxkIHdpdGggY2FjaGUgbWFuYWdlbWVudC4uLicpO1xuICAgIH0sXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwpIHtcbiAgICAgIC8vIEdlbmVyYXRlIHVuaXF1ZSB2ZXJzaW9uIGlkZW50aWZpZXIgYmFzZWQgb24gYnVpbGQgdGltZVxuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgIGNvbnN0IGJ1aWxkSWQgPSBgYnVpbGQtJHt0aW1lc3RhbXB9LSR7TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCl9YDtcbiAgICAgIFxuICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShcbiAgICAgICAgJzwvaGVhZD4nLFxuICAgICAgICBgPG1ldGEgaHR0cC1lcXVpdj1cIkNhY2hlLUNvbnRyb2xcIiBjb250ZW50PVwibm8tY2FjaGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGVcIiAvPlxuICAgICAgICA8bWV0YSBodHRwLWVxdWl2PVwiUHJhZ21hXCIgY29udGVudD1cIm5vLWNhY2hlXCIgLz5cbiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj1cIkV4cGlyZXNcIiBjb250ZW50PVwiMFwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2ZXJzaW9uXCIgY29udGVudD1cIiR7YnVpbGRJZH1cIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwiYnVpbGQtdGltZXN0YW1wXCIgY29udGVudD1cIiR7bmV3IERhdGUodGltZXN0YW1wKS50b0lTT1N0cmluZygpfVwiIC8+XG4gICAgICAgIDxsaW5rIHJlbD1cInByZWxvYWRcIiBocmVmPVwiL2ZvbnRzL2ludGVyLndvZmYyXCIgYXM9XCJmb250XCIgdHlwZT1cImZvbnQvd29mZjJcIiBjcm9zc29yaWdpbj5cbiAgICAgICAgPGxpbmsgcmVsPVwicHJlY29ubmVjdFwiIGhyZWY9XCJodHRwczovL3dkemxydWlla2N6bmJjaWNqZ3J6LnN1cGFiYXNlLmNvXCIgY3Jvc3NvcmlnaW4+XG4gICAgICAgIDxzY3JpcHQ+XG4gICAgICAgICAgLy8gRW5oYW5jZWQgY2FjaGUgcmVmcmVzaCBzdHJhdGVneVxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgICAgICAgIGlmICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5hdmlnYXRpb24udHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQYWdlIHdhcyByZWxvYWRlZCwgZW5zdXJpbmcgZnJlc2ggY29udGVudC4uLicpO1xuICAgICAgICAgICAgICAgIGlmICgnY2FjaGVzJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgICAgICAgIGNhY2hlcy5rZXlzKCkudGhlbihmdW5jdGlvbihuYW1lcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIG5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJ2hvdGVsc3NpZm5vcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZXMuZGVsZXRlKG5hbWUpLnRoZW4oKCkgPT4gY29uc29sZS5sb2coJ0NhY2hlIGNsZWFyZWQ6JywgbmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFJlZnJlc2ggZHluYW1pYyBjb250ZW50IGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZHluYW1pYy1jb250ZW50XScpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gZWwuZGF0YXNldC5zb3VyY2U7XG4gICAgICAgICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZldGNoKHVybCArICc/Xz0nICsgRGF0ZS5ub3coKSlcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLm9rID8gcmVzLmpzb24oKSA6IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkgZWwudGV4dENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICA8L3NjcmlwdD5cbiAgICAgICAgPC9oZWFkPmBcbiAgICAgICk7XG4gICAgfVxuICB9O1xufTtcblxuLy8gRGlyZWN0b3J5IHJlc29sdmVyIHBsdWdpbiB0byBoYW5kbGUgZGlyZWN0b3J5IGltcG9ydHMgY29ycmVjdGx5XG5jb25zdCBkaXJlY3RvcnlSZXNvbHZlciA9ICgpOiBQbHVnaW4gPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdkaXJlY3RvcnktcmVzb2x2ZXInLFxuICAgIHJlc29sdmVJZChzb3VyY2UsIGltcG9ydGVyKSB7XG4gICAgICBpZiAoc291cmNlICYmIGltcG9ydGVyICYmICFzb3VyY2Uuc3RhcnRzV2l0aCgnLicpICYmICFzb3VyY2Uuc3RhcnRzV2l0aCgnLycpICYmICFwYXRoLmlzQWJzb2x1dGUoc291cmNlKSkge1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gU2tpcCBub24tcmVsYXRpdmUgaW1wb3J0c1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoc291cmNlICYmIGZzLmV4aXN0c1N5bmMoc291cmNlKSAmJiBmcy5zdGF0U3luYyhzb3VyY2UpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgY29uc3QgaW5kZXhGaWxlID0gcGF0aC5qb2luKHNvdXJjZSwgJ2luZGV4LnRzJyk7XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGluZGV4RmlsZSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXhGaWxlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBpbmRleFRzeEZpbGUgPSBwYXRoLmpvaW4oc291cmNlLCAnaW5kZXgudHN4Jyk7XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGluZGV4VHN4RmlsZSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXhUc3hGaWxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBkaXJlY3RvcnlSZXNvbHZlcigpLCAvLyBBZGQgb3VyIGRpcmVjdG9yeSByZXNvbHZlciBwbHVnaW5cbiAgICBtb2RlID09PSAncHJvZHVjdGlvbicgJiYgcHJlcmVuZGVyKCksXG4gICAgY2xlYXJDYWNoZSgpLCAvLyBSdW4gaW4gYWxsIG1vZGVzIHRvIHByZXZlbnQgY2FjaGluZyBpc3N1ZXNcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgLy8gRW5oYW5jZWQgU1NSIGZlYXR1cmVzXG4gIHNzcjoge1xuICAgIC8vIFNTUiBzcGVjaWZpYyBjb25maWdcbiAgICBub0V4dGVybmFsOiBbJ3JlYWN0LWhlbG1ldCddLFxuICAgIHRhcmdldDogJ25vZGUnLFxuICAgIGZvcm1hdDogJ2VzbSdcbiAgfSxcbiAgLy8gT3B0aW1pemF0aW9uIGZvciBiZXR0ZXIgU0VPIGFuZCBwZXJmb3JtYW5jZVxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ21vZHVsZXMnLFxuICAgIG1vZHVsZVByZWxvYWQ6IHRydWUsXG4gICAgbWluaWZ5OiBtb2RlID09PSAncHJvZHVjdGlvbicgPyAndGVyc2VyJyA6IGZhbHNlLCAvLyBPbmx5IHVzZSB0ZXJzZXIgaW4gcHJvZHVjdGlvblxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLCAvLyBSZW1vdmUgY29uc29sZSBsb2dzIGluIHByb2R1Y3Rpb25cbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ3VpLWxpYic6IFsnQC9jb21wb25lbnRzL3VpL2luZGV4J10sXG4gICAgICAgICAgJ3N1cGFiYXNlJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgICAndG91cmlzdGFzJzogWydAL2NvbXBvbmVudHMvdG91cmlzdGFzL2luZGV4J11cbiAgICAgICAgfSxcbiAgICAgICAgLy8gRml4ZWQgZmlsZSBuYW1pbmcgcGF0dGVybiBieSByZW1vdmluZyB0aGUgW3RpbWVdIHBsYWNlaG9sZGVyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnIDogJ2Fzc2V0cy9bbmFtZV0uanMnLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyA6ICdhc3NldHMvW25hbWVdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XScgOiAnYXNzZXRzL1tuYW1lXS5bZXh0XSdcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIEVuc3VyZSBhc3NldHMgYXJlIHByb3Blcmx5IGhhc2hlZCBmb3IgY2FjaGUgYnVzdGluZ1xuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgc291cmNlbWFwOiBtb2RlICE9PSAncHJvZHVjdGlvbicsIC8vIERpc2FibGUgc291cmNlbWFwcyBpbiBwcm9kdWN0aW9uIGZvciBwZXJmb3JtYW5jZVxuICAgIHNzck1hbmlmZXN0OiB0cnVlLCAvLyBHZW5lcmF0ZSBTU1IgbWFuaWZlc3RcbiAgICBlbXB0eU91dERpcjogdHJ1ZSwgLy8gQ2xlYW4gb3V0cHV0IGRpcmVjdG9yeSBiZWZvcmUgYnVpbGRcbiAgfVxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRWpCLE9BQU8sUUFBUTtBQUNmLE9BQU8sZUFBZTtBQUN0QixTQUFTLHVCQUF1QjtBQU5oQyxJQUFNLG1DQUFtQztBQVN6QyxJQUFNLFlBQVksTUFBYztBQUM5QixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxNQUFNLGNBQWM7QUFDbEIsY0FBUSxJQUFJLHdE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
