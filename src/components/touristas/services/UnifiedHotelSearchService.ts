
import { searchUnifiedHotels, SearchParams, UnifiedHotel } from '@/services/hotelSearch';

// Extract dates from chat context if available
export function extractDatesFromMessage(message: string): { checkInDate?: string; checkOutDate?: string } {
  const dateRegex = /(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/g;
  const dates = message.match(dateRegex);
  
  if (dates && dates.length >= 2) {
    // Convert to YYYY-MM-DD format if needed
    const formatDate = (dateStr: string) => {
      if (dateStr.includes('/')) {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      if (dateStr.includes('-') && dateStr.length <= 10) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) return dateStr; // Already YYYY-MM-DD
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      return dateStr;
    };
    
    return {
      checkInDate: formatDate(dates[0]),
      checkOutDate: formatDate(dates[1])
    };
  }
  
  return {};
}

export async function searchHotelsUnified(query: string, preferences: Record<string, string> = {}): Promise<UnifiedHotel[]> {
  console.log('Searching unified hotels with query:', query, 'preferences:', preferences);
  
  // Extract search parameters
  const searchParams: SearchParams = {
    location: preferences.location,
    amenities: preferences.amenities,
    hotelName: preferences.hotelName,
    numberOfAdults: preferences.numberOfAdults ? parseInt(preferences.numberOfAdults) : 2,
    numberOfChildren: preferences.numberOfChildren ? parseInt(preferences.numberOfChildren) : 0,
  };
  
  // Try to extract dates from the query or preferences
  const datesFromQuery = extractDatesFromMessage(query);
  if (datesFromQuery.checkInDate) {
    searchParams.checkInDate = datesFromQuery.checkInDate;
  }
  if (datesFromQuery.checkOutDate) {
    searchParams.checkOutDate = datesFromQuery.checkOutDate;
  }
  
  // Use preference dates if available
  if (preferences.checkInDate) {
    searchParams.checkInDate = preferences.checkInDate;
  }
  if (preferences.checkOutDate) {
    searchParams.checkOutDate = preferences.checkOutDate;
  }
  
  try {
    const results = await searchUnifiedHotels(searchParams);
    console.log(`Found ${results.length} unified hotels (${results.filter(h => h.source === 'local').length} local, ${results.filter(h => h.source === 'agoda').length} from Agoda)`);
    return results;
  } catch (error) {
    console.error('Error searching unified hotels:', error);
    return [];
  }
}
