
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to log Supabase response for debugging purposes
export function logSupabaseResponse(data: any, error: any) {
  if (error) {
    console.error('Supabase error:', error);
  } else {
    console.log('Supabase data:', data);
  }
  return { data, error };
}

// Helper function to generate dynamic room image paths
export function getHotelRoomImagePath(photoUrl: string | undefined, hotelName: string | undefined): string {
  if (!photoUrl) {
    return '/placeholder.svg';
  }
  
  // For Filadaki Villas, handle paths with the subdirectory
  if (hotelName === 'Filadaki Villas') {
    // Check if the path already includes the filadaki-studios subdirectory
    if (photoUrl.includes('filadaki-studios/')) {
      return `/uploads/hotels/${photoUrl}`;
    } else {
      return `/uploads/hotels/filadaki-studios/${photoUrl}`;
    }
  }
  
  // For other hotels, use the standard path
  return `/uploads/hotels/${photoUrl}`;
}

export default supabase;
