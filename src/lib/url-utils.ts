/**
 * Creates a URL-friendly slug from a string
 * @param str The string to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a hotel URL from its name
 * @param name Hotel name
 * @returns URL-friendly string of the name
 */
export function generateHotelUrl(name: string): string {
  return slugify(name);
}

/**
 * Finds a hotel by its slug in the database
 * This function will be used to look up hotels by their slugified name
 * @param slug The hotel slug from the URL
 * @returns The hotel data or null if not found
 */
export async function getHotelBySlug(slug: string) {
  try {
    // Find the hotel where the slugified name matches the slug
    const { data, error } = await import('@/integrations/supabase/client').then(module => {
      const supabase = module.supabase;
      return supabase
        .from('hotels')
        .select(`
          *,
          hotel_amenities(amenity),
          hotel_photos(id, photo_url, is_main_photo, description),
          hotel_rooms(id, name, description, price, capacity, size_sqm, amenities, photo_url)
        `)
        .or(`name.ilike.%${slug.replace(/-/g, ' ')}%`);
    });
    
    if (error) throw error;
    
    // Find the closest matching hotel
    if (data && data.length > 0) {
      // Sort by name similarity to find the best match
      const sortedData = data.sort((a, b) => {
        const aSlug = slugify(a.name);
        const bSlug = slugify(b.name);
        
        // Exact match gets highest priority
        if (aSlug === slug) return -1;
        if (bSlug === slug) return 1;
        
        // Otherwise compare by similarity
        return aSlug.localeCompare(bSlug);
      });
      
      return sortedData[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching hotel by slug:', error);
    return null;
  }
}
