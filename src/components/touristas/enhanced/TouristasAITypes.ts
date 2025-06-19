
export interface AIMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  hotels?: HotelRecommendation[];
  hotelBundle?: HotelBundle;
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
