
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
  // The ID is the part after the last dash
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
