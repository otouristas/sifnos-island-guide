
export interface FerryRoute {
  id: string;
  company: string;
  vessel: string;
  logo: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice?: number;
  currency: string;
  refundable: 'Non Refundable' | 'Partially Refundable' | 'Fully Refundable';
  available: boolean;
  badges?: string[];
  discount?: string;
}

export interface FerrySearchResult {
  route: string;
  date: string;
  ferries: FerryRoute[];
}

export interface TravelPackage {
  id: string;
  name: string;
  description: string;
  outboundFerry: FerryRoute;
  returnFerry?: FerryRoute;
  hotel: HotelRecommendation;
  totalPrice: number;
  savings: number;
  duration: string;
}

export interface AIMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  hotels?: HotelRecommendation[];
  hotelBundle?: HotelBundle;
  ferries?: FerrySearchResult;
  travelPackage?: TravelPackage;
  suggestions?: string[];
  isTyping?: boolean;
  context?: MessageContext;
}

export interface HotelRecommendation {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  source: 'local' | 'agoda';
  description: string;
  bestFor: string[];
  bookingUrl?: string;
  availability?: {
    checkIn: string;
    checkOut: string;
    available: boolean;
  };
}

export interface HotelBundle {
  id: string;
  name: string;
  theme: string;
  totalPrice: number;
  savings: number;
  hotels: HotelRecommendation[];
  duration: string;
  occasion: string;
  highlights: string[];
  itinerary: string[];
}

export interface MessageContext {
  topic: string;
  location?: string;
  budget?: string;
  travelers?: string;
  duration?: string;
  interests?: string[];
  checkIn?: string;
  checkOut?: string;
}

export interface QuickPrompt {
  id: string;
  text: string;
  category: 'location' | 'budget' | 'occasion' | 'amenity' | 'real_time' | 'local_content' | 'local_hotels' | 'hybrid' | 'general' | 'test';
  keywords?: string[];
}
