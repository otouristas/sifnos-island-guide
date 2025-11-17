import { Link } from 'react-router-dom';
import { MapPin, Waves, Utensils, Camera, Hiking } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NearbyAttractionsProps {
  hotel: any;
}

export default function NearbyAttractions({ hotel }: NearbyAttractionsProps) {
  if (!hotel?.location) return null;

  const location = hotel.location.toLowerCase();
  
  // Map locations to nearby attractions
  const attractionsMap: Record<string, Array<{ name: string; type: string; distance: string; link: string; icon: any }>> = {
    'kamares': [
      { name: 'Kamares Beach', type: 'Beach', distance: '0.2 km', link: '/best-beaches-sifnos-guide#kamares', icon: Waves },
      { name: 'Kamares Port', type: 'Port', distance: '0.1 km', link: '/locations/kamares', icon: MapPin },
      { name: 'Local Tavernas', type: 'Dining', distance: '0.3 km', link: '/travel-guide#dining', icon: Utensils },
    ],
    'platis gialos': [
      { name: 'Platis Gialos Beach', type: 'Beach', distance: '0.1 km', link: '/best-beaches-sifnos-guide#platis-gialos', icon: Waves },
      { name: 'Chrysopigi Monastery', type: 'Monastery', distance: '2 km', link: '/travel-guide#monasteries', icon: Camera },
      { name: 'Beach Restaurants', type: 'Dining', distance: '0.2 km', link: '/travel-guide#dining', icon: Utensils },
    ],
    'apollonia': [
      { name: 'Apollonia Village', type: 'Village', distance: '0.5 km', link: '/locations/apollonia', icon: MapPin },
      { name: 'Local Shops', type: 'Shopping', distance: '0.3 km', link: '/travel-guide#shopping', icon: Camera },
      { name: 'Traditional Tavernas', type: 'Dining', distance: '0.4 km', link: '/travel-guide#dining', icon: Utensils },
    ],
    'vathi': [
      { name: 'Vathi Beach', type: 'Beach', distance: '0.2 km', link: '/best-beaches-sifnos-guide#vathi', icon: Waves },
      { name: 'Pottery Workshops', type: 'Culture', distance: '0.5 km', link: '/travel-guide#pottery', icon: Camera },
      { name: 'Vathi Bay', type: 'Bay', distance: '0.1 km', link: '/locations/vathi', icon: MapPin },
    ],
    'faros': [
      { name: 'Faros Beaches', type: 'Beach', distance: '0.5 km', link: '/best-beaches-sifnos-guide#faros', icon: Waves },
      { name: 'Faros Lighthouse', type: 'Lighthouse', distance: '1 km', link: '/travel-guide#sights', icon: Camera },
      { name: 'Seafood Restaurants', type: 'Dining', distance: '0.3 km', link: '/travel-guide#dining', icon: Utensils },
    ],
    'kastro': [
      { name: 'Kastro Village', type: 'Historic Village', distance: '0.2 km', link: '/locations/kastro', icon: MapPin },
      { name: 'Sunset Views', type: 'Viewpoint', distance: '0.1 km', link: '/travel-guide#sights', icon: Camera },
      { name: 'Historic Churches', type: 'Culture', distance: '0.3 km', link: '/travel-guide#churches', icon: Camera },
    ],
  };

  const attractions = attractionsMap[location] || [
    { name: 'Nearby Beaches', type: 'Beach', distance: 'Various', link: '/best-beaches-sifnos-guide', icon: Waves },
    { name: 'Local Restaurants', type: 'Dining', distance: 'Various', link: '/travel-guide#dining', icon: Utensils },
    { name: 'Sifnos Attractions', type: 'Sights', distance: 'Various', link: '/travel-guide', icon: Camera },
  ];

  return (
    <div className="cycladic-card p-8 md:p-10 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-12 bg-gradient-to-b from-sifnos-turquoise to-sifnos-deep-blue rounded-full"></div>
        <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">Nearby Attractions</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {attractions.map((attraction, index) => {
          const Icon = attraction.icon;
          return (
            <Link key={index} to={attraction.link}>
              <Card className="border-2 border-gray-100 hover:border-sifnos-turquoise/50 transition-all h-full cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-sifnos-turquoise/10 to-sifnos-deep-blue/10 flex items-center justify-center group-hover:bg-sifnos-turquoise/20 transition-colors">
                      <Icon className="h-5 w-5 text-sifnos-turquoise" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sifnos-deep-blue mb-1 group-hover:text-sifnos-turquoise transition-colors">
                        {attraction.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">{attraction.type}</p>
                      <p className="text-xs text-gray-400">{attraction.distance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to={`/locations/${location.replace(/\s+/g, '-')}`}>
            Explore {hotel.location}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/best-beaches-sifnos-guide">
            Best Beaches Guide
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/travel-guide">
            Complete Travel Guide
          </Link>
        </Button>
      </div>
    </div>
  );
}

