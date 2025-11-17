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
  images?: Array<{
    loc: string;
    title?: string;
    caption?: string;
    geo_location?: string;
  }>;
}

// Update the HotelData interface to correctly represent the data structure from Supabase
interface HotelData {
  id: string;
  name: string;
  updated_at: string;
  hotel_types?: string[] | null; // Changed from string to string[] | null
  rating?: number | null;
  images?: string[] | null;
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
          priority: 1.0,
          images: [
            {
              loc: `${baseURL}/uploads/sifnos-hero.jpg`,
              title: 'Sifnos Island Panorama',
              caption: 'Beautiful panoramic view of Sifnos Island in the Cyclades',
              geo_location: 'Sifnos, Greece'
            },
            {
              loc: `${baseURL}/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png`,
              title: 'Hotels Sifnos Logo',
              caption: 'Official logo of Hotels Sifnos website'
            }
          ]
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
          priority: 0.8,
          images: [
            {
              loc: `${baseURL}/uploads/beaches/plats-gialos.webp`,
              title: 'Platis Gialos Beach Sifnos',
              caption: 'The longest sandy beach on the island of Sifnos',
              geo_location: 'Platis Gialos, Sifnos, Greece'
            },
            {
              loc: `${baseURL}/uploads/beaches/vathi.webp`,
              title: 'Vathi Beach Sifnos',
              caption: 'Protected sandy bay with crystal clear waters',
              geo_location: 'Vathi, Sifnos, Greece'
            }
          ]
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
      
      // Blog pages - enhanced to automatically include all blog posts with images
      // Use date as lastmod if available
      const blogPages: SitemapURL[] = [
        {
          loc: `${baseURL}/blog`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8,
          images: [
            {
              loc: `${baseURL}/uploads/sifnos-og-image.jpg`,
              title: 'Sifnos Travel Blog',
              caption: 'Discover the best of Sifnos with our travel guides'
            }
          ]
        },
        ...blogPosts.map(post => ({
          loc: `${baseURL}/blog/${post.slug}`,
          lastmod: post.date, // Use post.date since we've confirmed it exists
          changefreq: 'monthly' as const,
          priority: post.categories.includes('Featured') ? 0.9 : 0.8,
          images: [
            {
              loc: `${baseURL}${post.featuredImage}`,
              title: post.title,
              caption: post.excerpt
            }
          ]
        }))
      ];
      
      // Locations pages - from data/locations.ts
      const locationPages: SitemapURL[] = [
        {
          loc: `${baseURL}/locations`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8,
          images: [
            {
              loc: `${baseURL}/uploads/beaches/apollonia.webp`,
              title: 'Apollonia - Capital of Sifnos',
              geo_location: 'Apollonia, Sifnos, Greece'
            },
            {
              loc: `${baseURL}/uploads/beaches/kastro.webp`,
              title: 'Kastro - Medieval Village of Sifnos',
              geo_location: 'Kastro, Sifnos, Greece'
            }
          ]
        },
        ...sifnosLocations.map(location => ({
          loc: `${baseURL}/locations/${location.slug}`,
          lastmod: currentDate,
          changefreq: 'weekly' as const,
          priority: 0.7,
          images: [
            {
              loc: `${baseURL}${location.imageUrl}`,
              title: `${location.name} - Sifnos Island`,
              caption: location.shortDescription,
              geo_location: `${location.name}, Sifnos, Greece`
            }
          ]
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
          priority: 0.7,
          images: [
            {
              loc: `${baseURL}${type.imageUrl}`,
              title: `${type.title} in Sifnos`,
              caption: type.shortDescription
            }
          ]
        }))
      ];
      
      // Get dynamic hotel pages from Supabase
      let hotelPages: SitemapURL[] = [];
      try {
        const { data: hotels, error } = await supabase
          .from('hotels')
          .select('id, name, updated_at, hotel_types, rating, is_featured, featured_tier, featured_priority');
        
        if (!error && hotels) {
          // Create sitemap entries for each hotel with correct type handling
          hotelPages = hotels.map((hotel: any) => {
            // Featured hotels get higher priority based on tier
            let priority = (hotel.rating && hotel.rating >= 4) ? 0.8 : 0.7;
            let changefreq: 'daily' | 'weekly' = 'weekly';
            
            if (hotel.is_featured) {
              // Set priority based on featured tier
              switch (hotel.featured_tier) {
                case 'platinum':
                  priority = 0.95;
                  break;
                case 'gold':
                  priority = 0.9;
                  break;
                case 'silver':
                  priority = 0.85;
                  break;
                case 'bronze':
                  priority = 0.8;
                  break;
                default:
                  priority = 0.85;
              }
              changefreq = 'daily';
            }
            
            return {
              loc: `${baseURL}/hotels/${generateHotelUrl(hotel.name)}`,
              lastmod: hotel.updated_at ? new Date(hotel.updated_at).toISOString().split('T')[0] : currentDate,
              changefreq: changefreq,
              priority: priority
            };
          });
          
          // Sort by priority (highest first) to ensure featured hotels appear early
          hotelPages.sort((a, b) => b.priority - a.priority);
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

      // Generate standard sitemap
      const sitemapContent = generateStandardSitemap(allPages);
      
      // Generate image sitemap
      const imageSitemapContent = generateImageSitemap(allPages);

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
          console.log('Image sitemap content:', imageSitemapContent);
        }
      }

      return {
        standard: sitemapContent,
        image: imageSitemapContent
      };
    };

    generateSitemap();
  }, []);
  
  // Function to generate standard sitemap
  const generateStandardSitemap = (pages: SitemapURL[]) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  };
  
  // Function to generate image sitemap
  const generateImageSitemap = (pages: SitemapURL[]) => {
    // Only include pages with images
    const pagesWithImages = pages.filter(page => page.images && page.images.length > 0);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pagesWithImages.map(page => `  <url>
    <loc>${page.loc}</loc>
${page.images?.map(image => `    <image:image>
      <image:loc>${image.loc}</image:loc>
      ${image.title ? `<image:title>${image.title}</image:title>` : ''}
      ${image.caption ? `<image:caption>${image.caption}</image:caption>` : ''}
      ${image.geo_location ? `<image:geo_location>${image.geo_location}</image:geo_location>` : ''}
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>`;
  };

  return null;
}
