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
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    hoverColor: 'hover:border-amber-400',
  },
  {
    id: 'beach-hotels',
    title: 'Beach Hotels',
    slug: 'beach-hotels',
    icon: Waves,
    properties: 15,
    priceFrom: 100,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:border-blue-400',
  },
  {
    id: 'villas',
    title: 'Private Villas',
    slug: 'villas',
    icon: Building2,
    properties: 6,
    priceFrom: 250,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:border-purple-400',
  },
  {
    id: 'family-friendly',
    title: 'Family Hotels',
    slug: 'family-friendly-hotels',
    icon: Users,
    properties: 12,
    priceFrom: 90,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverColor: 'hover:border-green-400',
  },
  {
    id: 'boutique',
    title: 'Boutique Hotels',
    slug: 'boutique-hotels',
    icon: Home,
    properties: 7,
    priceFrom: 120,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    hoverColor: 'hover:border-rose-400',
  },
  {
    id: 'budget',
    title: 'Budget Hotels',
    slug: 'budget-hotels',
    icon: Wallet,
    properties: 10,
    priceFrom: 60,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:border-teal-400',
  },
];

export default function HotelTypesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">
            <Home className="h-3 w-3 mr-1" />
            Browse by Type
          </Badge>
          <h2 className="text-4xl font-heading font-bold text-foreground mb-3">
            Find Your Perfect Stay Type
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From luxury resorts to cozy budget stays, discover the perfect accommodation style for your Sifnos adventure
          </p>
        </div>

        {/* Hotel Types Grid - 2x3 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {hotelTypeData.map((type, index) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.id}
                to={`/hotel-types/${type.slug}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`
                    relative p-8 rounded-2xl border-2 transition-all duration-500
                    ${type.borderColor} ${type.hoverColor} ${type.bgColor}
                    hover:shadow-elegant-lg hover:scale-105
                    animate-fade-in
                  `}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`
                        w-20 h-20 rounded-2xl bg-gradient-to-br ${type.color}
                        flex items-center justify-center
                        transform transition-all duration-500
                        group-hover:scale-110 group-hover:rotate-6
                        shadow-lg
                      `}
                    >
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                      {type.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{type.properties} properties</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-2">
                      <p className="text-lg font-semibold text-foreground">
                        From €{type.priceFrom}
                        <span className="text-sm font-normal text-muted-foreground">/night</span>
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <Button
                        variant="ghost"
                        className="gap-2 group-hover:gap-3 transition-all"
                      >
                        Explore
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
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
              variant="premium"
              className="gap-2 shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
            >
              <Home className="h-5 w-5" />
              View All Hotel Types
              <span className="text-lg">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
