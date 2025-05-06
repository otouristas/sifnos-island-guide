
/**
 * URL utility functions
 * 
 * This file contains functions for generating URL-friendly slugs and paths for hotels and other entities.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a URL-friendly slug from a name
 * 
 * @param name The name to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(name: string): string {
  if (!name) return '';
  
  return name
    .toLowerCase()
    // Replace spaces, dots, and underscores with hyphens
    .replace(/[\s._]+/g, '-')
    // Remove non-alphanumeric characters (except hyphens)
    .replace(/[^a-z0-9-]+/g, '')
    // Replace multiple consecutive hyphens with a single hyphen
    .replace(/-+/g, '-')
    // Remove hyphens from the beginning and end
    .replace(/^-|-$/g, '');
}

/**
 * Generate a URL-friendly path for a hotel
 * 
 * @param name Hotel name
 * @returns URL-friendly path string
 */
export function generateHotelUrl(name: string | null | undefined): string {
  if (!name) {
    console.error('Hotel name is null or undefined');
    return '';
  }
  
  // Apply a series of transformations to create a URL-friendly slug
  return generateSlug(name);
}

/**
 * Retrieves a hotel from the database using its URL-friendly slug
 * 
 * @param slug URL-friendly slug of the hotel
 * @returns Promise resolving to the hotel data or null if not found
 */
export async function getHotelBySlug(slug: string): Promise<any | null> {
  try {
    console.log('Getting hotel by slug:', slug);
    
    // Get all hotels from the database
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo)
      `);
    
    if (error) {
      console.error('Error fetching hotels:', error);
      return null;
    }
    
    if (!hotels || hotels.length === 0) {
      console.log('No hotels found');
      return null;
    }
    
    // Find the hotel where the slug matches the generated URL from the hotel name
    const hotel = hotels.find((h: any) => {
      const hotelSlug = generateHotelUrl(h.name);
      return hotelSlug === slug;
    });
    
    if (hotel) {
      console.log(`Found ${hotel.name} hotel in database, ID: ${hotel.id}`);
      console.log(`${hotel.name} hotel URL slug: ${generateHotelUrl(hotel.name)}`);
      return hotel;
    } else {
      console.log(`Hotel with slug "${slug}" not found`);
      return null;
    }
  } catch (error) {
    console.error('Error in getHotelBySlug:', error);
    return null;
  }
}

/**
 * Retrieves a hotel from the database using its unique ID
 * 
 * @param id Unique identifier of the hotel
 * @returns Promise resolving to the hotel data or null if not found
 */
export async function getHotelById(id: string): Promise<any | null> {
  try {
    console.log('Getting hotel by ID:', id);
    
    // Query the database for a specific hotel by ID
    const { data: hotel, error } = await supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo),
        hotel_rooms(*)
      `)
      .eq('id', id as string)
      .single();
    
    if (error) {
      console.error('Error fetching hotel by ID:', error);
      return null;
    }
    
    if (hotel) {
      console.log(`Found hotel: ${hotel.name}`);
      return hotel;
    } else {
      console.log(`Hotel with ID "${id}" not found`);
      return null;
    }
  } catch (error) {
    console.error('Error in getHotelById:', error);
    return null;
  }
}

/**
 * Generates a URL for a hotel type
 * 
 * @param type Hotel type (e.g. 'beach-hotels')
 * @returns URL-friendly string
 */
export function generateHotelTypeUrl(type: string): string {
  return generateSlug(type);
}

/**
 * Retrieves a sitemap containing URLs for all site entities
 * 
 * @returns Collection of URLs for the sitemap
 */
export async function generateSitemapUrls(): Promise<string[]> {
  const baseUrl = 'https://hotelssifnos.com';
  
  // Static paths
  const staticPaths = [
    '',
    '/hotels',
    '/beaches',
    '/locations',
    '/hotel-types',
    '/contact',
    '/about',
    '/pricing',
    '/travel-guide',
  ];
  
  let urls = staticPaths.map(path => `${baseUrl}${path}`);
  
  try {
    // Get all hotels
    const { data: hotels, error: hotelsError } = await supabase
      .from('hotels')
      .select('id, name');
    
    if (hotelsError) {
      console.error('Error fetching hotels for sitemap:', hotelsError);
    } else if (hotels && hotels.length > 0) {
      const hotelUrls = hotels.map((hotel: any) => {
        const slug = generateHotelUrl(hotel.name);
        return `${baseUrl}/hotels/${slug}`;
      });
      urls = urls.concat(hotelUrls);
    }
    
    // Get all hotel types (from constant)
    const hotelTypes = [
      'beach-hotels',
      'luxury-hotels',
      'boutique-hotels',
      'family-friendly-hotels',
      'traditional-hotels',
      'luxury-villas',
    ];
    
    const hotelTypeUrls = hotelTypes.map(type => `${baseUrl}/hotel-types/${type}`);
    urls = urls.concat(hotelTypeUrls);
    
    // Get all locations
    const locations = [
      'apollonia', 
      'artemonas', 
      'kamares', 
      'kastro', 
      'platis-gialos', 
      'vathi',
      'faros',
      'cheronissos',
      'exampela',
    ];
    
    const locationUrls = locations.map(location => `${baseUrl}/locations/${location}`);
    urls = urls.concat(locationUrls);
    
    // Get all beaches
    const beaches = [
      'vathi',
      'platis-gialos',
      'kamares',
      'faros',
      'chrysopigi',
      'vroulidia',
      'fykiada',
      'cheronissos',
      'apokofto',
      'gialos',
    ];
    
    const beachUrls = beaches.map(beach => `${baseUrl}/beaches/${beach}`);
    urls = urls.concat(beachUrls);
    
    console.log('Generated sitemap with', urls.length, 'URLs');
    return urls;
  } catch (error) {
    console.error('Error generating sitemap URLs:', error);
    return urls;
  }
}

/**
 * Generates an XML sitemap from an array of URLs
 * 
 * @param urls Array of URLs to include in the sitemap
 * @returns XML sitemap as string
 */
export function generateXmlSitemap(urls: string[]): string {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  urls.forEach(url => {
    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });
  
  xml += `</urlset>`;
  
  return xml;
}

/**
 * Updates the sitemap in Supabase storage
 * 
 * @param sitemap XML sitemap string to store
 * @returns Promise resolving to success status and URL of the saved sitemap
 */
export async function updateSitemap(sitemap: string): Promise<{success: boolean, url?: string, message?: string}> {
  try {
    const timestamp = Date.now();
    const cacheBuster = Math.random().toString(36).substring(2, 10);
    
    // Call the edge function to update the sitemap
    const { data, error } = await supabase.functions.invoke('update-sitemap', {
      body: { 
        sitemap, 
        timestamp, 
        cacheBuster 
      }
    });
    
    if (error) {
      console.error('Error updating sitemap:', error);
      return { 
        success: false, 
        message: `Failed to update sitemap: ${error.message || 'Unknown error'}`
      };
    }
    
    if (!data || !data.success) {
      return { 
        success: false, 
        message: data?.message || 'Failed to update sitemap'
      };
    }
    
    return { 
      success: true, 
      url: data.url,
      message: data.message
    };
    
  } catch (error) {
    console.error('Error updating sitemap:', error);
    return { 
      success: false, 
      message: `Exception updating sitemap: ${(error as Error).message}` 
    };
  }
}
