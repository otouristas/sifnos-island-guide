import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  Car, 
  Users,
  Waves,
  Landmark,
  UtensilsCrossed,
  Target,
  CalendarDays
} from 'lucide-react';

import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';

const beaches = [
  {
    name: "Platis Gialos",
    description: "The most popular and organized beach with golden sand and shallow waters, perfect for families.",
    features: ["Organized beach", "Beach bars", "Water sports", "Family-friendly"],
    image: "/uploads/beaches/plats-gialos.webp",
    hotels: ["Villa Olivia Clara", "Platis Gialos Hotels"],
    travelTime: "15 min from Apollonia",
    bestFor: "Families & Beach lovers"
  },
  {
    name: "Vathi",
    description: "A sheltered bay with crystal-clear waters and a charming fishing village atmosphere.",
    features: ["Sheltered bay", "Traditional tavernas", "Crystal clear water", "Scenic drive"],
    image: "/uploads/beaches/vathi.webp",
    hotels: ["Traditional accommodations"],
    travelTime: "20 min from Apollonia",
    bestFor: "Couples & Nature lovers"
  },
  {
    name: "Kamares",
    description: "The port beach with good infrastructure and easy access to restaurants and cafes.",
    features: ["Port location", "Easy access", "Restaurants nearby", "Ferry connections"],
    image: "/uploads/beaches/kamares.webp",
    hotels: ["ALK Hotel", "Kamares Hotels"],
    travelTime: "10 min from Apollonia",
    bestFor: "Convenience & Dining"
  },
  {
    name: "Faros",
    description: "Two beautiful beaches separated by a small peninsula, offering both organized and secluded options.",
    features: ["Two beaches", "Lighthouse views", "Windsurfing", "Mixed crowd"],
    image: "/uploads/beaches/faros.webp",
    hotels: ["Faros accommodations"],
    travelTime: "25 min from Apollonia",
    bestFor: "Adventure & Photography"
  },
  {
    name: "Chrysopigi",
    description: "Famous for its iconic monastery built on a rock, offering spectacular views and crystal waters.",
    features: ["Iconic monastery", "Spectacular views", "Photo spot", "Spiritual"],
    image: "/uploads/beaches/chrysopigi.webp",
    hotels: ["Nearby villas"],
    travelTime: "20 min from Apollonia",
    bestFor: "Sightseeing & Photos"
  },
  {
    name: "Vroulidia",
    description: "A secluded beach accessible by a hiking trail, perfect for those seeking privacy and nature.",
    features: ["Secluded", "Hiking access", "Natural beauty", "Nudist-friendly"],
    image: "/uploads/beaches/vroulidia.webp",
    hotels: ["Remote accommodations"],
    travelTime: "30 min from Apollonia + hike",
    bestFor: "Privacy & Hiking"
  }
];

