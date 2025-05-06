
/**
 * Enhanced fetch utility with built-in cache-busting
 * @param url The URL to fetch
 * @param options Standard fetch options
 * @returns Promise with fetch response
 */
export const cacheBustedFetch = async (url: string, options?: RequestInit) => {
  // Add cache-busting query parameter
  const cacheBuster = `_cb=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const separator = url.includes('?') ? '&' : '?';
  const cacheBustedUrl = `${url}${separator}${cacheBuster}`;
  
  // Add cache-control headers to prevent caching
  const enhancedOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };
  
  console.log(`Fetching with cache-busting: ${cacheBustedUrl}`);
  return fetch(cacheBustedUrl, enhancedOptions);
};
