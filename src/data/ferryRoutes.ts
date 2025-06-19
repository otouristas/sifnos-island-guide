import type { FerryRoute } from '@/components/touristas/enhanced/TouristasAITypes';

export const FERRY_COMPANIES = {
  'Aegean Sea Lines': '/uploads/ferries/aegean-sea-lines.png',
  'Fast Ferries': '/uploads/ferries/fast-ferries.png',
  'Seajets': '/uploads/ferries/seajets.png',
  'Magic Ferries': '/uploads/ferries/magic-ferries.png',
  'Blue Star Ferries': '/uploads/ferries/blue-star-ferries.png',
  'Zante Ferries': '/uploads/ferries/zante.png',
} as const;

// Demo ferry routes from Piraeus to Sifnos
export const PIRAEUS_TO_SIFNOS_ROUTES: FerryRoute[] = [
  {
    id: 'asl-anemos-morning',
    company: 'Aegean Sea Lines',
    vessel: 'Anemos',
    logo: FERRY_COMPANIES['Aegean Sea Lines'],
    departure: '07:00',
    arrival: '11:05',
    duration: '04h 05m',
    price: 43.00,
    currency: '€',
    refundable: 'Non Refundable',
    available: true,
    badges: []
  },
  {
    id: 'ff-dionisios-morning',
    company: 'Fast Ferries',
    vessel: 'Dionisios Solomos',
    logo: FERRY_COMPANIES['Fast Ferries'],
    departure: '07:15',
    arrival: '12:35',
    duration: '05h 20m',
    price: 40.50,
    currency: '€',
    refundable: 'Non Refundable',
    available: true,
    badges: []
  },
  {
    id: 'sj-champion-morning',
    company: 'Seajets',
    vessel: 'Champion Jet 1',
    logo: FERRY_COMPANIES['Seajets'],
    departure: '07:30',
    arrival: '10:05',
    duration: '02h 35m',
    price: 68.70,
    currency: '€',
    refundable: 'Non Refundable',
    available: false,
    badges: ['Recommended']
  },
  {
    id: 'sj-champion-afternoon',
    company: 'Seajets',
    vessel: 'Champion Jet 1',
    logo: FERRY_COMPANIES['Seajets'],
    departure: '15:50',
    arrival: '18:20',
    duration: '02h 30m',
    price: 68.70,
    currency: '€',
    refundable: 'Non Refundable',
    available: false,
    badges: ['Fastest']
  }
];

// Demo ferry routes from Sifnos to Piraeus
export const SIFNOS_TO_PIRAEUS_ROUTES: FerryRoute[] = [
  {
    id: 'sj-champion-return-afternoon',
    company: 'Seajets',
    vessel: 'Champion Jet 1',
    logo: FERRY_COMPANIES['Seajets'],
    departure: '14:05',
    arrival: '16:40',
    duration: '02h 35m',
    price: 68.70,
    currency: '€',
    refundable: 'Partially Refundable',
    available: false,
    badges: []
  },
  {
    id: 'asl-anemos-return-afternoon',
    company: 'Aegean Sea Lines',
    vessel: 'Anemos',
    logo: FERRY_COMPANIES['Aegean Sea Lines'],
    departure: '16:25',
    arrival: '21:30',
    duration: '05h 05m',
    price: 34.40,
    originalPrice: 43.00,
    currency: '€',
    refundable: 'Partially Refundable',
    available: true,
    badges: ['Recommended'],
    discount: '20% OFF'
  },
  {
    id: 'sj-speedrunner-return-evening',
    company: 'Seajets',
    vessel: 'Speedrunner Jet',
    logo: FERRY_COMPANIES['Seajets'],
    departure: '17:25',
    arrival: '19:55',
    duration: '02h 30m',
    price: 68.70,
    currency: '€',
    refundable: 'Partially Refundable',
    available: false,
    badges: ['Fastest']
  }
];

export function getFerryRoutes(from: string, to: string, date?: string): FerryRoute[] {
  const route = `${from.toLowerCase()}-${to.toLowerCase()}`;
  
  switch (route) {
    case 'piraeus-sifnos':
      return PIRAEUS_TO_SIFNOS_ROUTES;
    case 'sifnos-piraeus':
      return SIFNOS_TO_PIRAEUS_ROUTES;
    default:
      return [];
  }
}

export function parseLocationFromQuery(query: string): { from: string; to: string } | null {
  const lowerQuery = query.toLowerCase();
  console.log('🚢 parseLocationFromQuery - Input:', query);
  console.log('🚢 parseLocationFromQuery - Lower:', lowerQuery);
  
  // More flexible ferry detection - check for transport keywords OR destination patterns
  const transportKeywords = ['ferry', 'ferries', 'boat', 'ship', 'transport', 'travel', 'get to', 'go to', 'reach'];
  const hasTransportKeyword = transportKeywords.some(keyword => lowerQuery.includes(keyword));
  console.log('🚢 Transport keyword found:', hasTransportKeyword);
  
  // Ferry schedule specific keywords
  const scheduleKeywords = ['schedule', 'timetable', 'departure', 'arrival', 'times'];
  const hasScheduleKeyword = scheduleKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Location mentions
  const hasPiraeus = lowerQuery.includes('piraeus') || lowerQuery.includes('athens');
  const hasSifnos = lowerQuery.includes('sifnos');
  
  // If query mentions ferry schedules specifically, show Piraeus to Sifnos by default
  if (hasScheduleKeyword && (hasPiraeus || hasSifnos)) {
    if (lowerQuery.includes('from sifnos') || lowerQuery.includes('sifnos to')) {
      return { from: 'sifnos', to: 'piraeus' };
    }
    return { from: 'piraeus', to: 'sifnos' };
  }
  
  // If transport keyword + locations mentioned
  if (hasTransportKeyword && (hasPiraeus || hasSifnos)) {
    if (hasPiraeus && hasSifnos) {
      if (lowerQuery.includes('from piraeus') || lowerQuery.includes('piraeus to')) {
        return { from: 'piraeus', to: 'sifnos' };
      } else if (lowerQuery.includes('from sifnos') || lowerQuery.includes('sifnos to')) {
        return { from: 'sifnos', to: 'piraeus' };
      }
      // Default to going to Sifnos if direction unclear
      return { from: 'piraeus', to: 'sifnos' };
    }
    // If only one location mentioned, assume they want to go to Sifnos
    if (hasPiraeus) {
      return { from: 'piraeus', to: 'sifnos' };
    }
    if (hasSifnos) {
      return { from: 'piraeus', to: 'sifnos' };
    }
  }
  
  // Quick prompt triggers - show ferry options for these
  if (lowerQuery.includes('ferry schedules') || lowerQuery.includes('ferry options')) {
    console.log('🚢 Quick prompt trigger detected - returning Piraeus to Sifnos');
    return { from: 'piraeus', to: 'sifnos' };
  }
  
  console.log('🚢 No ferry route detected - returning null');
  return null;
} 