
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Default fallback values to prevent errors when env vars are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdzlruiekcznbcicjgrz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';

// Add extremely aggressive cache control headers to all requests
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    auth: {
      persistSession: true,
      // Generate a completely unique storage key on every page load
      storageKey: `supabase-auth-token-${Date.now()}-${Math.random().toString(36).substring(2)}`
    },
    global: {
      // Force fetch to bypass cache
      fetch: (url, options) => {
        const uniqueUrl = url.includes('?') 
          ? `${url}&_cache_bust=${Date.now()}-${Math.random()}`
          : `${url}?_cache_bust=${Date.now()}-${Math.random()}`;
        return fetch(uniqueUrl, {
          ...options,
          cache: 'no-cache',
          headers: {
            ...options?.headers,
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
    }
  }
);

// Function to log Supabase response for debugging purposes
export function logSupabaseResponse(operation: string, data: any, error: any) {
  if (error) {
    console.error(`Supabase ${operation} error:`, error);
    return false;
  } else {
    console.log(`Supabase ${operation} data:`, data);
    return true;
  }
  
  // For backward compatibility, still return the data and error
  return { data, error };
}

// Helper function to generate dynamic room image paths with ultra-aggressive caching prevention
export function getHotelRoomImagePath(photoUrl: string | undefined, hotelName: string | undefined): string {
  if (!photoUrl) {
    return '/placeholder.svg';
  }
  
  // Generate a truly unique cache buster with microsecond precision and multiple random values
  const timestamp = Date.now();
  const randomValue1 = Math.floor(Math.random() * 10000000);
  const randomValue2 = Math.random().toString(36).substring(2);
  const cacheBuster = `?v=${timestamp}.${randomValue1}.${randomValue2}`; 
  
  // Prevent image caching by always appending unique timestamp
  if (hotelName === 'Filadaki Villas') {
    // Check if the path already includes the filadaki-studios subdirectory
    if (photoUrl.includes('filadaki-studios/')) {
      return `/uploads/hotels/${photoUrl}${cacheBuster}`;
    } else {
      return `/uploads/hotels/filadaki-studios/${photoUrl}${cacheBuster}`;
    }
  }
  
  // For Morpheas Pension, handle paths with the subdirectory - improved path handling
  if (hotelName === 'Morpheas Pension & Apartments') {
    if (photoUrl.includes('morpheas-pension/')) {
      return `/uploads/hotels/${photoUrl}${cacheBuster}`;
    } else if (photoUrl.startsWith('/')) {
      // Handle absolute paths
      return `${photoUrl}${cacheBuster}`;
    } else {
      // Ensure proper subdirectory path
      return `/uploads/hotels/morpheas-pension/${photoUrl}${cacheBuster}`;
    }
  }
  
  // For Villa Olivia Clara, handle paths with the subdirectory - improved path handling
  if (hotelName === 'Villa Olivia Clara') {
    if (photoUrl.includes('villa-olivia-clara/')) {
      return `/uploads/hotels/${photoUrl}${cacheBuster}`;
    } else if (photoUrl.startsWith('/')) {
      // Handle absolute paths
      return `${photoUrl}${cacheBuster}`;
    } else {
      // Ensure proper subdirectory path
      return `/uploads/hotels/villa-olivia-clara/${photoUrl}${cacheBuster}`;
    }
  }
  
  // For other hotels, use the standard path
  return `/uploads/hotels/${photoUrl}${cacheBuster}`;
}

export default supabase;
