import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateHotelUrl } from '@/lib/url-utils';
import { hotelTypes } from '@/data/hotelTypes';
import { sifnosLocations } from '@/data/locations';

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
          .select('id, name, updated_at, hotel_types');
        
        if (!error && hotels) {
          // Create sitemap entries for each hotel
          hotelPages = hotels.map(hotel => ({
            loc: `${baseURL}/hotels/${generateHotelUrl(hotel.name)}`,
            lastmod: new Date(hotel.updated_at).toISOString().split('T')[0],
            changefreq: 'weekly' as const,
            priority: 0.8
          }));
          
          // Ensure all hotels with their types are correctly indexed
          hotels.forEach(hotel => {
            if (hotel.hotel_types && hotel.hotel_types.length > 0) {
              console.log(`Hotel ${hotel.name} has types: ${hotel.hotel_types.join(', ')}`);
            }
          });
          
          // Add explicit entry for Meropi Rooms and Apartments
          const meropiHotel = hotels.find(hotel => 
            hotel.name === "Meropi Rooms and Apartments" || 
            hotel.id === "0c9632b6-db5c-4179-8122-0003896e465e"
          );
          
          if (meropiHotel) {
            console.log("Found Meropi hotel in database, ID:", meropiHotel.id);
            console.log("Meropi hotel URL slug:", generateHotelUrl(meropiHotel.name));
            
            // Ensure it's correctly included even if it's in the database
            const meropiUrl = `${baseURL}/hotels/meropi-rooms-and-apartments`;
            
            // Check if it's already in hotelPages with this exact URL
            const alreadyIncluded = hotelPages.some(page => page.loc === meropiUrl);
            
            if (!alreadyIncluded) {
              // Add it with higher priority as a featured property
              hotelPages.push({
                loc: meropiUrl,
                lastmod: currentDate,
                changefreq: 'daily' as const,
                priority: 0.9
              });
              console.log("Added Meropi Rooms and Apartments to sitemap with enhanced priority");
            }
          } else {
            // Add a manual entry if not found in database
            hotelPages.push({
              loc: `${baseURL}/hotels/meropi-rooms-and-apartments`,
              lastmod: currentDate,
              changefreq: 'daily' as const,
              priority: 0.9
            });
            console.log("Added manual entry for Meropi Rooms and Apartments");
          }
        }
      } catch (error) {
        console.error('Error fetching hotels for sitemap:', error);
        
        // Always ensure Meropi is in the sitemap even if database fetch fails
        hotelPages.push({
          loc: `${baseURL}/hotels/meropi-rooms-and-apartments`,
          lastmod: currentDate,
          changefreq: 'daily' as const,
          priority: 0.9
        });
        console.log("Added fallback entry for Meropi Rooms and Apartments due to database error");
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
