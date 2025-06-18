import { searchHotels, Hotel } from '@/services/hotelSearch';

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

interface SearchParams {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  location?: string;
}

export const searchHotelsUnified = async (query: string): Promise<Hotel[]> => {
  return UnifiedHotelSearchService.searchHotels(query);
};

export class UnifiedHotelSearchService {
  static async searchHotels(query: string): Promise<Hotel[]> {
    try {
      console.log('UnifiedHotelSearchService: Searching for:', query);
      
      // Extract search parameters from the query
      const searchParams = this.extractSearchParams(query);
      
      // Use the unified search service
      const results = await searchHotels(searchParams);
      
      console.log(`UnifiedHotelSearchService: Found ${results.length} hotels`);
      return results;
      
    } catch (error) {
      console.error('UnifiedHotelSearchService: Search error:', error);
      return [];
    }
  }

  private static extractSearchParams(query: string): SearchParams {
    const params: SearchParams = {};
    
    // Simple keyword extraction - you can enhance this with NLP
    const lowerQuery = query.toLowerCase();
    
    // Extract location hints
    const locationKeywords = ['kamares', 'apollonia', 'artemonas', 'kastro', 'plathys gialos', 'faros', 'vathi'];
    for (const location of locationKeywords) {
      if (lowerQuery.includes(location)) {
        params.location = location;
        break;
      }
    }
    
    // Extract guest count
    const adultMatch = lowerQuery.match(/(\d+)\s*(?:adult|person|guest|people)/);
    if (adultMatch) {
      params.numberOfAdults = parseInt(adultMatch[1]);
    }
    
    const childMatch = lowerQuery.match(/(\d+)\s*(?:child|kid)/);
    if (childMatch) {
      params.numberOfChildren = parseInt(childMatch[1]);
    }
    
    // Extract dates (basic pattern matching)
    const datePatterns = [
      /(\d{4}-\d{2}-\d{2})/g,
      /(\d{1,2}\/\d{1,2}\/\d{4})/g,
      /(\d{1,2}-\d{1,2}-\d{4})/g
    ];
    
    for (const pattern of datePatterns) {
      const matches = lowerQuery.match(pattern);
      if (matches && matches.length >= 2) {
        params.checkInDate = this.normalizeDate(matches[0]);
        params.checkOutDate = this.normalizeDate(matches[1]);
        break;
      }
    }
    
    return params;
  }
  
  private static normalizeDate(dateStr: string): string {
    try {
      // Convert various date formats to YYYY-MM-DD
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn('Failed to parse date:', dateStr);
    }
    return '';
  }
}
