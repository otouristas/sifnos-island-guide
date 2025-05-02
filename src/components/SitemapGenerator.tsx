
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export default function SitemapGenerator() {
  useEffect(() => {
    const generateSitemap = async () => {
      const baseURL = 'https://hotelssifnos.com';
      const staticPages: SitemapURL[] = [
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
        },
        {
          loc: `${baseURL}/about-us`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.6
        },
        {
          loc: `${baseURL}/contact`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.5
        },
        {
          loc: `${baseURL}/faq`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.5
        }
      ];
      
      // Get dynamic hotel pages from Supabase
      let hotelPages: SitemapURL[] = [];
      try {
        const { data: hotels, error } = await supabase.from('hotels').select('id, updated_at');
        
        if (!error && hotels) {
          hotelPages = hotels.map(hotel => ({
            loc: `${baseURL}/hotels/${hotel.id}`,
            lastmod: new Date(hotel.updated_at).toISOString(),
            changefreq: 'weekly',
            priority: 0.8
          }));
        }
      } catch (error) {
        console.error('Error fetching hotels for sitemap:', error);
      }
      
      // Combine static and dynamic pages
      const allPages = [...staticPages, ...hotelPages];

      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${allPages.map(page => `
            <url>
              <loc>${page.loc}</loc>
              <lastmod>${page.lastmod}</lastmod>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>
          `).join('')}
        </urlset>`;

      // In a browser environment, we can't write to the file system directly
      // But in SSR/build environment, we might be able to
      if (typeof window === 'undefined') {
        // SSR environment
        console.log('Generated sitemap (would be saved in SSR environment)');
      } else {
        // Browser environment - just log it
        console.log('Generated sitemap:', sitemapContent);
      }

      return sitemapContent;
    };

    generateSitemap();
  }, []);

  return null;
}
