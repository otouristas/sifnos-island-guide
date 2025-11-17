import { Link } from 'react-router-dom';
import { Calendar, Sun, Umbrella, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const seasons = [
  {
    icon: Sun,
    title: 'Summer (July-August)',
    description: 'Peak season with warm weather, busy beaches, and vibrant nightlife. Book early!',
    recommendations: [
      { text: 'Beachfront hotels in Platis Gialos', link: '/hotel-types/beach-hotels' },
      { text: 'Hotels with pools', link: '/hotels?amenities=pool' },
      { text: 'Family-friendly accommodations', link: '/hotel-types/family-hotels' }
    ],
    color: 'from-yellow-500/10 to-orange-500/10',
    iconColor: 'text-yellow-600',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50'
  },
  {
    icon: Umbrella,
    title: 'Shoulder Season (May-June, September-October)',
    description: 'Perfect weather, fewer crowds, and better prices. Ideal for exploring!',
    recommendations: [
      { text: 'Boutique hotels in Apollonia', link: '/hotel-types/boutique-hotels' },
      { text: 'Villas with sea views', link: '/hotel-types/villas' },
      { text: 'Hiking-friendly locations', link: '/travel-guide#hiking' }
    ],
    color: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
  },
  {
    icon: Leaf,
    title: 'Off-Season (November-April)',
    description: 'Peaceful atmosphere, lower prices, perfect for cultural exploration.',
    recommendations: [
      { text: 'Traditional guesthouses', link: '/hotel-types/traditional-hotels' },
      { text: 'Hotels in Kastro', link: '/locations/kastro' },
      { text: 'Cultural experiences', link: '/travel-guide#culture' }
    ],
    color: 'from-green-500/10 to-emerald-500/10',
    iconColor: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50'
  }
];

export default function SeasonalRecommendationsSection() {
  const currentMonth = new Date().getMonth();
  const getCurrentSeason = () => {
    if (currentMonth >= 6 && currentMonth <= 7) return 0; // July-August
    if ((currentMonth >= 4 && currentMonth <= 5) || (currentMonth >= 8 && currentMonth <= 9)) return 1; // May-June, Sep-Oct
    return 2; // Off-season
  };

  const currentSeasonIndex = getCurrentSeason();
  const currentSeason = seasons[currentSeasonIndex];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sifnos-turquoise/20 rounded-full mb-4">
            <Calendar className="h-5 w-5 text-sifnos-turquoise" />
            <span className="text-sm font-semibold text-sifnos-turquoise">Seasonal Guide</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-4">
            Best Time to Visit Sifnos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect accommodations for every season
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {seasons.map((season, index) => {
            const Icon = season.icon;
            const isCurrent = index === currentSeasonIndex;
            return (
              <Card 
                key={index}
                className={`border-2 transition-all duration-300 ${
                  isCurrent 
                    ? 'border-sifnos-turquoise shadow-xl scale-105' 
                    : 'border-gray-100 hover:border-sifnos-turquoise/50 hover:shadow-lg'
                }`}
              >
                <CardContent className={`p-6 ${season.bgColor}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${season.color} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${season.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sifnos-deep-blue text-lg">
                        {season.title}
                      </h3>
                      {isCurrent && (
                        <Badge className="mt-1 bg-sifnos-turquoise text-white text-xs">
                          Current Season
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {season.description}
                  </p>
                  <ul className="space-y-2">
                    {season.recommendations.map((rec, recIndex) => (
                      <li key={recIndex}>
                        <Link 
                          to={rec.link}
                          className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sifnos-turquoise"></span>
                          {rec.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/travel-guide#best-time-to-visit">
            <Button variant="outline" size="lg" className="border-2 border-sifnos-deep-blue text-sifnos-deep-blue hover:bg-sifnos-deep-blue hover:text-white">
              Learn More About Sifnos Seasons
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

