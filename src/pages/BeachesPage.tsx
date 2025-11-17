import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Umbrella, Wind, Coffee, Car, Bus, Anchor, ShieldCheck, Sailboat, Award, TreePalm, Fish, Church } from 'lucide-react';

export default function BeachesPage() {
  // Updated beaches data with the new information and fixed image paths
  const beaches = [
    {
      name: "Platis Gialos",
      description: "One of the largest and most popular sandy beaches on Sifnos, especially beloved by Greek visitors. It consistently earns the Blue Flag from the FEE, thanks to its compliance with 32 strict environmental and quality criteria. Nearby attractions include the White Tower (1.5 km northeast), the best-preserved of Sifnos' 77 ancient beacon towers. The area features a lively mix of accommodations, restaurants, shops, cafés, and pottery studios.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Water Sports", "Beach Bars", "Shops", "Pottery Studios"],
      access: "Bus service from Apollonia or by car with parking available",
      windProtection: "Moderate - protected from north winds",
      bestFor: ["Families", "Swimming", "Food Lovers", "Blue Flag Beach"],
      imagePath: "/uploads/beaches/plats-gialos.webp",
      location: "Southern Sifnos",
      highlights: [
        "Blue Flag awarded beach",
        "White Tower (ancient beacon) nearby", 
        "Hiking routes to southern villages",
        "View of Kitriani islet with ancient church"
      ]
    },
    {
      name: "Kamares",
      description: "The main port of Sifnos and the island's largest coastal village, just 5 km from the capital Apollonia. As the main arrival point, it offers the highest concentration of hotels, rooms to let, tavernas, grocery stores, cafés, bakeries, pottery workshops, and tourist services. It also hosts essential facilities such as the Port Authority and the Municipal Information Office.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Beach Bars", "Shops", "Natural Shade", "Port Authority", "Municipal Information Office", "Grocery Stores", "Bakeries", "Pottery Workshops"],
      access: "Main port arrival point, walking distance from the port, bus service from Apollonia",
      windProtection: "Good - protected bay",
      bestFor: ["Convenience", "Families", "Port Proximity", "Hiking"],
      imagePath: "/uploads/beaches/kamares.webp",
      location: "Western Sifnos (Port)",
      highlights: [
        "Main arrival port for ferries",
        "Starting point for scenic hiking routes",
        "Trails to Church of the Nymfon and Mavri Spilia (Black Cave)",
        "Connection to NATURA protected areas"
      ]
    },
    {
      name: "Vathi",
      description: "Located 10 km west of Apollonia, Vathi is a peaceful coastal village known for its wide, sandy beach and tranquil vibe. Once a major pottery hub, the village retains its artisanal charm. Excavations at 'Punta tou Polemikou' reveal prehistoric tombs and settlements. Nature lovers can enjoy the rare sand lilies that bloom in August.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Beach Bars", "Natural Shade", "Pottery Studios"],
      access: "Bus service from Apollonia, road access with parking",
      windProtection: "Excellent - one of the most sheltered beaches",
      bestFor: ["Tranquility", "Scenery", "Swimming", "Archaeology", "Nature"],
      imagePath: "/uploads/beaches/vathi.webp",
      location: "Western Sifnos",
      highlights: [
        "Prehistoric archaeological site",
        "Rare sand lilies (August blooming)",
        "16th-century Church of Taxiarches",
        "Hiking trails to Platy Gialos and Fykiada"
      ]
    },
    {
      name: "Chrysopigi",
      description: "Located 10 km from Apollonia, near Platy Gialos, Chrysopigi is the most photographed and revered location on the island. It's home to the Monastery of Panagia Chrysopigi (1523), the patron saint of Sifnos. The annual festival on the eve of Ascension Day includes a moving procession of the holy icon. The peninsula features dramatic rocks perfect for diving, the peaceful Apokoftou beach with just two tavernas.",
      facilities: ["Restaurant", "Limited Sunbeds", "Monastery"],
      access: "Bus to Faros then 15-minute walk, or drive with limited parking",
      windProtection: "Moderate - depends on which side of the peninsula",
      bestFor: ["Photography", "Snorkeling", "Natural Beauty", "Religious Interest"],
      imagePath: "/uploads/beaches/chrysopigi.webp",
      location: "Southeastern Sifnos",
      highlights: [
        "Monastery of Panagia Chrysopigi (1523)",
        "Patron saint of Sifnos",
        "Annual religious festival",
        "Nearby White Tower ancient beacon"
      ]
    },
    {
      name: "Faros",
      description: "Seven kilometers from Apollonia, Faros is a traditional fishing village and once the main port of Sifnos. Named after the ancient lighthouse ('faros'), it offers serene beaches and cultural experiences. Glyfou beach, known for its brackish water well, is the starting point of a beautiful lit path leading to Apokoftou and Chrysopigi beaches. Nearby, remnants of ancient ore-loading facilities can be seen.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Natural Shade", "Lit Walking Path"],
      access: "Bus service from Apollonia, road access with parking",
      windProtection: "Good - sheltered bay",
      bestFor: ["Relaxation", "Swimming", "Local Atmosphere", "Coastal Walks"],
      imagePath: "/uploads/beaches/faros.webp",
      location: "Southeastern Sifnos",
      highlights: [
        "Traditional fishing village",
        "Ancient lighthouse history",
        "Monastery of Stavros on Fasolou beach",
        "Hiking trails to Agios Andreas Acropolis and Kastro"
      ]
    },
    {
      name: "Herronisos",
      description: "The northernmost beach of Sifnos, 15 km from Apollonia, Herronisos is a secluded fishing village famed for its peaceful atmosphere, traditional pottery, and small beach. Local highlights include Agios Georgios church and an ancient beacon tower above the village. On the road to Herronisos, travelers pass through Troullaki and Diavroucha, where more pottery workshops can be found.",
      facilities: ["Small Tavernas", "Traditional Pottery"],
      access: "Limited bus service, better accessible by car with parking",
      windProtection: "Moderate - exposed to north winds",
      bestFor: ["Seclusion", "Traditional Charm", "Pottery"],
      imagePath: "/uploads/beaches/heronissos.webp",
      location: "Northern Sifnos",
      highlights: [
        "Northernmost beach on the island",
        "Traditional fishing village",
        "Ancient beacon tower",
        "Agios Georgios church"
      ]
    },
    {
      name: "Vroulidia",
      description: "Located just 1 km from Herronisos and 14 km from Apollonia, Vroulidia is a tranquil pebble beach ideal for relaxation. It offers two seaside cafés that provide umbrellas and sunbeds for visitors, maintaining its natural beauty and quiet atmosphere.",
      facilities: ["Two Seaside Cafés", "Umbrellas & Sunbeds"],
      access: "Dirt road access with limited parking, then 10-minute hike down",
      windProtection: "Poor - exposed to south winds",
      bestFor: ["Seclusion", "Natural Beauty", "Snorkeling", "Peace and Quiet"],
      imagePath: "/uploads/beaches/vroulidia.webp",
      location: "Northern Sifnos",
      highlights: [
        "Tranquil pebble beach",
        "Crystal clear waters",
        "Unspoiled natural setting"
      ]
    },
    {
      name: "Fykiada",
      description: "A secluded sandy beach accessible only by sea or hiking trails from Platy Gialos and Vathi. Near the beach stands the chapel of Agios Georgios and one of the island's oldest olive trees, offering a truly unspoiled experience for those seeking natural beauty away from crowds.",
      facilities: ["None - Unspoiled Beach"],
      access: "Only by foot via hiking trails from Platy Gialos or Vathi, or by boat",
      windProtection: "Variable - somewhat exposed",
      bestFor: ["Adventure", "Hiking", "Complete Seclusion"],
      imagePath: "/uploads/beaches/fykiada.webp",
      location: "Between Platy Gialos and Vathi",
      highlights: [
        "Completely undeveloped beach",
        "Ancient olive tree",
        "Chapel of Agios Georgios",
        "Only accessible by hiking or boat"
      ]
    }
  ];
  
  return (
    <>
      <SEO 
        title="15 Best Beaches in Sifnos 2026 + Map & Hotels Nearby"
        description="Discover the best beaches in Sifnos for 2026  from golden Platis Gialos to secluded Vroulidia. Complete guide with photos, facilities, access tips and nearby hotel recommendations to plan your perfect beach day."
        keywords={[
          'best sifnos beaches 2026', 'sifnos beach guide 2026', 'platis gialos beach', 
          'vathi beach sifnos', 'kamares beach', 'faros beach sifnos', 'chrysopigi beach',
          'family beaches sifnos', 'secluded beaches sifnos', 'cyclades beaches',
          'greece beach guide', 'swimming sifnos', 'beach holidays greece'
        ]}
        pageType="general"
        schemaType="TouristDestination"
        canonical="https://hotelssifnos.com/beaches"
        imageUrl="/uploads/beaches/plats-gialos.webp"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-16">
        <div className="page-container">
          <div className="text-center text-white">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Best Beaches in Sifnos Island 2026
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Discover the pristine golden shores, crystal clear waters, and hidden coves of this enchanting Cycladic island
            </p>
          </div>
        </div>
      </div>
      
      {/* Introduction */}
      <div className="py-12 bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p>
              Sifnos is blessed with some of the most beautiful beaches in the Cyclades, ranging from long stretches of golden sand to intimate coves framed by dramatic cliffs. The island's varied coastline offers options for every preference – whether you seek vibrant beach bars and water sports or secluded spots for quiet relaxation.
            </p>
            <p>
              Most beaches on Sifnos feature crystal-clear waters in stunning shades of blue and turquoise. Many are easily accessible by car or public transportation, while others reward adventurous travelers with natural beauty and privacy after a short hike. Regardless of where you choose to swim, Sifnos beaches offer unforgettable experiences with their unique Cycladic charm.
            </p>
          </div>
        </div>
      </div>

      {/* Beaches Listing */}
      <div className="py-12 bg-gray-50">
        <div className="page-container">
          <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-center mb-12">
            Explore Our Beautiful Beaches
          </h2>
          
          <div className="space-y-12">
            {beaches.map((beach, index) => (
              <div 
                key={beach.name} 
                id={beach.name.toLowerCase().replace(/\s+/g, '-')} 
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 cycladic-card p-0 overflow-hidden`}
              >
                {/* Image */}
                <div className="lg:w-2/5">
                  <div className="h-64 lg:h-full bg-sifnos-teal/20">
                    <img 
                      src={beach.imagePath} 
                      alt={`${beach.name} beach in Sifnos Island`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="lg:w-3/5 p-6 lg:p-8">
                  <h3 className="text-2xl font-montserrat font-semibold mb-2">{beach.name}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="text-sifnos-turquoise mr-1" />
                    <span>{beach.location}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {beach.description}
                  </p>
                  
                  {/* Key Highlights */}
                  {beach.highlights && (
                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-3 flex items-center">
                        <Award size={18} className="text-sifnos-turquoise mr-2" />
                        Key Highlights
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {beach.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                            <span className="text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Facilities */}
                    <div>
                      <h4 className="font-medium text-lg mb-2 flex items-center">
                        <Umbrella size={18} className="text-sifnos-turquoise mr-2" />
                        Facilities
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {beach.facilities.map((facility) => (
                          <li key={facility} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2"></span>
                            {facility}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Other Details */}
                    <div className="space-y-3">
                      {/* Access */}
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Car size={16} className="text-sifnos-turquoise mr-2" />
                          Access
                        </h4>
                        <p className="text-sm text-gray-700">{beach.access}</p>
                      </div>
                      
                      {/* Wind Protection */}
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Wind size={16} className="text-sifnos-turquoise mr-2" />
                          Wind Protection
                        </h4>
                        <p className="text-sm text-gray-700">{beach.windProtection}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Best For Tags */}
                  <div>
                    <h4 className="font-medium mb-2">Perfect For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {beach.bestFor.map((tag) => (
                        <span key={tag} className="bg-gray-100 py-1 px-3 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section - Improved spacing and padding */}
      <div className="py-16 bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-center mb-10">
              Frequently Asked Questions About Sifnos Beaches
            </h2>
            
            <div className="cycladic-card p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-lg mb-3">Which is the best beach for families on Sifnos?</h3>
                  <p className="text-gray-700">Platy Gialos and Kamares are ideal for families thanks to their wide sandy shores, shallow waters, and full amenities.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Where can I find traditional pottery workshops?</h3>
                  <p className="text-gray-700">Pottery lovers should visit Kamares, Faros, and Herronisos, where authentic workshops operate year-round.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Are there hiking trails starting from the beach villages?</h3>
                  <p className="text-gray-700">Yes! Kamares, Faros, Vathi, and Platy Gialos all serve as trailheads for scenic routes across Sifnos.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">What is the most famous church on Sifnos?</h3>
                  <p className="text-gray-700">The Monastery of Panagia Chrysopigi is the island's most iconic religious site and patron saint, celebrated with a major annual festival.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Can I access Fykiada beach by car?</h3>
                  <p className="text-gray-700">No, Fykiada is only reachable by foot or by boat, offering a serene, crowd-free experience.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Are there Blue Flag beaches on Sifnos?</h3>
                  <p className="text-gray-700">Yes, Platy Gialos consistently earns the Blue Flag award for cleanliness, safety, and eco-friendliness.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beach Safety Tips - Improved spacing and padding */}
      <div className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-center mb-10">
              Beach Safety Tips
            </h2>
            
            <div className="cycladic-card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-medium text-xl mb-6 flex items-center">
                    <ShieldCheck size={20} className="text-sifnos-turquoise mr-3 flex-shrink-0" />
                    <span>Stay Safe at Sifnos Beaches</span>
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Use sunscreen (SPF 30+) and reapply every 2 hours, especially after swimming</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Stay hydrated by drinking plenty of water throughout the day</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Be cautious of strong winds which can create challenging swimming conditions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Not all beaches have lifeguards - supervise children at all times</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-xl mb-6 flex items-center">
                    <Sailboat size={20} className="text-sifnos-turquoise mr-3 flex-shrink-0" />
                    <span>Environmental Consciousness</span>
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Take all trash with you when leaving the beach</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Avoid removing pebbles, shells, or any natural elements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Use reef-safe sunscreen to protect marine life</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      <span>Respect local wildlife and marine ecosystems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-sifnos-deep-blue text-white">
        <div className="page-container text-center">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-6">
            Ready to Experience Sifnos Beaches?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Find the perfect accommodation near your favorite beach for an unforgettable Sifnos experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/hotels" 
              className="bg-white text-sifnos-deep-blue px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Beach Hotels
            </Link>
            <Link 
              to="/travel-guide" 
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Explore Travel Guide
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
