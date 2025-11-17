import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ship, Hotel, Sparkles, Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';

interface TravelPackage {
  id: string;
  name: string;
  description: string;
  ferry_route: string;
  base_price: number;
  discount_percentage: number;
  final_price: number;
  included_amenities: string[];
  valid_from: string;
  valid_until: string;
  max_guests: number;
  hotel_id: string;
  hotels?: {
    name: string;
    location: string;
    rating: number;
  };
}

export default function TravelPackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select(`
          *,
          hotels:hotel_id(name, location, rating)
        `)
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString().split('T')[0])
        .order('discount_percentage', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load travel packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (basePrice: number, finalPrice: number) => {
    return (basePrice - finalPrice).toFixed(2);
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  return (
    <>
      <SEO
        title="Sifnos Ferry + Hotel Packages 2026 - Best Combo Deals"
        description="Save up to 25% with our exclusive Sifnos ferry + hotel packages. All-inclusive travel deals with round-trip ferries, premium hotels, and special perks. Book your complete island getaway today."
        keywords={[
          'sifnos packages', 'ferry hotel combo', 'sifnos travel deals',
          'greece vacation packages', 'cyclades packages', 'all inclusive sifnos',
          'sifnos holiday packages', 'ferry hotel discount', 'sifnos getaway deals'
        ]}
        pageType="general"
        canonical="https://hotelssifnos.com/packages"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <Sparkles className="h-4 w-4 mr-1" />
            Save Up to 25%
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ferry + Hotel Packages
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete Sifnos getaway packages with guaranteed best prices. Ferry tickets, premium hotels, and exclusive perks — all in one convenient booking.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Ship, title: 'Ferry Included', desc: 'Round-trip tickets' },
            { icon: Hotel, title: 'Premium Hotels', desc: 'Hand-picked stays' },
            { icon: Sparkles, title: 'Special Perks', desc: 'Exclusive amenities' },
            { icon: CheckCircle2, title: 'Best Price', desc: 'Guaranteed savings' }
          ].map((benefit, idx) => (
            <Card key={idx} className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/20">
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-primary text-primary-foreground">
                    Save {pkg.discount_percentage}%
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground line-through">€{pkg.base_price}</p>
                    <p className="text-3xl font-bold text-primary">€{pkg.final_price}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                </div>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription className="text-base">{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                {/* Package Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Ship className="h-4 w-4 text-primary" />
                    <span className="font-medium">Ferry Route:</span>
                    <span className="text-muted-foreground">{pkg.ferry_route}</span>
                  </div>
                  {pkg.hotels && (
                    <div className="flex items-center gap-2 text-sm">
                      <Hotel className="h-4 w-4 text-primary" />
                      <span className="font-medium">Hotel:</span>
                      <span className="text-muted-foreground">
                        {pkg.hotels.name}, {pkg.hotels.location}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">Max Guests:</span>
                    <span className="text-muted-foreground">{pkg.max_guests} people</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Valid:</span>
                    <span className="text-muted-foreground">
                      {new Date(pkg.valid_from).toLocaleDateString()} - {new Date(pkg.valid_until).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Included Amenities */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {pkg.included_amenities?.map((amenity, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Savings Highlight */}
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    💰 You save €{calculateSavings(pkg.base_price, pkg.final_price)} with this package!
                  </p>
                </div>

                {/* CTA */}
                <Button asChild className="w-full" size="lg">
                  <Link to={`/packages/${pkg.id}/book`} className="flex items-center justify-center gap-2">
                    Book This Package
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  ✓ Free cancellation up to 48h before departure
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Book Packages Section */}
        <Card className="bg-secondary/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Why Book a Package?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">💸 Better Value</h4>
                <p className="text-sm text-muted-foreground">
                  Save 15-25% compared to booking ferry and hotel separately
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⏱️ Save Time</h4>
                <p className="text-sm text-muted-foreground">
                  One simple booking process for your entire trip
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎁 Extra Perks</h4>
                <p className="text-sm text-muted-foreground">
                  Exclusive amenities and upgrades not available separately
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Package FAQs</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group bg-card p-6 rounded-lg shadow-sm">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                Can I customize my package?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Yes! Contact us after booking and we can adjust dates, add extra nights, or upgrade your ferry class.
              </p>
            </details>
            
            <details className="group bg-card p-6 rounded-lg shadow-sm">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                What's the cancellation policy?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Free cancellation up to 48 hours before departure. After that, 50% refund up to 24 hours before.
              </p>
            </details>

            <details className="group bg-card p-6 rounded-lg shadow-sm">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                Are ferry times flexible?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Yes, choose your preferred departure time during checkout. We'll confirm availability within 2 hours.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
