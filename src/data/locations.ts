
export interface Location {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  hotelsCount: number;
  keywords: string[];
  meta: {
    title: string;
    description: string;
  };
}

export const sifnosLocations: Location[] = [
  {
    id: "apollonia",
    name: "Apollonia",
    slug: "apollonia",
    shortDescription: "The capital of Sifnos, known for its picturesque streets and vibrant nightlife.",
    description: "Apollonia, the capital of Sifnos island, is a charming village with traditional Cycladic architecture featuring whitewashed buildings and narrow winding streets. Named after the god Apollo, this picturesque settlement sits on three hills in the center of the island, offering stunning views of the surrounding landscape. Visitors can explore boutique shops, art galleries, traditional tavernas, and modern bars along the central pedestrian street called Steno. The town comes alive at night with various dining options and local entertainment venues.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 12,
    keywords: [
      "apollonia sifnos hotels",
      "hotels in apollonia",
      "where to stay in apollonia sifnos",
      "apollonia sifnos accommodation",
      "boutique hotels apollonia"
    ],
    meta: {
      title: "Hotels in Apollonia, Sifnos - Best Places to Stay in the Island's Capital",
      description: "Find the best hotels, boutique accommodations and vacation rentals in Apollonia, the picturesque capital of Sifnos. Central location with easy access to restaurants, nightlife and attractions."
    }
  },
  {
    id: "kamares",
    name: "Kamares",
    slug: "kamares",
    shortDescription: "The main port of Sifnos with a beautiful sandy beach and waterfront restaurants.",
    description: "Kamares is Sifnos island's main port and one of its most developed tourist settlements. This beautiful coastal village features a long, sandy beach with crystal-clear waters protected by a natural bay, making it ideal for families with children. The picturesque harbor is lined with charming waterfront tavernas, cafes, and shops, with whitewashed buildings creating a classic Cycladic backdrop against the surrounding hills. Kamares offers a variety of accommodation options from luxury hotels to budget-friendly rooms and provides convenient access to the rest of the island via the local bus network.",
    imageUrl: "/uploads/locations/kamares.jpg",
    hotelsCount: 15,
    keywords: [
      "kamares sifnos hotels",
      "hotels in kamares",
      "kamares port accommodation",
      "beachfront hotels kamares sifnos",
      "family hotels kamares"
    ],
    meta: {
      title: "Hotels in Kamares, Sifnos - Beachfront Accommodations at the Island's Port",
      description: "Stay in Kamares, Sifnos's main port with family-friendly beachfront hotels and accommodations. Enjoy waterfront restaurants, easy ferry access, and the beautiful sandy beach."
    }
  },
  {
    id: "platis-gialos",
    name: "Platis Gialos",
    slug: "platis-gialos",
    shortDescription: "One of the most popular beaches with golden sand and shallow waters perfect for families.",
    description: "Platis Gialos is home to one of Sifnos's most famous and popular beaches. This long, golden sand beach with shallow, crystal-clear waters is ideal for families with children. The beachfront is lined with a variety of restaurants, tavernas, and cafes offering fresh seafood and local specialties. The area has developed into a substantial resort with many hotels, apartments, and rooms to rent, making it an excellent base for exploring the island. Water sports facilities are available, and the beach has been awarded a Blue Flag for its cleanliness and organization.",
    imageUrl: "/uploads/locations/platis-gialos.jpg",
    hotelsCount: 18,
    keywords: [
      "platis gialos hotels sifnos",
      "beach hotels sifnos",
      "platis gialos beach accommodation",
      "family hotels platis gialos",
      "luxury seaside hotels sifnos"
    ],
    meta: {
      title: "Hotels in Platis Gialos, Sifnos - Beachfront Stays on the Island's Best Beach",
      description: "Book your stay at Platis Gialos, Sifnos's most popular beach destination. Beachfront hotels, family-friendly resorts, and apartments with easy access to restaurants and water activities."
    }
  },
  {
    id: "kastro",
    name: "Kastro",
    slug: "kastro",
    shortDescription: "The medieval capital of Sifnos with impressive architecture and stunning sea views.",
    description: "Kastro is one of the most impressive settlements on Sifnos, perched on a rocky hill overlooking the Aegean Sea. This medieval village served as the island's capital for centuries until the early 19th century. Walking through its narrow streets is like stepping back in time, with ancient walls, Byzantine churches, and traditional Cycladic houses creating a unique atmospheric setting. The village takes its name from the ancient fortification ('kastro' means castle) built to protect inhabitants from pirates. Today, Kastro offers visitors a magical experience with stunning views, historical sites like the Archaeological Museum, and a few traditional tavernas serving local cuisine.",
    imageUrl: "/uploads/locations/kastro.jpg",
    hotelsCount: 5,
    keywords: [
      "kastro sifnos hotels",
      "hotels in kastro sifnos",
      "kastro traditional accommodation",
      "boutique hotels kastro",
      "historic hotels sifnos"
    ],
    meta: {
      title: "Hotels in Kastro, Sifnos - Stay in the Historic Medieval Village",
      description: "Experience authentic Cycladic charm at Kastro, Sifnos's ancient capital. Book boutique hotels and traditional accommodations with spectacular sea views and historic surroundings."
    }
  },
  {
    id: "vathi",
    name: "Vathi",
    slug: "vathi",
    shortDescription: "A tranquil fishing village with a sheltered bay, sandy beach, and peaceful atmosphere.",
    description: "Vathi is a picturesque fishing village nestled within one of the most beautiful natural harbors of Sifnos. This tranquil settlement features a sheltered bay with calm, turquoise waters and a lovely sandy beach that's perfect for relaxing and swimming. The village is known for its traditional pottery workshops, as Sifnos has a long history of ceramic craftsmanship. Visitors can enjoy fresh seafood at waterfront tavernas while enjoying the peaceful atmosphere and stunning views. Vathi offers a quieter alternative to the more developed beach resorts on the island, making it ideal for travelers seeking authenticity and relaxation.",
    imageUrl: "/uploads/locations/vathi.jpg",
    hotelsCount: 7,
    keywords: [
      "vathi sifnos hotels",
      "vathi bay accommodation", 
      "quiet hotels sifnos",
      "beachfront hotels vathi",
      "vathi village accommodation"
    ],
    meta: {
      title: "Hotels in Vathi, Sifnos - Peaceful Stays in a Tranquil Bay Setting",
      description: "Find your perfect retreat in Vathi, a peaceful fishing village with a beautiful sheltered bay. Stay in beachfront hotels and family-run guesthouses away from the crowds."
    }
  },
  {
    id: "faros",
    name: "Faros",
    slug: "faros",
    shortDescription: "A charming coastal settlement with three beautiful beaches and a relaxed atmosphere.",
    description: "Faros is a charming coastal village located on the southeastern coast of Sifnos. Once the main port of the island, this traditional settlement is now a peaceful haven with a picturesque harbor, whitewashed houses, and three beautiful beaches: Faros, Fassolou, and Glyfo. The area is characterized by its relaxed atmosphere and the absence of large tourist developments. Visitors can enjoy fresh seafood at small, family-run tavernas along the waterfront, take scenic coastal walks to nearby beaches, or simply relax on the sandy shores. Faros offers an authentic Greek island experience with natural beauty and tranquility.",
    imageUrl: "/uploads/locations/faros.jpg",
    hotelsCount: 8,
    keywords: [
      "faros sifnos hotels",
      "faros beach accommodation",
      "hotels in faros sifnos",
      "faros village rooms",
      "quiet hotels sifnos faros"
    ],
    meta: {
      title: "Hotels in Faros, Sifnos - Authentic Stays in a Coastal Haven",
      description: "Book accommodations in Faros, a traditional coastal village with three beautiful beaches and a peaceful atmosphere. Experience authentic Sifnos charm in comfortable hotels and guesthouses."
    }
  }
];

export const getLocationBySlug = (slug: string): Location | undefined => {
  return sifnosLocations.find(location => location.slug === slug);
};
