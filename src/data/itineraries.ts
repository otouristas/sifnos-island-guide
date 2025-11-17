export interface ItineraryDay {
  day: number;
  title: string;
  activities: Array<{
    time: string;
    activity: string;
    location?: string;
    description?: string;
  }>;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  accommodation?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  duration: number;
  description: string;
  days: ItineraryDay[];
  bestFor: string[];
  estimatedCost: {
    low: number;
    mid: number;
    high: number;
  };
}

export const itineraries: Itinerary[] = [
  {
    id: '3-day-sifnos',
    title: '3-Day Sifnos Escape',
    duration: 3,
    description: 'Perfect for a long weekend, covering the island\'s highlights including beaches, villages, and local cuisine.',
    bestFor: ['Weekend getaway', 'First-time visitors', 'Beach lovers'],
    estimatedCost: {
      low: 250,
      mid: 450,
      high: 800
    },
    days: [
      {
        day: 1,
        title: 'Arrival & Beach Time',
        activities: [
          { time: 'Morning', activity: 'Arrive at Kamares port, check into hotel', location: 'Kamares' },
          { time: 'Afternoon', activity: 'Relax at Kamares beach, enjoy waterfront lunch', location: 'Kamares' },
          { time: 'Evening', activity: 'Explore port area, traditional dinner', location: 'Kamares' }
        ],
        meals: {
          lunch: 'Waterfront taverna in Kamares',
          dinner: 'Traditional Greek cuisine'
        },
        accommodation: 'Kamares area'
      },
      {
        day: 2,
        title: 'Capital & Best Beach',
        activities: [
          { time: 'Morning', activity: 'Bus to Apollonia, explore Steno street and shops', location: 'Apollonia' },
          { time: 'Afternoon', activity: 'Visit Platis Gialos beach, water sports or relaxation', location: 'Platis Gialos' },
          { time: 'Evening', activity: 'Return to Apollonia for nightlife and dinner', location: 'Apollonia' }
        ],
        meals: {
          breakfast: 'Cafe in Apollonia',
          lunch: 'Beachfront restaurant at Platis Gialos',
          dinner: 'Restaurant on Steno street'
        },
        accommodation: 'Apollonia or Platis Gialos'
      },
      {
        day: 3,
        title: 'Historic Villages & Departure',
        activities: [
          { time: 'Morning', activity: 'Visit Kastro medieval village, explore narrow streets', location: 'Kastro' },
          { time: 'Afternoon', activity: 'Visit Chrysopigi monastery, final beach time', location: 'Chrysopigi' },
          { time: 'Evening', activity: 'Departure from Kamares port', location: 'Kamares' }
        ],
        meals: {
          breakfast: 'Cafe in Kastro',
          lunch: 'Taverna near Chrysopigi'
        }
      }
    ]
  },
  {
    id: '5-day-sifnos',
    title: '5-Day Sifnos Discovery',
    duration: 5,
    description: 'Comprehensive exploration of Sifnos including all major beaches, villages, cultural sites, and authentic experiences.',
    bestFor: ['First-time visitors', 'Culture enthusiasts', 'Complete island experience'],
    estimatedCost: {
      low: 400,
      mid: 750,
      high: 1300
    },
    days: [
      {
        day: 1,
        title: 'Arrival & Port Exploration',
        activities: [
          { time: 'Morning', activity: 'Arrive at Kamares, check into accommodation', location: 'Kamares' },
          { time: 'Afternoon', activity: 'Kamares beach, waterfront dining', location: 'Kamares' },
          { time: 'Evening', activity: 'Explore port area, local taverna dinner', location: 'Kamares' }
        ],
        meals: {
          lunch: 'Kamares waterfront',
          dinner: 'Traditional taverna'
        },
        accommodation: 'Kamares'
      },
      {
        day: 2,
        title: 'Capital & Main Beach',
        activities: [
          { time: 'Morning', activity: 'Bus to Apollonia, explore Steno street, art galleries', location: 'Apollonia' },
          { time: 'Afternoon', activity: 'Platis Gialos beach - full day of swimming and relaxation', location: 'Platis Gialos' },
          { time: 'Evening', activity: 'Apollonia nightlife, dinner at Cantina or Meltemi', location: 'Apollonia' }
        ],
        meals: {
          breakfast: 'Cafe in Apollonia',
          lunch: 'Beachfront restaurant',
          dinner: 'Apollonia restaurant'
        },
        accommodation: 'Apollonia or Platis Gialos'
      },
      {
        day: 3,
        title: 'Historic Villages & Monastery',
        activities: [
          { time: 'Morning', activity: 'Visit Kastro medieval village, Archaeological Museum', location: 'Kastro' },
          { time: 'Afternoon', activity: 'Chrysopigi monastery, nearby beach time', location: 'Chrysopigi' },
          { time: 'Evening', activity: 'Artemonas village, neoclassical architecture walk', location: 'Artemonas' }
        ],
        meals: {
          breakfast: 'Kastro cafe',
          lunch: 'Taverna near Chrysopigi',
          dinner: 'Artemonas traditional restaurant'
        },
        accommodation: 'Apollonia area'
      },
      {
        day: 4,
        title: 'Sheltered Bay & Traditional Villages',
        activities: [
          { time: 'Morning', activity: 'Visit Vathi bay, beach time in sheltered waters', location: 'Vathi' },
          { time: 'Afternoon', activity: 'Explore traditional villages (Exambela, Kato Petali)', location: 'Mountain villages' },
          { time: 'Evening', activity: 'Return to base, local dinner', location: 'Apollonia/Kamares' }
        ],
        meals: {
          breakfast: 'Cafe',
          lunch: 'Vathi fish taverna',
          dinner: 'Local restaurant'
        },
        accommodation: 'Apollonia or Kamares'
      },
      {
        day: 5,
        title: 'Faros & Hidden Beaches',
        activities: [
          { time: 'Morning', activity: 'Visit Faros area, lighthouse views, beach exploration', location: 'Faros' },
          { time: 'Afternoon', activity: 'Vroulidia or other hidden beaches (if accessible)', location: 'Remote beaches' },
          { time: 'Evening', activity: 'Final dinner, departure preparation', location: 'Kamares' }
        ],
        meals: {
          breakfast: 'Cafe',
          lunch: 'Faros taverna',
          dinner: 'Farewell dinner in Kamares'
        }
      }
    ]
  },
  {
    id: '7-day-sifnos',
    title: '7-Day Complete Sifnos Experience',
    duration: 7,
    description: 'Ultimate Sifnos experience covering every corner of the island, including hidden beaches, all villages, cultural sites, and authentic local experiences.',
    bestFor: ['Extended stays', 'Complete exploration', 'Relaxed pace', 'Island immersion'],
    estimatedCost: {
      low: 550,
      mid: 1000,
      high: 1800
    },
    days: [
      {
        day: 1,
        title: 'Arrival & Port Settling',
        activities: [
          { time: 'Morning', activity: 'Arrive at Kamares port, check into accommodation', location: 'Kamares' },
          { time: 'Afternoon', activity: 'Kamares beach relaxation, waterfront lunch', location: 'Kamares' },
          { time: 'Evening', activity: 'Explore port area, local dinner, sunset views', location: 'Kamares' }
        ],
        meals: {
          lunch: 'Kamares waterfront',
          dinner: 'Port taverna'
        },
        accommodation: 'Kamares'
      },
      {
        day: 2,
        title: 'Capital Exploration',
        activities: [
          { time: 'Morning', activity: 'Bus to Apollonia, full exploration of Steno street, shops, galleries', location: 'Apollonia' },
          { time: 'Afternoon', activity: 'Traditional lunch, visit nearby Artemonas village', location: 'Artemonas' },
          { time: 'Evening', activity: 'Apollonia nightlife, dinner at popular restaurant', location: 'Apollonia' }
        ],
        meals: {
          breakfast: 'Cafe in Apollonia',
          lunch: 'Traditional taverna',
          dinner: 'Apollonia restaurant'
        },
        accommodation: 'Apollonia'
      },
      {
        day: 3,
        title: 'Best Beach Day',
        activities: [
          { time: 'Morning', activity: 'Full day at Platis Gialos - beach, water sports, relaxation', location: 'Platis Gialos' },
          { time: 'Afternoon', activity: 'Visit White Tower (1.5km), pottery studios', location: 'Platis Gialos area' },
          { time: 'Evening', activity: 'Beachfront dinner, sunset views', location: 'Platis Gialos' }
        ],
        meals: {
          breakfast: 'Hotel/Apollonia',
          lunch: 'Beachfront restaurant',
          dinner: 'Platis Gialos taverna'
        },
        accommodation: 'Platis Gialos or Apollonia'
      },
      {
        day: 4,
        title: 'Historic Villages & Monastery',
        activities: [
          { time: 'Morning', activity: 'Kastro medieval village, Archaeological Museum, narrow streets', location: 'Kastro' },
          { time: 'Afternoon', activity: 'Chrysopigi monastery visit, nearby beach time', location: 'Chrysopigi' },
          { time: 'Evening', activity: 'Return to base, local dinner', location: 'Apollonia' }
        ],
        meals: {
          breakfast: 'Kastro cafe',
          lunch: 'Taverna near Chrysopigi',
          dinner: 'Apollonia restaurant'
        },
        accommodation: 'Apollonia'
      },
      {
        day: 5,
        title: 'Sheltered Bay & Traditional Life',
        activities: [
          { time: 'Morning', activity: 'Visit Vathi bay, beach time, fishing village atmosphere', location: 'Vathi' },
          { time: 'Afternoon', activity: 'Explore traditional mountain villages (Exambela, Kato Petali)', location: 'Mountain villages' },
          { time: 'Evening', activity: 'Traditional village dinner experience', location: 'Mountain village' }
        ],
        meals: {
          breakfast: 'Cafe',
          lunch: 'Vathi fish taverna',
          dinner: 'Traditional village taverna'
        },
        accommodation: 'Apollonia or Kamares'
      },
      {
        day: 6,
        title: 'Faros & Hidden Gems',
        activities: [
          { time: 'Morning', activity: 'Faros area exploration, lighthouse, two beaches', location: 'Faros' },
          { time: 'Afternoon', activity: 'Visit remote beaches (Vroulidia if accessible, or other hidden coves)', location: 'Remote beaches' },
          { time: 'Evening', activity: 'Return for final island dinner', location: 'Apollonia/Kamares' }
        ],
        meals: {
          breakfast: 'Cafe',
          lunch: 'Faros taverna',
          dinner: 'Favorite restaurant revisit'
        },
        accommodation: 'Apollonia or Kamares'
      },
      {
        day: 7,
        title: 'Final Day & Departure',
        activities: [
          { time: 'Morning', activity: 'Last-minute shopping, souvenir hunting, final beach visit', location: 'Flexible' },
          { time: 'Afternoon', activity: 'Check out, last meal, port preparation', location: 'Kamares' },
          { time: 'Evening', activity: 'Departure from Kamares port', location: 'Kamares' }
        ],
        meals: {
          breakfast: 'Hotel or cafe',
          lunch: 'Final Greek meal'
        }
      }
    ]
  }
];

export function getItineraryById(id: string): Itinerary | undefined {
  return itineraries.find(it => it.id === id);
}

export function getAllItineraries(): Itinerary[] {
  return itineraries;
}

