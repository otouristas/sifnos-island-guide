
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
  },
  {
    id: "artemonas",
    name: "Artemonas",
    slug: "artemonas",
    shortDescription: "An elegant village known for its neoclassical mansions and beautiful architecture.",
    description: "Artemonas is one of the most beautiful and elegant villages on Sifnos, known for its impressive neoclassical mansions and traditional Cycladic architecture. Located just a short walk from Apollonia, this charming settlement offers a more refined and tranquil atmosphere compared to the bustling capital. Visitors can wander through narrow streets lined with whitewashed houses adorned with colorful flowers, visit small churches, and enjoy panoramic views of the surrounding landscape. The village has several excellent tavernas and traditional pastry shops serving local delicacies. Artemonas provides an authentic glimpse into the island's aristocratic past while maintaining a peaceful ambiance.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 6,
    keywords: [
      "artemonas sifnos hotels",
      "artemonas accommodation",
      "neoclassical hotels sifnos",
      "traditional stays artemonas",
      "boutique hotels artemonas"
    ],
    meta: {
      title: "Hotels in Artemonas, Sifnos - Elegant Stays in a Neoclassical Village",
      description: "Stay in the elegant village of Artemonas, Sifnos, in traditional accommodations surrounded by neoclassical mansions, beautiful architecture, and authentic Cycladic charm."
    }
  },
  {
    id: "agios-loukas",
    name: "Agios Loukas",
    slug: "agios-loukas",
    shortDescription: "A small, quiet settlement offering authentic island living and scenic views.",
    description: "Agios Loukas is a small, serene settlement on Sifnos island, offering visitors an authentic taste of Greek island living away from the more touristy areas. Named after the small church of St. Luke that adorns the area, this peaceful village features traditional whitewashed houses, narrow pathways, and stunning views of the surrounding countryside. It's an ideal location for travelers seeking tranquility and a genuine connection with local culture. While accommodation options are limited compared to larger settlements, the few available properties offer a more intimate and personal experience, often in beautifully renovated traditional houses.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 3,
    keywords: [
      "agios loukas sifnos accommodation",
      "quiet stays sifnos",
      "traditional houses agios loukas",
      "authentic sifnos villages",
      "peaceful accommodation sifnos"
    ],
    meta: {
      title: "Accommodation in Agios Loukas, Sifnos - Authentic Island Stays",
      description: "Experience authentic island living in Agios Loukas, a peaceful settlement on Sifnos with traditional houses and a serene atmosphere, perfect for those seeking tranquility."
    }
  },
  {
    id: "exambela",
    name: "Exambela",
    slug: "exambela",
    shortDescription: "A traditional village with panoramic views and authentic Cycladic character.",
    description: "Exambela is a traditional village on Sifnos island characterized by its authentic Cycladic character and stunning panoramic views. Located near Apollonia, this picturesque settlement offers visitors a glimpse into traditional island life with its whitewashed houses, narrow winding alleys, and blue-domed churches. The village is known for its pottery workshops, continuing Sifnos' long tradition of ceramic craftsmanship. Accommodation options in Exambela tend to be small, family-run establishments offering personalized service and local insights. Staying in Exambela provides easy access to the island's central attractions while maintaining a peaceful retreat away from the busier tourist centers.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 4,
    keywords: [
      "exambela sifnos hotels",
      "traditional accommodation sifnos",
      "pottery village sifnos",
      "cycladic village stays",
      "quiet hotels sifnos"
    ],
    meta: {
      title: "Hotels in Exambela, Sifnos - Traditional Stays with Panoramic Views",
      description: "Stay in Exambela, a traditional Sifnos village known for pottery workshops and authentic Cycladic character. Enjoy panoramic views and easy access to the island's central attractions."
    }
  },
  {
    id: "katavati",
    name: "Katavati",
    slug: "katavati",
    shortDescription: "A picturesque inland village with traditional character and central location.",
    description: "Katavati is a small, picturesque village centrally located on Sifnos island, forming part of the island's administrative center along with nearby Apollonia. This charming settlement features traditional Cycladic architecture with whitewashed houses, narrow winding streets, and serene atmosphere. Its central location makes Katavati an excellent base for exploring the entire island, with easy access to restaurants, shops, and public transportation. Accommodations in Katavati offer visitors an authentic experience of Sifnian village life while being conveniently connected to more touristy areas. The village provides a perfect balance between accessibility and tranquility for those wanting to experience genuine island culture.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 3,
    keywords: [
      "katavati sifnos accommodation",
      "central sifnos hotels",
      "traditional village stays",
      "authentic sifnos experience",
      "hotels near apollonia"
    ],
    meta: {
      title: "Accommodation in Katavati, Sifnos - Central Village Stays",
      description: "Stay in centrally located Katavati village on Sifnos, offering traditional Cycladic charm with easy access to Apollonia's amenities and excellent connections to the entire island."
    }
  },
  {
    id: "kato-petali",
    name: "Kato Petali",
    slug: "kato-petali",
    shortDescription: "A quiet village with traditional character near the island's capital.",
    description: "Kato Petali is a quiet, traditional village located just a short distance from Apollonia, the capital of Sifnos. This peaceful settlement offers an authentic island experience characterized by narrow whitewashed alleys, traditional Cycladic houses, and a slower pace of life. With its central location on the island, Kato Petali provides convenient access to restaurants, shops, and other amenities while maintaining a serene environment away from the tourist crowds. Accommodations here tend to be traditional houses and small family-run establishments that allow visitors to experience genuine Greek island hospitality. The village offers beautiful views of the surrounding countryside and nearby villages.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 2,
    keywords: [
      "kato petali sifnos accommodations",
      "traditional stays sifnos",
      "quiet hotels near apollonia",
      "central sifnos villages",
      "authentic island stays"
    ],
    meta: {
      title: "Accommodation in Kato Petali, Sifnos - Traditional Village Stays",
      description: "Experience authentic island life in Kato Petali, a quiet traditional village near Apollonia with convenient access to amenities while enjoying a peaceful, genuine Greek island atmosphere."
    }
  },
  {
    id: "pano-petali",
    name: "Pano Petali",
    slug: "pano-petali",
    shortDescription: "An elevated village offering spectacular views and traditional atmosphere.",
    description: "Pano Petali is a charming hillside village on Sifnos island, situated at a higher elevation than its neighbor Kato Petali. This picturesque settlement rewards visitors with spectacular panoramic views of the island and the Aegean Sea. Characterized by traditional Cycladic architecture with whitewashed houses, blue-domed churches, and narrow winding paths adorned with flowers, Pano Petali offers an authentic island experience. Its proximity to Apollonia means convenient access to restaurants, shops, and nightlife while maintaining a peaceful atmosphere. Accommodations in Pano Petali tend to be traditional houses and small boutique establishments that take advantage of the village's elevated position to provide stunning vistas.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 3,
    keywords: [
      "pano petali sifnos hotels",
      "panoramic view accommodation",
      "hillside village stays",
      "traditional sifnos rooms",
      "quiet hotels with views"
    ],
    meta: {
      title: "Hotels in Pano Petali, Sifnos - Hillside Stays with Panoramic Views",
      description: "Stay in the elevated village of Pano Petali on Sifnos island and enjoy spectacular panoramic views, traditional Cycladic architecture, and a peaceful atmosphere near Apollonia."
    }
  },
  {
    id: "troullaki",
    name: "Troullaki",
    slug: "troullaki",
    shortDescription: "A small, peaceful settlement with rural charm and natural beauty.",
    description: "Troullaki is a small, tranquil settlement on Sifnos island that offers visitors a glimpse into authentic rural Greek island life. This peaceful hamlet features traditional architecture, beautiful natural surroundings, and a distinctly unhurried atmosphere. Away from the more developed tourist areas, Troullaki provides a genuine escape for those seeking quiet and connection with nature. Accommodation options are limited and typically consist of private vacation homes and small family-run establishments, offering a more intimate and personalized experience. The area is ideal for visitors who appreciate walks through the countryside, stargazing at night, and immersion in the simple rhythms of island life.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 1,
    keywords: [
      "troullaki sifnos accommodation",
      "quiet rural stays sifnos",
      "peaceful village retreats",
      "authentic island experience",
      "nature escapes sifnos"
    ],
    meta: {
      title: "Accommodation in Troullaki, Sifnos - Tranquil Rural Retreats",
      description: "Escape to Troullaki, a peaceful rural settlement on Sifnos island offering authentic accommodations, natural beauty, and a genuine unhurried Greek island experience."
    }
  },
  {
    id: "herronisos",
    name: "Herronisos",
    slug: "herronisos",
    shortDescription: "A remote fishing village on the northern tip of the island with authentic charm.",
    description: "Herronisos (also spelled Cheronissos) is a small, remote fishing village located at the northernmost tip of Sifnos island. This secluded settlement offers visitors an authentic glimpse into traditional island life far from the more developed tourist centers. The village consists of a cluster of whitewashed houses surrounding a small, protected bay with crystal-clear waters. Herronisos is known for its excellent fresh seafood tavernas where fishermen bring their daily catch directly to your plate. The limited accommodation options typically include simple rooms and vacation homes with sea views. Despite its remoteness, or perhaps because of it, Herronisos provides a genuine experience of Greek island serenity and is perfect for those seeking to disconnect and enjoy the simple pleasures of sea, sun, and authentic local cuisine.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 2,
    keywords: [
      "herronisos sifnos accommodation",
      "cheronissos hotels",
      "remote fishing village stays",
      "authentic seaside rooms",
      "northern sifnos lodging"
    ],
    meta: {
      title: "Accommodation in Herronisos, Sifnos - Authentic Fishing Village Stays",
      description: "Experience the authentic charm of Herronisos, a remote fishing village on Sifnos' northern tip with seaside accommodations, fresh seafood tavernas, and a peaceful, unhurried atmosphere."
    }
  },
  {
    id: "chrysopigi",
    name: "Chrysopigi",
    slug: "chrysopigi",
    shortDescription: "A scenic area famous for its iconic monastery and beautiful beaches.",
    description: "Chrysopigi is one of the most photographed and iconic locations on Sifnos island, named after the famous Chrysopigi Monastery that sits dramatically on a rock formation separated from the mainland by a narrow strip of sea. This scenic area features beautiful beaches with crystal-clear turquoise waters, including Apokofto beach with its fine sand and shallow waters ideal for families. The natural beauty of the region, with its combination of historic architecture and stunning coastal scenery, makes it a popular destination for visitors. Accommodation options in Chrysopigi range from small family-run hotels to vacation apartments, many offering magnificent sea views. The area provides a perfect balance of natural beauty, cultural significance, and peaceful atmosphere, with some excellent tavernas serving fresh seafood and local specialties.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    hotelsCount: 4,
    keywords: [
      "chrysopigi sifnos hotels",
      "accommodation near chrysopigi monastery",
      "beach stays sifnos",
      "apokofto beach hotels",
      "scenic accommodation sifnos"
    ],
    meta: {
      title: "Hotels in Chrysopigi, Sifnos - Scenic Stays by the Iconic Monastery",
      description: "Stay near the iconic Chrysopigi Monastery on Sifnos island and enjoy beautiful beaches, crystal-clear waters, and scenic accommodations in one of the island's most photographed locations."
    }
  }
];

export const getLocationBySlug = (slug: string): Location | undefined => {
  return sifnosLocations.find(location => location.slug === slug);
};
