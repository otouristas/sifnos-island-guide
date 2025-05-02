
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
 * Generates a hotel URL from its name and ID
 * @param name Hotel name
 * @param id Hotel ID
 * @returns URL-friendly string combining name and ID
 */
export function generateHotelUrl(name: string, id: string): string {
  return `${slugify(name)}-${id}`;
}

/**
 * Extracts the ID from a hotel slug
 * @param slug The hotel slug from the URL
 * @returns The hotel ID
 */
export function extractIdFromSlug(slug: string): string {
  // Find a UUID pattern in the slug
  // UUID format: 8-4-4-4-12 characters = 36 characters with dashes
  const matches = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  
  if (matches && matches[0]) {
    console.log('Found UUID in slug:', matches[0]);
    return matches[0];
  }
  
  // Fallback to old extraction method if UUID pattern isn't found
  console.log('No UUID pattern found, falling back to last segment extraction');
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
