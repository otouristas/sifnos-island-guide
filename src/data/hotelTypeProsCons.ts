export interface ProsCons {
  pros: string[];
  cons: string[];
}

export interface HotelTypeProsCons {
  slug: string;
  prosCons: ProsCons;
}

export const hotelTypeProsCons: HotelTypeProsCons[] = [
  {
    slug: 'luxury-hotels',
    prosCons: {
      pros: [
        'Premium amenities and services',
        'High-quality dining options',
        'Excellent location and views',
        'Professional concierge service',
        'Spa and wellness facilities',
        'Private pools and exclusive areas'
      ],
      cons: [
        'Higher price point',
        'May feel less authentic',
        'Can be more formal atmosphere',
        'Limited availability during peak season'
      ]
    }
  },
  {
    slug: 'villas',
    prosCons: {
      pros: [
        'Complete privacy and independence',
        'Private pools and outdoor spaces',
        'Perfect for families and groups',
        'Full kitchen facilities',
        'More space and comfort',
        'Authentic local experience'
      ],
      cons: [
        'Higher cost, especially for smaller groups',
        'May require car rental',
        'Less social interaction',
        'Self-catering responsibilities',
        'Minimum stay requirements often apply'
      ]
    }
  },
  {
    slug: 'beach-hotels',
    prosCons: {
      pros: [
        'Direct beach access',
        'Stunning sea views',
        'Water sports facilities nearby',
        'Beachfront dining options',
        'Perfect for beach lovers',
        'Easy access to swimming'
      ],
      cons: [
        'Can be noisier',
        'Higher prices during peak season',
        'May be windier locations',
        'Limited privacy on beach',
        'More touristy atmosphere'
      ]
    }
  },
  {
    slug: 'boutique-hotels',
    prosCons: {
      pros: [
        'Unique design and character',
        'Personalized service',
        'Intimate atmosphere',
        'Local charm and authenticity',
        'Often in prime locations',
        'Attention to detail'
      ],
      cons: [
        'Limited room availability',
        'May have fewer amenities',
        'Can be more expensive than standard hotels',
        'Smaller common areas',
        'Booking fills up quickly'
      ]
    }
  },
  {
    slug: 'family-friendly-hotels',
    prosCons: {
      pros: [
        'Kid-friendly facilities',
        'Family rooms and suites',
        'Safe environments',
        'Entertainment for children',
        'Convenient locations',
        'Flexible meal options'
      ],
      cons: [
        'Can be noisier',
        'Less romantic atmosphere',
        'May have fewer adult amenities',
        'Peak season can be crowded',
        'Limited quiet spaces'
      ]
    }
  },
  {
    slug: 'traditional-hotels',
    prosCons: {
      pros: [
        'Authentic Cycladic architecture',
        'Local hospitality',
        'Cultural immersion',
        'Reasonable prices',
        'Traditional atmosphere',
        'Local knowledge from owners'
      ],
      cons: [
        'May have fewer modern amenities',
        'Older facilities possible',
        'Limited English in some cases',
        'Basic services',
        'May lack air conditioning in some'
      ]
    }
  },
  {
    slug: 'budget-hotels',
    prosCons: {
      pros: [
        'Affordable prices',
        'Good value for money',
        'Essential amenities included',
        'Great for backpackers',
        'Often in convenient locations',
        'Flexible booking options'
      ],
      cons: [
        'Basic facilities',
        'Smaller rooms',
        'Fewer amenities',
        'May lack sea views',
        'Limited services',
        'Shared facilities in some cases'
      ]
    }
  }
];

export function getProsConsBySlug(slug: string): ProsCons | null {
  const hotelType = hotelTypeProsCons.find((ht) => ht.slug === slug);
  return hotelType?.prosCons || null;
}