export default function BestBeachesSifnosPage() {
  return (
    <>
      <SEO 
        title="17 Best Beaches in Sifnos: Complete Guide with Maps"
        description="Discover Sifnos' most beautiful beaches: from family-friendly Platis Gialos to secret coves locals love. Photos, directions, amenities, nearby hotels."
        keywords={[
          'best beaches sifnos 2026', 'sifnos beaches guide', 'platis gialos beach',
          'sifnos beach hotels', 'best beaches sifnos greece', 'sifnos travel guide'
        ]}
        pageType="general"
        canonical="https://hotelssifnos.com/best-beaches-sifnos-guide"
        imageUrl="/uploads/beaches/plats-gialos.webp"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 text-sifnos-deep-blue">
            <Waves className="h-8 w-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Best Beaches in Sifnos: Complete Guide 2026</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From the popular organized beaches to hidden gems accessible only by hiking, 
            discover Sifnos' most spectacular coastlines and the best hotels to stay nearby.
          </p>
        </div>

        {/* Quick Overview */}
        <section className="mb-16 bg-gradient-to-r from-sifnos-turquoise to-blue-500 text-white p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Sifnos Beaches Are Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Waves className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crystal Clear Waters</h3>
              <p>Pristine Aegean waters with exceptional visibility and varying shades of blue</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Landmark className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich History</h3>
              <p>Ancient monasteries, traditional fishing villages, and archaeological sites</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Culinary Excellence</h3>
              <p>Beachside tavernas serving fresh seafood and famous Sifnian specialties</p>
            </div>
          </div>
        </section>

        {/* Beaches Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-sifnos-deep-blue mb-8 text-center">
            Top 6 Must-Visit Beaches in Sifnos
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {beaches.map((beach, index) => (
              <Card key={beach.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={beach.image} 
                    alt={`${beach.name} Beach, Sifnos`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                    #{index + 1} Beach
                  </div>
                  <div className="absolute bottom-4 right-4 bg-sifnos-turquoise text-white px-3 py-1 rounded-full text-sm">
                    {beach.bestFor}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-sifnos-deep-blue mb-3">{beach.name}</h3>
                  <p className="text-gray-600 mb-4">{beach.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-2" />
                      <span>{beach.travelTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={16} className="mr-2" />
                      <span>Best for: {beach.bestFor}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Beach Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {beach.features.map(feature => (
                        <span 
                          key={feature}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Nearby Hotels:</h4>
                    <p className="text-sm text-gray-600 mb-3">{beach.hotels.join(', ')}</p>
                    <Link 
                      to={`/locations/${beach.name.toLowerCase().replace(' ', '-')}`}
                      className="inline-block text-sifnos-turquoise hover:text-sifnos-deep-blue font-medium text-sm"
                    >
                      View Hotels Near {beach.name} →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Beach Tips Section */}
        <section className="mb-16 bg-gray-50 p-8 rounded-xl">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Target className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Insider Beach Tips for Sifnos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2">Best Time to Visit</h3>
                <p className="text-gray-600">
                  <strong>Early morning (7-10 AM)</strong> for peaceful swimming and photography. 
                  <strong>Late afternoon (4-7 PM)</strong> for golden hour and sunset views.
                </p>
              </div>
              
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2">Transportation</h3>
                <p className="text-gray-600">
                  Rent a car or ATV for maximum flexibility. Some beaches like Vroulidia 
                  require hiking. Public buses serve major beaches during summer.
                </p>
              </div>
              
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2">What to Bring</h3>
                <p className="text-gray-600">
                  Umbrella for shade, water shoes for rocky areas, snorkeling gear 
                  for clear waters, and sunscreen (UV is strong in the Cyclades).
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Local Etiquette</h3>
                <p className="text-gray-600">
                  Respect local customs, especially near monasteries. Some beaches 
                  are clothing-optional but always check local practices first.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Weather Considerations</h3>
                <p className="text-gray-600">
                  Meltemi winds can be strong in July-August. Sheltered bays like 
                  Vathi offer protection. Check wind conditions before visiting.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Hidden Gems</h3>
                <p className="text-gray-600">
                  Ask locals about seasonal beaches and secret spots. Many coves 
                  are only accessible by boat or hiking trails.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Recommendations by Beach */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Landmark className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Best Hotels by Beach Location</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Platis Gialos Beach</h3>
              <p className="text-gray-600 mb-4">Stay steps from the island's most popular beach</p>
              <Link 
                to="/locations/platis-gialos"
                className="inline-block px-6 py-2 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors"
              >
                View Beach Hotels
              </Link>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Kamares Port</h3>
              <p className="text-gray-600 mb-4">Convenient location with beach access and dining</p>
              <Link 
                to="/locations/kamares"
                className="inline-block px-6 py-2 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors"
              >
                View Port Hotels
              </Link>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Secluded Bays</h3>
              <p className="text-gray-600 mb-4">Private villas near hidden beaches</p>
              <Link 
                to="/hotel-types/luxury-hotels"
                className="inline-block px-6 py-2 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors"
              >
                View Luxury Villas
              </Link>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-sifnos-deep-blue text-white p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Sifnos' Best Beaches?</h2>
          <p className="text-xl mb-6">
            Book your perfect beachfront accommodation and start planning your island adventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/hotels"
              className="px-8 py-3 bg-white text-sifnos-deep-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Browse Beachfront Hotels
            </Link>
            <Link 
              to="/ferry-tickets"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-sifnos-deep-blue transition-colors font-medium"
            >
              Book Ferry Tickets
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}