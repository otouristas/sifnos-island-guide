import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Waves, Home, Users, Building2, Wallet, ArrowRight } from 'lucide-react';

const hotelTypeData = [
  {
    id: 'luxury-hotels',
    title: 'Luxury Hotels',
    slug: 'luxury-hotels',
    icon: Sparkles,
    properties: 8,
    priceFrom: 200,
  },
  {
    id: 'beach-hotels',
    title: 'Beach Hotels',
    slug: 'beach-hotels',
    icon: Waves,
    properties: 15,
    priceFrom: 100,
  },
  {
    id: 'villas',
    title: 'Private Villas',
    slug: 'villas',
    icon: Building2,
    properties: 6,
    priceFrom: 250,
  },
  {
    id: 'family-friendly',
    title: 'Family Hotels',
    slug: 'family-friendly-hotels',
    icon: Users,
    properties: 12,
    priceFrom: 90,
  },
  {
    id: 'boutique',
    title: 'Boutique Hotels',
    slug: 'boutique-hotels',
    icon: Home,
    properties: 7,
    priceFrom: 120,
  },
  {
    id: 'budget',
    title: 'Budget Hotels',
    slug: 'budget-hotels',
    icon: Wallet,
    properties: 10,
    priceFrom: 60,
  },
];

export default function HotelTypesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-4">
            Browse by Hotel Type
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From luxury resorts to cozy budget stays, find your perfect accommodation
          </p>
        </div>

        {/* Hotel Types Grid - Clean Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {hotelTypeData.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.id}
                to={`/hotel-types/${type.slug}`}
                className="group block bg-white rounded-2xl p-6 border border-gray-200 hover:border-sifnos-beige hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-sifnos-beige/20 text-sifnos-deep-blue group-hover:bg-sifnos-beige group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-bold text-sifnos-deep-blue mb-2">
                  {type.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{type.properties} properties</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-semibold text-sifnos-deep-blue">From €{type.priceFrom}/night</span>
                </div>

                <div className="flex items-center text-sifnos-deep-blue font-medium text-sm group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link to="/hotel-types">
            <Button
              size="lg"
              className="gap-2 bg-sifnos-deep-blue text-white hover:bg-sifnos-deep-blue/90 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              View All Hotel Types
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
