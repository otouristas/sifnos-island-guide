
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateHotelUrl } from '@/lib/url-utils';
import { hotelTypes } from '@/data/hotelTypes';
import { locations } from '@/data/locations';

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
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // These are all the routes defined in App.tsx
      const staticPages: SitemapURL[] = [
        {
          loc: `${baseURL}/`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 1.0
        },
        {
          loc: `${baseURL}/hotels`,
          lastmod: currentDate,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseURL}/beaches`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        },
        {
          loc: `${baseURL}/travel-guide`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.7
        },
        // Both /about and /about-us routes exist in App.tsx
        {
          loc: `${baseURL}/about`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.6
        },
        {
          loc: `${baseURL}/about-us`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.6
        },
        {
          loc: `${baseURL}/contact`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.5
        },
        {
          loc: `${baseURL}/faq`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.5
        },
        // Additional pages from App.tsx
        {
          loc: `${baseURL}/pricing`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.7
        },
        {
          loc: `${baseURL}/privacy-policy`,
          lastmod: currentDate,
          changefreq: 'yearly',
          priority: 0.3
        },
        {
          loc: `${baseURL}/terms-of-service`,
          lastmod: currentDate,
          changefreq: 'yearly',
          priority: 0.3
        },
        {
          loc: `${baseURL}/cookie-policy`,
          lastmod: currentDate,
          changefreq: 'yearly',
          priority: 0.3
        }
      ];
      
      // Locations pages - from data/locations.ts
      const locationPages: SitemapURL[] = [
        {
          loc: `${baseURL}/locations`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        },
        ...locations.map(location => ({
          loc: `${baseURL}/locations/${location.slug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.7
        }))
      ];
      
      // Hotel Types pages - from data/hotelTypes.ts
      const hotelTypePages: SitemapURL[] = [
        {
          loc: `${baseURL}/hotel-types`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        },
        ...hotelTypes.map(type => ({
          loc: `${baseURL}/hotel-types/${type.slug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.7
        }))
      ];
      
      // Get dynamic hotel pages from Supabase
      let hotelPages: SitemapURL[] = [];
      try {
        const { data: hotels, error } = await supabase.from('hotels').select('id, name, updated_at');
        
        if (!error && hotels) {
          hotelPages = hotels.map(hotel => ({
            loc: `${baseURL}/hotels/${generateHotelUrl(hotel.name)}`,
            lastmod: new Date(hotel.updated_at).toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: 0.8
          }));
        }
      } catch (error) {
        console.error('Error fetching hotels for sitemap:', error);
      }
      
      // Combine all pages
      const allPages = [...staticPages, ...locationPages, ...hotelTypePages, ...hotelPages];

      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // In a browser environment, we can't write to the file system directly
      // But in SSR/build environment, we might be able to
      if (typeof window === 'undefined') {
        // SSR environment
        console.log('Generated sitemap (would be saved in SSR environment)');
      } else {
        // Browser environment - just log it
        console.log('Generated sitemap with', allPages.length, 'URLs');
      }

      return sitemapContent;
    };

    generateSitemap();
  }, []);

  return null;
}
