import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateHotelUrl } from '@/lib/url-utils';
import { hotelTypes } from '@/data/hotelTypes';
import { sifnosLocations } from '@/data/locations';
import { blogPosts } from '@/data/blogPosts';

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
          loc: `${baseURL}/touristas-ai`,
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
      
      // Blog pages - enhanced to automatically include all blog posts
      const blogPages: SitemapURL[] = [
        {
          loc: `${baseURL}/blog`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        },
        ...blogPosts.map(post => ({
          loc: `${baseURL}/blog/${post.slug}`,
          lastmod: post.date,
          changefreq: 'monthly' as const,
          priority: post.categories.includes('Featured') ? 0.9 : 0.8
        }))
      ];
      
      // Locations pages - from data/locations.ts
      const locationPages: SitemapURL[] = [
        {
          loc: `${baseURL}/locations`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        },
        ...sifnosLocations.map(location => ({
          loc: `${baseURL}/locations/${location.slug}`,
          lastmod: currentDate,
          changefreq: 'weekly' as const,
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
          changefreq: 'weekly' as const,
          priority: 0.7
        }))
      ];
      
      // Get dynamic hotel pages from Supabase
      let hotelPages: SitemapURL[] = [];
      try {
        const { data: hotels, error } = await supabase
          .from('hotels')
          .select('id, name, updated_at, hotel_types, rating')
          .order('rating', { ascending: false });
        
        if (!error && hotels) {
          // Create sitemap entries for each hotel
          hotelPages = hotels.map(hotel => ({
            loc: `${baseURL}/hotels/${generateHotelUrl(hotel.name)}`,
            lastmod: new Date(hotel.updated_at).toISOString().split('T')[0],
            changefreq: 'weekly' as const,
            // Use optional chaining and nullish coalescing to safely handle missing rating
            priority: (hotel.rating >= 4) ? 0.8 : 0.7
          }));
          
          // Add featured hotels with higher priority
          const featuredHotels = [
            {name: "Meropi Rooms and Apartments", id: "meropi-rooms-and-apartments", priority: 0.9},
            {name: "Filadaki Villas", id: "filadaki-villas", priority: 0.9},
            {name: "ALK Hotel Sifnos", id: "alk-hotel-sifnos", priority: 0.8},
            {name: "Villa Olivia Clara", id: "villa-olivia-clara", priority: 0.8},
            {name: "Morpheas Pension & Apartments", id: "morpheas-pension-apartments", priority: 0.8}
          ];
          
          // Add each featured hotel, ensuring no duplicates
          featuredHotels.forEach(featured => {
            const urlSlug = generateHotelUrl(featured.name);
            const featureUrl = `${baseURL}/hotels/${urlSlug}`;
            
            // Check if it's already in hotelPages with this exact URL
            const existingIndex = hotelPages.findIndex(page => page.loc === featureUrl);
            
            if (existingIndex >= 0) {
              // Update the existing entry with higher priority
              hotelPages[existingIndex].priority = featured.priority;
              hotelPages[existingIndex].changefreq = 'daily';
              hotelPages[existingIndex].lastmod = currentDate; // Ensure the date is current
            } else {
              // Add new entry
              hotelPages.push({
                loc: featureUrl,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: featured.priority
              });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching hotels for sitemap:', error);
        
        // Add fallback entries for featured hotels if database fetch fails
        const fallbackHotels = [
          {name: "Meropi Rooms and Apartments", slug: "meropi-rooms-and-apartments", priority: 0.9},
          {name: "Filadaki Villas", slug: "filadaki-villas", priority: 0.9},
          {name: "ALK Hotel Sifnos", slug: "alk-hotel-sifnos", priority: 0.8},
          {name: "Villa Olivia Clara", slug: "villa-olivia-clara", priority: 0.8},
          {name: "Morpheas Pension & Apartments", slug: "morpheas-pension-apartments", priority: 0.8}
        ];
        
        hotelPages = fallbackHotels.map(hotel => ({
          loc: `${baseURL}/hotels/${hotel.slug}`,
          lastmod: currentDate,
          changefreq: 'daily' as const,
          priority: hotel.priority
        }));
      }
      
      // Combine all pages
      const allPages = [...staticPages, ...blogPages, ...locationPages, ...hotelTypePages, ...hotelPages];

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
      if (typeof window === 'undefined') {
        // SSR environment
        console.log('Generated sitemap (would be saved in SSR environment)');
      } else {
        // Browser environment - just log it
        console.log('Generated sitemap with', allPages.length, 'URLs');
        
        // For development purposes, output the sitemap to console
        if (import.meta.env.DEV) {
          console.log('Sitemap content:', sitemapContent);
        }
      }

      return sitemapContent;
    };

    generateSitemap();
  }, []);

  return null;
}
