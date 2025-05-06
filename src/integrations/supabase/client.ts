
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Default fallback values to prevent errors when env vars are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdzlruiekcznbcicjgrz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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

// Helper function to generate dynamic room image paths
export function getHotelRoomImagePath(photoUrl: string | undefined, hotelName: string | undefined): string {
  if (!photoUrl) {
    return '/placeholder.svg';
  }
  
  console.log(`Getting image path for room: ${photoUrl} in hotel: ${hotelName}`);
  
  // For Filadaki Villas, handle paths with the subdirectory
  if (hotelName === 'Filadaki Villas') {
    // Check if the path already includes the filadaki-studios subdirectory
    if (photoUrl.includes('filadaki-studios/')) {
      console.log(`Using path with subdirectory: /uploads/hotels/${photoUrl}`);
      return `/uploads/hotels/${photoUrl}`;
    } else {
      console.log(`Adding subdirectory: /uploads/hotels/filadaki-studios/${photoUrl}`);
      return `/uploads/hotels/filadaki-studios/${photoUrl}`;
    }
  }
  
  // For Morpheas Pension, handle paths with the subdirectory
  if (hotelName === 'Morpheas Pension & Apartments') {
    // Check if the path already includes the morpheas-pension subdirectory
    if (photoUrl.includes('morpheas-pension/')) {
      console.log(`Using path with subdirectory: /uploads/hotels/${photoUrl}`);
      return `/uploads/hotels/${photoUrl}`;
    } else {
      console.log(`Adding subdirectory: /uploads/hotels/morpheas-pension/${photoUrl}`);
      return `/uploads/hotels/morpheas-pension/${photoUrl}`;
    }
  }
  
  // For other hotels, use the standard path
  console.log(`Using standard path: /uploads/hotels/${photoUrl}`);
  return `/uploads/hotels/${photoUrl}`;
}

export default supabase;
