
import { useEffect } from 'react';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export default function SitemapGenerator() {
  useEffect(() => {
    const generateSitemap = () => {
      const baseURL = 'https://hotelssifnos.com';
      const pages: SitemapURL[] = [
        {
          loc: `${baseURL}/`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 1.0
        },
        {
          loc: `${baseURL}/hotels`,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseURL}/beaches`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8
        },
        {
          loc: `${baseURL}/travel-guide`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.7
        }
      ];

      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${pages.map(page => `
            <url>
              <loc>${page.loc}</loc>
              <lastmod>${page.lastmod}</lastmod>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>
          `).join('')}
        </urlset>`;

      console.log('Generated sitemap:', sitemapContent);
      return sitemapContent;
    };

    generateSitemap();
  }, []);

  return null;
}
