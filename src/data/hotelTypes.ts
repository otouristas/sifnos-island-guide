
export interface HotelType {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  keywords: string[];
}

export const hotelTypes: HotelType[] = [
  {
    slug: 'luxury-hotels',
    title: 'Luxury Hotels',
    shortDescription: 'Premium accommodations offering exceptional amenities and personalized service',
    description: 'Experience the pinnacle of hospitality on Sifnos with our selection of luxury hotels. These premium establishments feature elegant rooms and suites, high-end amenities, attentive staff, and often stunning locations with panoramic views. Many luxury hotels on Sifnos seamlessly blend contemporary comfort with traditional Cycladic architecture, offering a sophisticated and authentic Greek island experience. Perfect for travelers seeking an indulgent retreat with exceptional standards.',
    imageUrl: '/luxury-hotels.jpg',
    keywords: ['luxury hotels sifnos', 'premium accommodation sifnos', 'five star hotels sifnos', 'luxury resorts cyclades']
  },
  {
    slug: 'boutique-hotels',
    title: 'Boutique Hotels',
    shortDescription: 'Distinctive, intimate hotels with stylish character and personalized experiences',
    description: 'Discover the unique charm of boutique hotels in Sifnos, where personality and attention to detail create unforgettable stays. These smaller, design-focused properties offer individualized experiences that larger hotels cannot match. Typically featuring fewer than 20 rooms, boutique hotels on Sifnos showcase authentic island character, artistic touches, and local design elements. Expect personalized service, distinctive architecture, and a genuine connection to Sifnian culture and hospitality.',
    imageUrl: '/uploads/hotels/filadaki-studios/home-page_1801.jpg.jpeg',
    keywords: ['boutique hotels sifnos', 'small luxury hotels greece', 'unique accommodation sifnos', 'design hotels cyclades']
  },
  {
    slug: 'beach-hotels',
    title: 'Beach Hotels',
    shortDescription: 'Waterfront accommodation with direct beach access or sea views',
    description: 'Enjoy the ultimate beachside experience with our curated selection of Sifnos beach hotels. These properties offer privileged locations right on or steps away from the island\'s most beautiful shores. Wake up to the sound of waves, enjoy breakfast with sea views, and have direct access to swimming and sunbathing. Sifnos beach hotels range from luxury resorts to charming family-run properties, all sharing the remarkable advantage of prime coastal settings. Perfect for beach lovers and those seeking that quintessential Greek island holiday.',
    imageUrl: '/beach-hotels.jpg',
    keywords: ['beach hotels sifnos', 'seafront accommodation greece', 'beachside hotels cyclades', 'hotels near beach sifnos']
  },
  {
    slug: 'family-friendly-hotels',
    title: 'Family-Friendly Hotels',
    shortDescription: 'Accommodations designed with family needs in mind, offering amenities for all ages',
    description: 'Make wonderful family memories in our selection of family-friendly hotels in Sifnos. These properties cater specifically to the needs of parents and children, with spacious family rooms or connecting options, child-friendly amenities, and often safe outdoor spaces for play. Many offer specialized services like children\'s meals, baby equipment, and family activities. Located near gentle beaches and family-appropriate attractions, these hotels provide the perfect base for a stress-free family vacation on this welcoming Greek island.',
    imageUrl: '/uploads/hotels/morpheas-pension/apartment-5person.webp',
    keywords: ['family hotels sifnos', 'child friendly accommodation greece', 'family rooms sifnos', 'hotels for kids cyclades']
  },
  {
    slug: 'traditional-hotels',
    title: 'Traditional Hotels',
    shortDescription: 'Authentic accommodations that showcase the island\'s architectural heritage',
    description: 'Experience authentic Cycladic hospitality in our curated selection of traditional hotels in Sifnos. These characterful properties preserve the architectural heritage and cultural identity of the island, often housed in restored historic buildings or built according to time-honored local techniques. Expect whitewashed walls, blue accents, handcrafted furniture, and charming courtyards adorned with bougainvillea. Traditional hotels offer a genuine connection to Sifnian life, often family-run with hosts eager to share insights about local customs and hidden treasures of the island.',
    imageUrl: '/uploads/hotels/filadaki-studios/home-page_3125.jpg.jpeg',
    keywords: ['traditional hotels sifnos', 'authentic greek accommodation', 'cycladic hotels', 'historic hotels sifnos']
  },
  {
    slug: 'villas',
    title: 'Villas',
    shortDescription: 'Luxurious private holiday homes with exclusive amenities for the ultimate getaway',
    description: 'Indulge in the privacy and spaciousness of our exceptional villas in Sifnos. These standalone vacation homes offer an exclusive retreat with amenities that often include private pools, extensive outdoor areas, fully-equipped kitchens, and multiple bedrooms and bathrooms. Perfect for families, groups of friends, or those seeking a truly secluded holiday experience, Sifnos villas combine the luxury of high-end accommodation with the authentic charm of Greek island living. Many feature stunning sea views, traditional architectural elements, and proximity to beautiful beaches and villages.',
    imageUrl: '/uploads/hotels/villa-olivia-clara/feature-image.jpeg',
    keywords: ['sifnos villa', 'luxury villa greece', 'private pool villa cyclades', 'holiday homes sifnos', 'vacation rentals greek islands']
  }
];

export const getHotelTypes = (): HotelType[] => {
  return hotelTypes;
};

export const getHotelTypeBySlug = (slug: string): HotelType | null => {
  return hotelTypes.find((type) => type.slug === slug) || null;
};
