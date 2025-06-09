// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import fs from "fs";
import puppeteer from "file:///home/project/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
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
          const htmlPath = path.join(outputDir, route === "/" ? "index.html" : `${route.substring(1)}/index.html`);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwdXBwZXRlZXIgZnJvbSAncHVwcGV0ZWVyJztcblxuLy8gRW5oYW5jZWQgcHJlcmVuZGVyIHBsdWdpbiB3aXRoIFB1cHBldGVlciBmb3IgU0VPIG9wdGltaXphdGlvblxuY29uc3QgcHJlcmVuZGVyID0gKCk6IFBsdWdpbiA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ByZXJlbmRlcicsXG4gICAgYXBwbHk6ICdidWlsZCcsXG4gICAgYXN5bmMgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgYWR2YW5jZWQgcHJlcmVuZGVyaW5nIGZvciBTRU8gb3B0aW1pemF0aW9uLi4uJyk7XG4gICAgICBcbiAgICAgIC8vIEtleSByb3V0ZXMgdGhhdCBzaG91bGQgYmUgcHJlcmVuZGVyZWQgZm9yIFNFT1xuICAgICAgY29uc3Qgcm91dGVzID0gW1xuICAgICAgICAnLycsXG4gICAgICAgICcvaG90ZWxzJyxcbiAgICAgICAgJy9sb2NhdGlvbnMnLFxuICAgICAgICAnL2hvdGVsLXR5cGVzJyxcbiAgICAgICAgJy9ibG9nJyxcbiAgICAgICAgJy9hYm91dCcsXG4gICAgICAgICcvdHJhdmVsLWd1aWRlJyxcbiAgICAgICAgJy9iZWFjaGVzJyxcbiAgICAgICAgJy90b3VyaXN0YXMtYWknLFxuICAgICAgICAnL2ZhcScsXG4gICAgICAgICcvY29udGFjdCcsXG4gICAgICAgICcvcHJpY2luZycsXG4gICAgICAgICcvcHJpdmFjeS1wb2xpY3knLFxuICAgICAgICAnL3Rlcm1zLW9mLXNlcnZpY2UnLFxuICAgICAgICAnL2Nvb2tpZS1wb2xpY3knXG4gICAgICBdO1xuICAgICAgXG4gICAgICAvLyBPdXRwdXQgZGlyZWN0b3J5XG4gICAgICBjb25zdCBvdXRwdXREaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICAvLyBMYXVuY2ggcHVwcGV0ZWVyXG4gICAgICAgIGNvbnN0IGJyb3dzZXIgPSBhd2FpdCBwdXBwZXRlZXIubGF1bmNoKHtcbiAgICAgICAgICBoZWFkbGVzczogdHJ1ZSxcbiAgICAgICAgICBhcmdzOiBbJy0tbm8tc2FuZGJveCcsICctLWRpc2FibGUtc2V0dWlkLXNhbmRib3gnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHJvdXRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBQcmVyZW5kZXJpbmcgcm91dGU6ICR7cm91dGV9YCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ3JlYXRlIHBhZ2VcbiAgICAgICAgICBjb25zdCBwYWdlID0gYXdhaXQgYnJvd3Nlci5uZXdQYWdlKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gU2V0IHZpZXdwb3J0XG4gICAgICAgICAgYXdhaXQgcGFnZS5zZXRWaWV3cG9ydCh7IHdpZHRoOiAxMjAwLCBoZWlnaHQ6IDgwMCB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBXZSdyZSBidWlsZGluZyBhIHN0YXRpYyBmaWxlLCBzbyB3ZSdsbCB1c2UgZmlsZTovLyBwcm90b2NvbFxuICAgICAgICAgIGNvbnN0IGh0bWxQYXRoID0gcGF0aC5qb2luKG91dHB1dERpciwgcm91dGUgPT09ICcvJyA/ICdpbmRleC5odG1sJyA6IGAke3JvdXRlLnN1YnN0cmluZygxKX0vaW5kZXguaHRtbGApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENoZWNrIGlmIEhUTUwgZmlsZSBleGlzdHNcbiAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoaHRtbFBhdGgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU2tpcHBpbmcgJHtyb3V0ZX0gLSBIVE1MIGZpbGUgbm90IGZvdW5kIGF0ICR7aHRtbFBhdGh9YCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gTmF2aWdhdGUgdG8gdGhlIHBhZ2VcbiAgICAgICAgICBhd2FpdCBwYWdlLmdvdG8oYGZpbGU6Ly8ke2h0bWxQYXRofWAsIHsgd2FpdFVudGlsOiAnbmV0d29ya2lkbGUwJyB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBXYWl0IGZvciBhbGwgY29udGVudCB0byBsb2FkIHByb3Blcmx5IChmaXggZm9yIHRpbWVvdXQgaXNzdWVzKVxuICAgICAgICAgIC8vIFVzaW5nIHNldFRpbWVvdXQgaW5zdGVhZCBvZiB3YWl0Rm9yVGltZW91dCB3aGljaCBpc24ndCBhdmFpbGFibGUgaW4gdGhpcyBQdXBwZXRlZXIgdmVyc2lvblxuICAgICAgICAgIGF3YWl0IHBhZ2UuZXZhbHVhdGUoKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKSk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gR2V0IHRoZSBwcmVyZW5kZXJlZCBIVE1MXG4gICAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IHBhZ2UuY29udGVudCgpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgZGlyZWN0b3J5IHBhdGggaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgIGNvbnN0IGRpclBhdGggPSBwYXRoLmRpcm5hbWUoaHRtbFBhdGgpO1xuICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhkaXJQYXRoKSkge1xuICAgICAgICAgICAgZnMubWtkaXJTeW5jKGRpclBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBXcml0ZSB0aGUgZmlsZVxuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaHRtbFBhdGgsIGh0bWwpO1xuICAgICAgICAgIFxuICAgICAgICAgIGNvbnNvbGUubG9nKGBcdTI3MDUgUHJlcmVuZGVyZWQgJHtyb3V0ZX1gKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBDbG9zZSBwYWdlXG4gICAgICAgICAgYXdhaXQgcGFnZS5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDbG9zZSBicm93c2VyXG4gICAgICAgIGF3YWl0IGJyb3dzZXIuY2xvc2UoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1ByZXJlbmRlcmluZyBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5IScpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZHVyaW5nIHByZXJlbmRlcmluZzonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcblxuLy8gRW5oYW5jZWQgY2FjaGUtYnVzdGluZyBwbHVnaW4gd2l0aCBpbXByb3ZlZCBwZXJmb3JtYW5jZVxuY29uc3QgY2xlYXJDYWNoZSA9ICgpOiBQbHVnaW4gPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjbGVhci1jYWNoZScsXG4gICAgYXBwbHk6ICdidWlsZCcsXG4gICAgZW5mb3JjZTogJ3ByZScsXG4gICAgYnVpbGRTdGFydCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdQcmVwYXJpbmcgb3B0aW1pemVkIGJ1aWxkIHdpdGggY2FjaGUgbWFuYWdlbWVudC4uLicpO1xuICAgIH0sXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwpIHtcbiAgICAgIC8vIEdlbmVyYXRlIHVuaXF1ZSB2ZXJzaW9uIGlkZW50aWZpZXIgYmFzZWQgb24gYnVpbGQgdGltZVxuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgIGNvbnN0IGJ1aWxkSWQgPSBgYnVpbGQtJHt0aW1lc3RhbXB9LSR7TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCl9YDtcbiAgICAgIFxuICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShcbiAgICAgICAgJzwvaGVhZD4nLFxuICAgICAgICBgPG1ldGEgaHR0cC1lcXVpdj1cIkNhY2hlLUNvbnRyb2xcIiBjb250ZW50PVwibm8tY2FjaGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGVcIiAvPlxuICAgICAgICA8bWV0YSBodHRwLWVxdWl2PVwiUHJhZ21hXCIgY29udGVudD1cIm5vLWNhY2hlXCIgLz5cbiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj1cIkV4cGlyZXNcIiBjb250ZW50PVwiMFwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2ZXJzaW9uXCIgY29udGVudD1cIiR7YnVpbGRJZH1cIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwiYnVpbGQtdGltZXN0YW1wXCIgY29udGVudD1cIiR7bmV3IERhdGUodGltZXN0YW1wKS50b0lTT1N0cmluZygpfVwiIC8+XG4gICAgICAgIDxsaW5rIHJlbD1cInByZWxvYWRcIiBocmVmPVwiL2ZvbnRzL2ludGVyLndvZmYyXCIgYXM9XCJmb250XCIgdHlwZT1cImZvbnQvd29mZjJcIiBjcm9zc29yaWdpbj5cbiAgICAgICAgPGxpbmsgcmVsPVwicHJlY29ubmVjdFwiIGhyZWY9XCJodHRwczovL3dkemxydWlla2N6bmJjaWNqZ3J6LnN1cGFiYXNlLmNvXCIgY3Jvc3NvcmlnaW4+XG4gICAgICAgIDxzY3JpcHQ+XG4gICAgICAgICAgLy8gRW5oYW5jZWQgY2FjaGUgcmVmcmVzaCBzdHJhdGVneVxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgICAgICAgIGlmICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5hdmlnYXRpb24udHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQYWdlIHdhcyByZWxvYWRlZCwgZW5zdXJpbmcgZnJlc2ggY29udGVudC4uLicpO1xuICAgICAgICAgICAgICAgIGlmICgnY2FjaGVzJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgICAgICAgIGNhY2hlcy5rZXlzKCkudGhlbihmdW5jdGlvbihuYW1lcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIG5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJ2hvdGVsc3NpZm5vcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZXMuZGVsZXRlKG5hbWUpLnRoZW4oKCkgPT4gY29uc29sZS5sb2coJ0NhY2hlIGNsZWFyZWQ6JywgbmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFJlZnJlc2ggZHluYW1pYyBjb250ZW50IGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZHluYW1pYy1jb250ZW50XScpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gZWwuZGF0YXNldC5zb3VyY2U7XG4gICAgICAgICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZldGNoKHVybCArICc/Xz0nICsgRGF0ZS5ub3coKSlcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLm9rID8gcmVzLmpzb24oKSA6IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkgZWwudGV4dENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICA8L3NjcmlwdD5cbiAgICAgICAgPC9oZWFkPmBcbiAgICAgICk7XG4gICAgfVxuICB9O1xufTtcblxuLy8gRGlyZWN0b3J5IHJlc29sdmVyIHBsdWdpbiB0byBoYW5kbGUgZGlyZWN0b3J5IGltcG9ydHMgY29ycmVjdGx5XG5jb25zdCBkaXJlY3RvcnlSZXNvbHZlciA9ICgpOiBQbHVnaW4gPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdkaXJlY3RvcnktcmVzb2x2ZXInLFxuICAgIHJlc29sdmVJZChzb3VyY2UsIGltcG9ydGVyKSB7XG4gICAgICBpZiAoc291cmNlICYmIGltcG9ydGVyICYmICFzb3VyY2Uuc3RhcnRzV2l0aCgnLicpICYmICFzb3VyY2Uuc3RhcnRzV2l0aCgnLycpICYmICFwYXRoLmlzQWJzb2x1dGUoc291cmNlKSkge1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gU2tpcCBub24tcmVsYXRpdmUgaW1wb3J0c1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoc291cmNlICYmIGZzLmV4aXN0c1N5bmMoc291cmNlKSAmJiBmcy5zdGF0U3luYyhzb3VyY2UpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgY29uc3QgaW5kZXhGaWxlID0gcGF0aC5qb2luKHNvdXJjZSwgJ2luZGV4LnRzJyk7XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGluZGV4RmlsZSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXhGaWxlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBpbmRleFRzeEZpbGUgPSBwYXRoLmpvaW4oc291cmNlLCAnaW5kZXgudHN4Jyk7XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGluZGV4VHN4RmlsZSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXhUc3hGaWxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZGlyZWN0b3J5UmVzb2x2ZXIoKSwgLy8gQWRkIG91ciBkaXJlY3RvcnkgcmVzb2x2ZXIgcGx1Z2luXG4gICAgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nICYmIHByZXJlbmRlcigpLFxuICAgIGNsZWFyQ2FjaGUoKSwgLy8gUnVuIGluIGFsbCBtb2RlcyB0byBwcmV2ZW50IGNhY2hpbmcgaXNzdWVzXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIC8vIEVuaGFuY2VkIFNTUiBmZWF0dXJlc1xuICBzc3I6IHtcbiAgICAvLyBTU1Igc3BlY2lmaWMgY29uZmlnXG4gICAgbm9FeHRlcm5hbDogWydyZWFjdC1oZWxtZXQnXSxcbiAgICB0YXJnZXQ6ICdub2RlJyxcbiAgICBmb3JtYXQ6ICdlc20nXG4gIH0sXG4gIC8vIE9wdGltaXphdGlvbiBmb3IgYmV0dGVyIFNFTyBhbmQgcGVyZm9ybWFuY2VcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdtb2R1bGVzJyxcbiAgICBtb2R1bGVQcmVsb2FkOiB0cnVlLFxuICAgIG1pbmlmeTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gJ3RlcnNlcicgOiBmYWxzZSwgLy8gT25seSB1c2UgdGVyc2VyIGluIHByb2R1Y3Rpb25cbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IG1vZGUgPT09ICdwcm9kdWN0aW9uJywgLy8gUmVtb3ZlIGNvbnNvbGUgbG9ncyBpbiBwcm9kdWN0aW9uXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd1aS1saWInOiBbJ0AvY29tcG9uZW50cy91aS9pbmRleCddLFxuICAgICAgICAgICdzdXBhYmFzZSc6IFsnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ10sXG4gICAgICAgICAgJ3RvdXJpc3Rhcyc6IFsnQC9jb21wb25lbnRzL3RvdXJpc3Rhcy9pbmRleCddXG4gICAgICAgIH0sXG4gICAgICAgIC8vIEZpeGVkIGZpbGUgbmFtaW5nIHBhdHRlcm4gYnkgcmVtb3ZpbmcgdGhlIFt0aW1lXSBwbGFjZWhvbGRlclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyA6ICdhc3NldHMvW25hbWVdLmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycgOiAnYXNzZXRzL1tuYW1lXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nIDogJ2Fzc2V0cy9bbmFtZV0uW2V4dF0nXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBFbnN1cmUgYXNzZXRzIGFyZSBwcm9wZXJseSBoYXNoZWQgZm9yIGNhY2hlIGJ1c3RpbmdcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgIHNvdXJjZW1hcDogbW9kZSAhPT0gJ3Byb2R1Y3Rpb24nLCAvLyBEaXNhYmxlIHNvdXJjZW1hcHMgaW4gcHJvZHVjdGlvbiBmb3IgcGVyZm9ybWFuY2VcbiAgICBzc3JNYW5pZmVzdDogdHJ1ZSwgLy8gR2VuZXJhdGUgU1NSIG1hbmlmZXN0XG4gICAgZW1wdHlPdXREaXI6IHRydWUsIC8vIENsZWFuIG91dHB1dCBkaXJlY3RvcnkgYmVmb3JlIGJ1aWxkXG4gIH1cbn0pKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFFakIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxlQUFlO0FBTHRCLElBQU0sbUNBQW1DO0FBUXpDLElBQU0sWUFBWSxNQUFjO0FBQzlCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLE1BQU0sY0FBYztBQUNsQixjQUFRLElBQUksd0RBQXdEO0FBR3BFLFlBQU0sU0FBUztBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7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
