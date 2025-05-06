
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Default fallback values to prevent errors when env vars are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdzlruiekcznbcicjgrz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';

// Add cache control headers to all requests
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    auth: {
      persistSession: true,
      // Use a timestamp in the storage key to ensure fresh sessions
      storageKey: `supabase-auth-token-${Date.now()}`
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

// Helper function to generate dynamic room image paths with improved caching
export function getHotelRoomImagePath(photoUrl: string | undefined, hotelName: string | undefined): string {
  if (!photoUrl) {
    return '/placeholder.svg';
  }
  
  // Generate an even stronger cache buster with microsecond precision and multiple random values
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 10000000);
  const cacheBuster = `?v=${timestamp}.${randomValue}`; 
  
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
