import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Hotel, Waves } from 'lucide-react';
import LocationCard from '@/components/LocationCard';
import { sifnosLocations } from '../../data/locations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LocationsSection() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  
  // Show top 6 locations
  const featuredLocations = sifnosLocations.slice(0, 6);
  
  // Calculate totals
  const totalHotels = sifnosLocations.reduce((sum, loc) => sum + loc.hotelsCount, 0);

  return (
    <section className="py-16 bg-gradient-to-b from-accent-50 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            Explore the Island
          </Badge>
          <h2 className="text-4xl font-heading font-bold text-foreground mb-3">
            Explore Sifnos by Location
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            From bustling port towns to serene beach villages, discover the perfect area for your island escape
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Hotel className="h-4 w-4 text-accent" />
              <span>{totalHotels} Hotels</span>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-accent" />
              <span>25+ Beaches</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <span>{sifnosLocations.length} Areas</span>
            </div>
          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="mb-12 relative">
          <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-elegant relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-100/20 to-primary-100/20 pointer-events-none"></div>
            
            {/* Map visualization */}
            <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {featuredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => window.location.href = `/locations/${location.slug}`}
                  onMouseEnter={() => setHoveredLocation(location.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300
                    ${hoveredLocation === location.id 
                      ? 'border-accent bg-accent-50 shadow-glow scale-105 z-10' 
                      : 'border-border bg-background/80 hover:border-accent/50 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${hoveredLocation === location.id 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-accent-100 text-accent'
                      }
                    `}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-foreground text-sm">
                        {location.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {location.hotelsCount} hotels
                      </p>
                    </div>
                  </div>
                  
                  {/* Pulse effect on hover */}
                  {hoveredLocation === location.id && (
                    <div className="absolute inset-0 rounded-xl border-2 border-accent animate-ping opacity-20"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Map legend */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Click any location to explore hotels and discover what makes each area unique
              </p>
            </div>
          </div>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {featuredLocations.map((location, index) => (
            <div
              key={location.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LocationCard
                name={location.name}
                description={location.shortDescription}
                imageUrl={location.imageUrl}
                hotelsCount={location.hotelsCount}
                slug={location.slug}
                className="h-full transform transition-all duration-500 hover:scale-105 hover:shadow-elegant-lg"
              />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link to="/locations">
            <Button 
              size="lg" 
              variant="premium"
              className="gap-2 shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
            >
              <MapPin className="h-5 w-5" />
              See All Locations
              <span className="text-lg">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
