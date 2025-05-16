
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

/**
 * Get hotel details by URL slug
 * @param slug The URL-friendly slug for the hotel
 * @returns Hotel data with photos and amenities
 */
export async function getHotelBySlug(slug: string) {
  try {
    // Convert slug to a hotel name format (replace hyphens with spaces and capitalize words)
    const possibleHotelName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    console.log(`Looking for hotel with name similar to: ${possibleHotelName}`);

    // Query the hotels table for a hotel with a matching name
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select('*, hotel_photos(*), hotel_amenities(*)')
      .ilike('name', `%${possibleHotelName}%`)
      .limit(1);

    if (error) {
      console.error('Error fetching hotel by slug:', error);
      return null;
    }

    if (hotels && hotels.length > 0) {
      return hotels[0];
    }

    // If not found, try a broader search without exact matching
    const { data: fallbackHotels, error: fallbackError } = await supabase
      .from('hotels')
      .select('*, hotel_photos(*), hotel_amenities(*)')
      .limit(1);

    if (fallbackError) {
      console.error('Error in fallback hotel fetch:', fallbackError);
      return null;
    }

    // Return the first hotel as a fallback or null if no hotels found
    return fallbackHotels && fallbackHotels.length > 0 ? fallbackHotels[0] : null;
  } catch (error) {
    console.error('Unexpected error in getHotelBySlug:', error);
    return null;
  }
}

// Helper function to generate dynamic room image paths with improved caching
export function getHotelRoomImagePath(photoUrl: string | undefined, hotelName: string | undefined): string {
  if (!photoUrl) {
    return '/placeholder.svg';
  }
  
  // Generate a strong cache buster with both timestamp and random value
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `?v=${timestamp}-${randomValue}`; 
  
  // For Filadaki Villas, handle paths with the subdirectory
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
  
  // For ALK HOTEL, handle paths with the subdirectory
  if (hotelName === 'ALK HOTEL™') {
    if (photoUrl.includes('alk-hotel-sifnos/')) {
      return `/uploads/hotels/${photoUrl}${cacheBuster}`;
    } else if (photoUrl.startsWith('/')) {
      // Handle absolute paths
      return `${photoUrl}${cacheBuster}`;
    } else {
      // Ensure proper subdirectory path
      return `/uploads/hotels/alk-hotel-sifnos/${photoUrl}${cacheBuster}`;
    }
  }
  
  // For other hotels, use the standard path
  return `/uploads/hotels/${photoUrl}${cacheBuster}`;
}

export default supabase;
