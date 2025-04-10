import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Umbrella, Wind, Coffee, Car, Bus, Anchor, ShieldCheck, Sailboat } from 'lucide-react';

export default function BeachesPage() {
  // Sample beaches data
  const beaches = [
    {
      name: "Platis Gialos",
      description: "One of the longest and most popular beaches on Sifnos, Platis Gialos offers golden sand, crystal-clear turquoise waters, and excellent facilities. This family-friendly beach has numerous restaurants, beach bars, and water sports options along its impressive stretch. The shallow waters make it ideal for families with children.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Water Sports", "Beach Bars", "Shops"],
      access: "Bus service from Apollonia or by car with parking available",
      windProtection: "Moderate - protected from north winds",
      bestFor: ["Families", "Swimming", "Food Lovers"],
      imagePath: "/placeholder.svg",
      location: "Southern Sifnos"
    },
    {
      name: "Kamares",
      description: "The main port of Sifnos features a lovely sandy beach with a view of arriving and departing ferries. The beach is well organized with trees providing natural shade in some areas. The picturesque village behind the beach offers plenty of accommodation options, tavernas, and cafes, making it convenient for visitors staying nearby.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Beach Bars", "Shops", "Natural Shade"],
      access: "Walking distance from the port, bus service from Apollonia",
      windProtection: "Good - protected bay",
      bestFor: ["Convenience", "Families", "Port Proximity"],
      imagePath: "/placeholder.svg",
      location: "Western Sifnos (Port)"
    },
    {
      name: "Vathi",
      description: "This stunning horseshoe-shaped bay features a beautiful sandy beach with inviting shallow waters. The traditional fishing village setting creates a peaceful atmosphere, while the beach itself offers both organized sections with facilities and quieter areas for those seeking tranquility. Vathi is known for its excellent seafood tavernas right on the beach.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Beach Bars", "Natural Shade"],
      access: "Bus service from Apollonia, road access with parking",
      windProtection: "Excellent - one of the most sheltered beaches",
      bestFor: ["Tranquility", "Scenery", "Swimming", "Food"],
      imagePath: "/placeholder.svg",
      location: "Southeastern Sifnos"
    },
    {
      name: "Chrysopigi",
      description: "One of the most picturesque beaches on Sifnos, Chrysopigi is named after the iconic whitewashed monastery that sits on the rocky peninsula separating the beach into two parts. The natural rock formations create interesting swimming areas, and the clear waters are excellent for snorkeling. The small taverna offers delicious local dishes.",
      facilities: ["Restaurant", "Limited Sunbeds"],
      access: "Bus to Faros then 15-minute walk, or drive with limited parking",
      windProtection: "Moderate - depends on which side of the peninsula",
      bestFor: ["Photography", "Snorkeling", "Natural Beauty"],
      imagePath: "/placeholder.svg",
      location: "Southeastern Sifnos"
    },
    {
      name: "Faros",
      description: "A charming coastal village with a complex of three beautiful beaches: Faros, Glyfo, and Fassolou. The main Faros beach is small but delightful, with fine golden sand and tranquil waters. The village atmosphere is peaceful, and there are excellent tavernas specializing in fresh fish and seafood nearby.",
      facilities: ["Sunbeds & Umbrellas", "Restaurants", "Natural Shade"],
      access: "Bus service from Apollonia, road access with parking",
      windProtection: "Good - sheltered bay",
      bestFor: ["Relaxation", "Swimming", "Local Atmosphere"],
      imagePath: "/placeholder.svg",
      location: "Southeastern Sifnos"
    },
    {
      name: "Vroulidia",
      description: "This hidden gem is one of the most secluded beaches on Sifnos. Accessible via a partly dirt road and a short hike down, the reward is crystal-clear turquoise waters contrasting with the white pebbles and dramatic cliffs. The beach has minimal facilities, which helps preserve its natural beauty and tranquil atmosphere.",
      facilities: ["Small Canteen (high season only)"],
      access: "Dirt road access with limited parking, then 10-minute hike down",
      windProtection: "Poor - exposed to south winds",
      bestFor: ["Seclusion", "Natural Beauty", "Snorkeling"],
      imagePath: "/placeholder.svg",
      location: "Southwestern Sifnos"
    }
  ];
  
  return (
    <>
      <SEO 
        title="Beaches in Sifnos - Discover the Best Sifnos Beaches" 
        description="Explore the stunning beaches of Sifnos Island. From golden sandy shores to secluded coves, find the perfect beach for swimming, relaxation, water sports, and family activities."
        keywords={['sifnos beaches', 'best beaches sifnos', 'platis gialos sifnos', 'vathi beach', 'kamares beach', 'chrysopigi sifnos', 'greek island beaches']}
        schemaType="TravelAgency"
        canonical="https://hotelssifnos.com/beaches"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-16">
        <div className="page-container">
          <div className="text-center text-white">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Beaches of Sifnos Island
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

      {/* Beach Safety Tips */}
      <div className="py-12 bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-center mb-8">
              Beach Safety Tips
            </h2>
            
            <div className="cycladic-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-xl mb-4 flex items-center">
                    <ShieldCheck size={20} className="text-sifnos-turquoise mr-2" />
                    Stay Safe at Sifnos Beaches
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                      <span>Use sunscreen (SPF 30+) and reapply every 2 hours, especially after swimming</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                      <span>Stay hydrated by drinking plenty of water throughout the day</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                      <span>Be cautious of strong winds which can create challenging swimming conditions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                      <span>Not all beaches have lifeguards - supervise children at all times</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-xl mb-4 flex items-center">
                    <Sailboat size={20} className="text-sifnos-turquoise mr-2" />
                    Environmental Consciousness
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                      <span>Take all trash with you when leaving the beach</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                      <span>Avoid removing pebbles, shells, or any natural elements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
                      <span>Use reef-safe sunscreen to protect marine life</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-sifnos-turquoise rounded-full mr-2 mt-2"></span>
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
