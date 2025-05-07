
export interface HotelType {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  keywords: string[];
  meta: {
    title: string;
    description: string;
  };
}

export const hotelTypes: HotelType[] = [
  {
    id: "luxury-hotels",
    title: "Luxury Hotels",
    slug: "luxury-hotels",
    shortDescription: "Experience the ultimate in comfort and elegance at Sifnos' finest luxury hotels.",
    description: "Indulge in exceptional luxury at Sifnos' premium 5-star hotels and resorts. These exclusive properties offer sophisticated accommodation with high-end amenities including infinity pools overlooking the Aegean Sea, spa facilities offering rejuvenating treatments, gourmet restaurants serving refined Greek and international cuisine, and impeccable personalized service. From sleek, modern designs to elegant traditional architecture, Sifnos' luxury hotels promise an unforgettable stay with attention to every detail, private terraces with spectacular views, and prime locations near the island's most beautiful beaches and attractions.",
    imageUrl: "/uploads/hotel-types/luxury-hotels.jpg",
    keywords: [
      "luxury hotels sifnos",
      "5 star hotels sifnos",
      "best luxury accommodation sifnos",
      "premium hotels sifnos island",
      "high-end resorts sifnos greece"
    ],
    meta: {
      title: "Luxury Hotels in Sifnos - 5-Star Resorts & Premium Accommodation",
      description: "Experience the finest luxury hotels and premium resorts in Sifnos, Greece. Enjoy 5-star amenities, private pools, gourmet dining, and exceptional service in stunning Aegean settings."
    }
  },
  {
    id: "boutique-hotels",
    title: "Boutique Hotels",
    slug: "boutique-hotels",
    shortDescription: "Discover charming, intimate accommodations with unique character and personalized service.",
    description: "Discover the unique charm of Sifnos' boutique hotels, where authentic Cycladic character meets contemporary comfort. These intimate accommodations, typically featuring fewer than 20 rooms, offer a more personalized experience with attentive service and distinctive design elements. Each boutique hotel on the island has its own personality—from renovated traditional mansions with stone walls and wooden beams to stylish modern retreats with minimalist aesthetics. Guests can enjoy customized experiences, locally-sourced breakfast specialties, and thoughtfully decorated interiors that reflect the island's cultural heritage while providing all modern conveniences for a comfortable and memorable stay.",
    imageUrl: "/uploads/hotel-types/boutique-hotels.jpg",
    keywords: [
      "boutique hotels sifnos",
      "small luxury hotels sifnos",
      "unique accommodation sifnos",
      "boutique stays cyclades",
      "charming hotels sifnos greece"
    ],
    meta: {
      title: "Boutique Hotels in Sifnos - Charming & Unique Accommodations",
      description: "Stay at Sifnos' best boutique hotels offering unique character, intimate settings, and personalized service. Discover stylish, small-scale accommodations with authentic Cycladic charm."
    }
  },
  {
    id: "beach-hotels",
    title: "Beach Hotels",
    slug: "beach-hotels",
    shortDescription: "Stay just steps from the sand at these perfect beachfront accommodations around Sifnos.",
    description: "Wake up to the sound of waves at Sifnos' spectacular beach hotels, where the beautiful Aegean Sea is just steps from your door. These beachfront accommodations offer unparalleled access to some of the island's most coveted sandy shores, including Platis Gialos, Kamares, and Vathi. Guests can enjoy direct beach access, sea-view rooms with private balconies or terraces, and facilities such as beach bars, water sports equipment rental, and sun loungers reserved exclusively for hotel guests. Beach hotels on Sifnos range from family-friendly resorts with pools and children's activities to romantic hideaways perfect for couples seeking seaside tranquility, all offering the magic of waking up with the Mediterranean at your doorstep.",
    imageUrl: "/uploads/hotel-types/beach-hotels.jpg",
    keywords: [
      "beach hotels sifnos",
      "beachfront accommodation sifnos",
      "hotels on the beach sifnos",
      "seaside hotels sifnos greece",
      "waterfront hotels sifnos island"
    ],
    meta: {
      title: "Beach Hotels in Sifnos - Beachfront Resorts & Seaside Accommodation",
      description: "Book the best beachfront hotels in Sifnos with direct access to golden sands and crystal waters. Wake up to sea views at top-rated beach resorts and seaside accommodations."
    }
  },
  {
    id: "family-friendly-hotels",
    title: "Family-Friendly Hotels",
    slug: "family-friendly-hotels",
    shortDescription: "Perfect accommodations for families with children, offering suitable amenities and activities.",
    description: "Make unforgettable family memories at Sifnos' family-friendly hotels, specially designed to cater to guests of all ages. These welcoming accommodations offer spacious family rooms or interconnected options, child-friendly facilities such as shallow pools, playgrounds, and kids' clubs with supervised activities. Many family hotels on Sifnos are strategically located near safe, shallow beaches like Platis Gialos and Kamares, and offer convenient amenities including kitchenettes for preparing simple meals, on-site restaurants with children's menus, and helpful services such as babysitting. With warm Greek hospitality and practical features that make traveling with children easier, these hotels ensure a stress-free vacation for parents and an exciting adventure for younger guests.",
    imageUrl: "/uploads/hotel-types/family-hotels.jpg",
    keywords: [
      "family hotels sifnos",
      "child friendly accommodation sifnos",
      "hotels for kids sifnos",
      "family friendly resorts sifnos",
      "family rooms sifnos greece"
    ],
    meta: {
      title: "Family-Friendly Hotels in Sifnos - Perfect Stays for Kids & Parents",
      description: "Find the best family-friendly hotels in Sifnos with amenities for children of all ages. Book spacious family rooms, hotels with kids' activities, pools, and convenient facilities for parents."
    }
  },
  {
    id: "traditional-hotels",
    title: "Traditional Hotels",
    slug: "traditional-hotels",
    shortDescription: "Experience authentic Cycladic architecture and local hospitality in these traditional accommodations.",
    description: "Immerse yourself in authentic island culture with a stay at one of Sifnos' traditional hotels, where centuries-old Cycladic architecture meets warm Greek hospitality. These charming accommodations, often family-run for generations, showcase the island's architectural heritage with whitewashed walls, blue details, stone paths, and bougainvillea-draped courtyards. Inside, guests will find interiors decorated with local handicrafts, traditional textiles, and sometimes antique furniture that tells stories of the island's past. Many traditional hotels are located in the heart of historic villages like Apollonia, Kastro, and Artemonas, offering visitors an authentic experience of daily island life, along with homemade breakfast featuring local specialties and insider recommendations that only locals can provide.",
    imageUrl: "/uploads/hotel-types/traditional-hotels.jpg",
    keywords: [
      "traditional hotels sifnos",
      "authentic greek accommodation sifnos",
      "cycladic style hotels sifnos",
      "traditional guesthouses sifnos",
      "historic hotels sifnos greece"
    ],
    meta: {
      title: "Traditional Hotels in Sifnos - Authentic Cycladic Accommodations",
      description: "Stay in authentic traditional hotels in Sifnos featuring classic Cycladic architecture, family hospitality, and cultural charm. Experience the real Greek islands in these historic accommodations."
    }
  },
  {
    id: "villas",
    title: "Luxury Villas",
    slug: "villas",
    shortDescription: "Indulge in private luxury with exclusive villas offering complete privacy and premium amenities.",
    description: "Experience the ultimate in privacy and luxury with Sifnos' exclusive villa rentals. These standalone properties offer discerning travelers their own private slice of paradise with stunning Aegean views, private swimming pools, and spacious outdoor entertaining areas. Perfect for families or groups seeking more independence, Sifnos' villas combine authentic Cycladic architectural elements with modern comfort and sophisticated design. From contemporary minimalist villas with floor-to-ceiling windows to restored traditional houses with elegant stone facades, these accommodations provide a true home-away-from-home experience with fully-equipped kitchens, multiple bedrooms, and personalized services including private chefs, concierge assistance, and housekeeping. Enjoy sunset cocktails by your private infinity pool or starlit dinners on your secluded terrace—all while experiencing the natural beauty and serenity of Sifnos.",
    imageUrl: "/uploads/hotel-types/luxury-villas.jpg",
    keywords: [
      "luxury villas sifnos",
      "private villas sifnos",
      "villa rental sifnos",
      "exclusive accommodation sifnos",
      "villas with pool sifnos greece"
    ],
    meta: {
      title: "Luxury Villas in Sifnos - Private Pool Villas & Exclusive Rentals",
      description: "Discover Sifnos' most luxurious private villas with pools, panoramic sea views, and premium amenities. Perfect for families and groups seeking exclusive, high-end accommodation in a stunning Greek island setting."
    }
  }
];

export const getHotelTypeBySlug = (slug: string): HotelType | undefined => {
  return hotelTypes.find(type => type.slug === slug);
};
