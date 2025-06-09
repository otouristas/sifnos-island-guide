// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
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
    mode === "development" && componentTagger(),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuaW1wb3J0IHsgUGx1Z2luIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHB1cHBldGVlciBmcm9tICdwdXBwZXRlZXInO1xuXG4vLyBFbmhhbmNlZCBwcmVyZW5kZXIgcGx1Z2luIHdpdGggUHVwcGV0ZWVyIGZvciBTRU8gb3B0aW1pemF0aW9uXG5jb25zdCBwcmVyZW5kZXIgPSAoKTogUGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncHJlcmVuZGVyJyxcbiAgICBhcHBseTogJ2J1aWxkJyxcbiAgICBhc3luYyBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBhZHZhbmNlZCBwcmVyZW5kZXJpbmcgZm9yIFNFTyBvcHRpbWl6YXRpb24uLi4nKTtcbiAgICAgIFxuICAgICAgLy8gS2V5IHJvdXRlcyB0aGF0IHNob3VsZCBiZSBwcmVyZW5kZXJlZCBmb3IgU0VPXG4gICAgICBjb25zdCByb3V0ZXMgPSBbXG4gICAgICAgICcvJyxcbiAgICAgICAgJy9ob3RlbHMnLFxuICAgICAgICAnL2xvY2F0aW9ucycsXG4gICAgICAgICcvaG90ZWwtdHlwZXMnLFxuICAgICAgICAnL2Jsb2cnLFxuICAgICAgICAnL2Fib3V0JyxcbiAgICAgICAgJy90cmF2ZWwtZ3VpZGUnLFxuICAgICAgICAnL2JlYWNoZXMnLFxuICAgICAgICAnL3RvdXJpc3Rhcy1haScsXG4gICAgICAgICcvZmFxJyxcbiAgICAgICAgJy9jb250YWN0JyxcbiAgICAgICAgJy9wcmljaW5nJyxcbiAgICAgICAgJy9wcml2YWN5LXBvbGljeScsXG4gICAgICAgICcvdGVybXMtb2Ytc2VydmljZScsXG4gICAgICAgICcvY29va2llLXBvbGljeSdcbiAgICAgIF07XG4gICAgICBcbiAgICAgIC8vIE91dHB1dCBkaXJlY3RvcnlcbiAgICAgIGNvbnN0IG91dHB1dERpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0Jyk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIExhdW5jaCBwdXBwZXRlZXJcbiAgICAgICAgY29uc3QgYnJvd3NlciA9IGF3YWl0IHB1cHBldGVlci5sYXVuY2goe1xuICAgICAgICAgIGhlYWRsZXNzOiB0cnVlLFxuICAgICAgICAgIGFyZ3M6IFsnLS1uby1zYW5kYm94JywgJy0tZGlzYWJsZS1zZXR1aWQtc2FuZGJveCddLFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3Qgcm91dGUgb2Ygcm91dGVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYFByZXJlbmRlcmluZyByb3V0ZTogJHtyb3V0ZX1gKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBDcmVhdGUgcGFnZVxuICAgICAgICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCBicm93c2VyLm5ld1BhZ2UoKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBTZXQgdmlld3BvcnRcbiAgICAgICAgICBhd2FpdCBwYWdlLnNldFZpZXdwb3J0KHsgd2lkdGg6IDEyMDAsIGhlaWdodDogODAwIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFdlJ3JlIGJ1aWxkaW5nIGEgc3RhdGljIGZpbGUsIHNvIHdlJ2xsIHVzZSBmaWxlOi8vIHByb3RvY29sXG4gICAgICAgICAgY29uc3QgaHRtbFBhdGggPSBwYXRoLmpvaW4ob3V0cHV0RGlyLCByb3V0ZSA9PT0gJy8nID8gJ2luZGV4Lmh0bWwnIDogYCR7cm91dGUuc3Vic3RyaW5nKDEpfS9pbmRleC5odG1sYCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgSFRNTCBmaWxlIGV4aXN0c1xuICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhodG1sUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTa2lwcGluZyAke3JvdXRlfSAtIEhUTUwgZmlsZSBub3QgZm91bmQgYXQgJHtodG1sUGF0aH1gKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBOYXZpZ2F0ZSB0byB0aGUgcGFnZVxuICAgICAgICAgIGF3YWl0IHBhZ2UuZ290byhgZmlsZTovLyR7aHRtbFBhdGh9YCwgeyB3YWl0VW50aWw6ICduZXR3b3JraWRsZTAnIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFdhaXQgZm9yIGFsbCBjb250ZW50IHRvIGxvYWQgcHJvcGVybHkgKGZpeCBmb3IgdGltZW91dCBpc3N1ZXMpXG4gICAgICAgICAgLy8gVXNpbmcgc2V0VGltZW91dCBpbnN0ZWFkIG9mIHdhaXRGb3JUaW1lb3V0IHdoaWNoIGlzbid0IGF2YWlsYWJsZSBpbiB0aGlzIFB1cHBldGVlciB2ZXJzaW9uXG4gICAgICAgICAgYXdhaXQgcGFnZS5ldmFsdWF0ZSgoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBHZXQgdGhlIHByZXJlbmRlcmVkIEhUTUxcbiAgICAgICAgICBjb25zdCBodG1sID0gYXdhaXQgcGFnZS5jb250ZW50KCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBkaXJlY3RvcnkgcGF0aCBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgICAgICAgY29uc3QgZGlyUGF0aCA9IHBhdGguZGlybmFtZShodG1sUGF0aCk7XG4gICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGRpclBhdGgpKSB7XG4gICAgICAgICAgICBmcy5ta2RpclN5bmMoZGlyUGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFdyaXRlIHRoZSBmaWxlXG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhodG1sUGF0aCwgaHRtbCk7XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc29sZS5sb2coYFx1MjcwNSBQcmVyZW5kZXJlZCAke3JvdXRlfWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENsb3NlIHBhZ2VcbiAgICAgICAgICBhd2FpdCBwYWdlLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENsb3NlIGJyb3dzZXJcbiAgICAgICAgYXdhaXQgYnJvd3Nlci5jbG9zZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnUHJlcmVuZGVyaW5nIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkhJyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJpbmcgcHJlcmVuZGVyaW5nOicsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG4vLyBFbmhhbmNlZCBjYWNoZS1idXN0aW5nIHBsdWdpbiB3aXRoIGltcHJvdmVkIHBlcmZvcm1hbmNlXG5jb25zdCBjbGVhckNhY2hlID0gKCk6IFBsdWdpbiA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2NsZWFyLWNhY2hlJyxcbiAgICBhcHBseTogJ2J1aWxkJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICBidWlsZFN0YXJ0KCkge1xuICAgICAgY29uc29sZS5sb2coJ1ByZXBhcmluZyBvcHRpbWl6ZWQgYnVpbGQgd2l0aCBjYWNoZSBtYW5hZ2VtZW50Li4uJyk7XG4gICAgfSxcbiAgICB0cmFuc2Zvcm1JbmRleEh0bWwoaHRtbCkge1xuICAgICAgLy8gR2VuZXJhdGUgdW5pcXVlIHZlcnNpb24gaWRlbnRpZmllciBiYXNlZCBvbiBidWlsZCB0aW1lXG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgICAgY29uc3QgYnVpbGRJZCA9IGBidWlsZC0ke3RpbWVzdGFtcH0tJHtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKX1gO1xuICAgICAgXG4gICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKFxuICAgICAgICAnPC9oZWFkPicsXG4gICAgICAgIGA8bWV0YSBodHRwLWVxdWl2PVwiQ2FjaGUtQ29udHJvbFwiIGNvbnRlbnQ9XCJuby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZVwiIC8+XG4gICAgICAgIDxtZXRhIGh0dHAtZXF1aXY9XCJQcmFnbWFcIiBjb250ZW50PVwibm8tY2FjaGVcIiAvPlxuICAgICAgICA8bWV0YSBodHRwLWVxdWl2PVwiRXhwaXJlc1wiIGNvbnRlbnQ9XCIwXCIgLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cInZlcnNpb25cIiBjb250ZW50PVwiJHtidWlsZElkfVwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJidWlsZC10aW1lc3RhbXBcIiBjb250ZW50PVwiJHtuZXcgRGF0ZSh0aW1lc3RhbXApLnRvSVNPU3RyaW5nKCl9XCIgLz5cbiAgICAgICAgPGxpbmsgcmVsPVwicHJlbG9hZFwiIGhyZWY9XCIvZm9udHMvaW50ZXIud29mZjJcIiBhcz1cImZvbnRcIiB0eXBlPVwiZm9udC93b2ZmMlwiIGNyb3Nzb3JpZ2luPlxuICAgICAgICA8bGluayByZWw9XCJwcmVjb25uZWN0XCIgaHJlZj1cImh0dHBzOi8vd2R6bHJ1aWVrY3puYmNpY2pncnouc3VwYWJhc2UuY29cIiBjcm9zc29yaWdpbj5cbiAgICAgICAgPHNjcmlwdD5cbiAgICAgICAgICAvLyBFbmhhbmNlZCBjYWNoZSByZWZyZXNoIHN0cmF0ZWd5XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghd2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgICAgICAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2UubmF2aWdhdGlvbi50eXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BhZ2Ugd2FzIHJlbG9hZGVkLCBlbnN1cmluZyBmcmVzaCBjb250ZW50Li4uJyk7XG4gICAgICAgICAgICAgICAgaWYgKCdjYWNoZXMnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgICAgICAgY2FjaGVzLmtleXMoKS50aGVuKGZ1bmN0aW9uKG5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgbmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5pbmNsdWRlcygnaG90ZWxzc2lmbm9zJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlcy5kZWxldGUobmFtZSkudGhlbigoKSA9PiBjb25zb2xlLmxvZygnQ2FjaGUgY2xlYXJlZDonLCBuYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVmcmVzaCBkeW5hbWljIGNvbnRlbnQgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1keW5hbWljLWNvbnRlbnRdJykuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBlbC5kYXRhc2V0LnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2godXJsICsgJz9fPScgKyBEYXRlLm5vdygpKVxuICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMub2sgPyByZXMuanNvbigpIDogbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSBlbC50ZXh0Q29udGVudCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIDwvc2NyaXB0PlxuICAgICAgICA8L2hlYWQ+YFxuICAgICAgKTtcbiAgICB9XG4gIH07XG59O1xuXG4vLyBEaXJlY3RvcnkgcmVzb2x2ZXIgcGx1Z2luIHRvIGhhbmRsZSBkaXJlY3RvcnkgaW1wb3J0cyBjb3JyZWN0bHlcbmNvbnN0IGRpcmVjdG9yeVJlc29sdmVyID0gKCk6IFBsdWdpbiA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2RpcmVjdG9yeS1yZXNvbHZlcicsXG4gICAgcmVzb2x2ZUlkKHNvdXJjZSwgaW1wb3J0ZXIpIHtcbiAgICAgIGlmIChzb3VyY2UgJiYgaW1wb3J0ZXIgJiYgIXNvdXJjZS5zdGFydHNXaXRoKCcuJykgJiYgIXNvdXJjZS5zdGFydHNXaXRoKCcvJykgJiYgIXBhdGguaXNBYnNvbHV0ZShzb3VyY2UpKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBTa2lwIG5vbi1yZWxhdGl2ZSBpbXBvcnRzXG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChzb3VyY2UgJiYgZnMuZXhpc3RzU3luYyhzb3VyY2UpICYmIGZzLnN0YXRTeW5jKHNvdXJjZSkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBjb25zdCBpbmRleEZpbGUgPSBwYXRoLmpvaW4oc291cmNlLCAnaW5kZXgudHMnKTtcbiAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaW5kZXhGaWxlKSkge1xuICAgICAgICAgIHJldHVybiBpbmRleEZpbGU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGluZGV4VHN4RmlsZSA9IHBhdGguam9pbihzb3VyY2UsICdpbmRleC50c3gnKTtcbiAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaW5kZXhUc3hGaWxlKSkge1xuICAgICAgICAgIHJldHVybiBpbmRleFRzeEZpbGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBkaXJlY3RvcnlSZXNvbHZlcigpLCAvLyBBZGQgb3VyIGRpcmVjdG9yeSByZXNvbHZlciBwbHVnaW5cbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nICYmIHByZXJlbmRlcigpLFxuICAgIGNsZWFyQ2FjaGUoKSwgLy8gUnVuIGluIGFsbCBtb2RlcyB0byBwcmV2ZW50IGNhY2hpbmcgaXNzdWVzXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIC8vIEVuaGFuY2VkIFNTUiBmZWF0dXJlc1xuICBzc3I6IHtcbiAgICAvLyBTU1Igc3BlY2lmaWMgY29uZmlnXG4gICAgbm9FeHRlcm5hbDogWydyZWFjdC1oZWxtZXQnXSxcbiAgICB0YXJnZXQ6ICdub2RlJyxcbiAgICBmb3JtYXQ6ICdlc20nXG4gIH0sXG4gIC8vIE9wdGltaXphdGlvbiBmb3IgYmV0dGVyIFNFTyBhbmQgcGVyZm9ybWFuY2VcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdtb2R1bGVzJyxcbiAgICBtb2R1bGVQcmVsb2FkOiB0cnVlLFxuICAgIG1pbmlmeTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gJ3RlcnNlcicgOiBmYWxzZSwgLy8gT25seSB1c2UgdGVyc2VyIGluIHByb2R1Y3Rpb25cbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IG1vZGUgPT09ICdwcm9kdWN0aW9uJywgLy8gUmVtb3ZlIGNvbnNvbGUgbG9ncyBpbiBwcm9kdWN0aW9uXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd1aS1saWInOiBbJ0AvY29tcG9uZW50cy91aS9pbmRleCddLFxuICAgICAgICAgICdzdXBhYmFzZSc6IFsnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ10sXG4gICAgICAgICAgJ3RvdXJpc3Rhcyc6IFsnQC9jb21wb25lbnRzL3RvdXJpc3Rhcy9pbmRleCddXG4gICAgICAgIH0sXG4gICAgICAgIC8vIEZpeGVkIGZpbGUgbmFtaW5nIHBhdHRlcm4gYnkgcmVtb3ZpbmcgdGhlIFt0aW1lXSBwbGFjZWhvbGRlclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyA6ICdhc3NldHMvW25hbWVdLmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycgOiAnYXNzZXRzL1tuYW1lXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nIDogJ2Fzc2V0cy9bbmFtZV0uW2V4dF0nXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBFbnN1cmUgYXNzZXRzIGFyZSBwcm9wZXJseSBoYXNoZWQgZm9yIGNhY2hlIGJ1c3RpbmdcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgIHNvdXJjZW1hcDogbW9kZSAhPT0gJ3Byb2R1Y3Rpb24nLCAvLyBEaXNhYmxlIHNvdXJjZW1hcHMgaW4gcHJvZHVjdGlvbiBmb3IgcGVyZm9ybWFuY2VcbiAgICBzc3JNYW5pZmVzdDogdHJ1ZSwgLy8gR2VuZXJhdGUgU1NSIG1hbmlmZXN0XG4gICAgZW1wdHlPdXREaXI6IHRydWUsIC8vIENsZWFuIG91dHB1dCBkaXJlY3RvcnkgYmVmb3JlIGJ1aWxkXG4gIH1cbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBRWhDLE9BQU8sUUFBUTtBQUNmLE9BQU8sZUFBZTtBQVB0QixJQUFNLG1DQUFtQztBQVV6QyxJQUFNLFlBQVksTUFBYztBQUM5QixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxNQUFNLGNBQWM7QUFDbEIs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
