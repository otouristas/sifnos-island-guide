import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Crown, Sparkles, Gem, Landmark, Phone, Car, Target } from 'lucide-react';

import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import HotelCard from '@/components/HotelCard';

export default function LuxuryHotelsSifnosPage() {
  const [luxuryHotels, setLuxuryHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLuxuryHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `)
          .or('hotel_types.cs.{"Villa"},hotel_types.cs.{"Luxury Hotels"},rating.gte.4.5')
          .order('rating', { ascending: false });
          
        if (error) throw error;
        setLuxuryHotels(data || []);
      } catch (error) {
        console.error('Error fetching luxury hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLuxuryHotels();
  }, []);

  const luxuryFeatures = [
    {
      icon: <Crown className="text-yellow-500" size={24} />,
      title: "Premium Locations",
      description: "Exclusive beachfront and clifftop positions with panoramic Aegean views"
    },
    {
      icon: <Sparkles className="text-purple-500" size={24} />,
      title: "Exceptional Service",
      description: "Personalized concierge, private transfers, and 24/7 guest assistance"
    },
    {
      icon: <Star className="text-blue-500" size={24} />,
      title: "Luxury Amenities",
      description: "Infinity pools, spa services, private terraces, and gourmet dining"
    }
  ];

  return (
    <>
      <SEO 
        title="Luxury Hotels Sifnos 2026 - Premium Villas & Boutique Resorts | Hotels Sifnos"
        description="Discover Sifnos' finest luxury hotels and villas for the 2026 season. From exclusive beachfront resorts to private clifftop retreats, experience unparalleled comfort and authentic Cycladic elegance with premium amenities."
        keywords={[
          'luxury hotels sifnos', 'sifnos luxury villas', 'boutique hotels sifnos',
          '5 star hotels sifnos', 'premium hotels sifnos greece', 'exclusive sifnos accommodation'
        ]}
        pageType="hotels"
        canonical="https://hotelssifnos.com/luxury-hotels-sifnos"
        imageUrl="/uploads/luxury-hotels.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 text-sifnos-deep-blue">
            <Crown className="h-9 w-9" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Luxury Hotels in Sifnos 2026
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the pinnacle of Cycladic hospitality in Sifnos' most exclusive hotels and villas. 
            From private infinity pools to personalized concierge service, discover accommodations that redefine luxury.
          </p>
        </div>

        {/* Luxury Features */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Gem className="h-6 w-6" />
            <h2 className="text-3xl font-bold">What Makes Sifnos Luxury Hotels Special</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {luxuryFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Premium Hotels Showcase */}
        <section className="mb-16 bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Crown className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Featured Luxury Properties</h2>
          </div>
          
          {/* Highlighted Properties */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img 
                  src="/uploads/hotels/villa-olivia-clara/feature-image.jpeg" 
                  alt="Villa Olivia Clara"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium Villa
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-sifnos-deep-blue mb-2">Villa Olivia Clara</h3>
                <div className="flex items-center mb-3">
                  <MapPin size={16} className="mr-1 text-gray-500" />
                  <span className="text-gray-600">Platis Gialos</span>
                  <div className="flex items-center ml-auto">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Exclusive clifftop villa with panoramic sea views, private infinity pool, 
                  and direct access to Platis Gialos beach.
                </p>
                <Link 
                  to="/hotels/villa-olivia-clara"
                  className="inline-block px-6 py-2 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors"
                >
                  View Villa Details
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img 
                  src="/uploads/hotels/alk-hotel-sifnos/alk-hotel-feature.jpeg" 
                  alt="ALK Hotel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Boutique Hotel
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-sifnos-deep-blue mb-2">ALK HOTEL</h3>
                <div className="flex items-center mb-3">
                  <MapPin size={16} className="mr-1 text-gray-500" />
                  <span className="text-gray-600">Kamares</span>
                  <div className="flex items-center ml-auto">
                    {Array(4).fill(0).map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                    <Star className="text-gray-300" size={16} />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Contemporary boutique hotel in the heart of Kamares with elegant design, 
                  premium amenities, and personalized service.
                </p>
                <Link 
                  to="/hotels/alk-hotel"
                  className="inline-block px-6 py-2 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors"
                >
                  View Hotel Details
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* All Luxury Hotels */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Landmark className="h-6 w-6" />
            <h2 className="text-3xl font-bold">All Luxury Hotels & Villas in Sifnos</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
            </div>
          ) : luxuryHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {luxuryHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No luxury hotels found. Please try again later.</p>
            </div>
          )}
        </section>

        {/* Luxury Experience Guide */}
        <section className="mb-16 bg-gray-50 p-8 rounded-xl">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Gem className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Your Luxury Sifnos Experience</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Exclusive Amenities</h3>
                <p className="text-gray-600">
                  Private pools, personal chefs, helicopter transfers, yacht charters, 
                  and bespoke island experiences tailored to your preferences.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
                <p className="text-gray-600">
                  Clifftop villas with panoramic views, beachfront properties with private access, 
                  and historic locations in charming village centers.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Gourmet Dining</h3>
                <p className="text-gray-600">
                  Michelin-recommended restaurants, private chef services, wine tastings, 
                  and farm-to-table experiences featuring local Sifnian cuisine.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Wellness & Spa</h3>
                <p className="text-gray-600">
                  In-villa spa treatments, yoga sessions, fitness facilities, 
                  and wellness retreats in serene island settings.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Cultural Experiences</h3>
                <p className="text-gray-600">
                  Private archaeological tours, pottery workshops, monastery visits, 
                  and exclusive access to local artisan studios.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Adventure Activities</h3>
                <p className="text-gray-600">
                  Private sailing excursions, diving trips, hiking guides, 
                  and helicopter tours of the Cyclades islands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Benefits */}
        <section className="mb-16 bg-gradient-to-r from-sifnos-turquoise to-blue-500 text-white p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Exclusive Benefits When You Book With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Rate Guarantee</h3>
              <p>We match any lower rate found elsewhere</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">VIP Welcome</h3>
              <p>Complimentary champagne and local treats</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Car className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Transfers</h3>
              <p>Airport and port pickup included</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Phone className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Concierge</h3>
              <p>Personal assistance throughout your stay</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-sifnos-deep-blue text-white p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Experience Luxury Like Never Before</h2>
          <p className="text-xl mb-6">
            Book your exclusive Sifnos luxury accommodation and create unforgettable memories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/hotels"
              className="px-8 py-3 bg-white text-sifnos-deep-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Browse All Luxury Hotels
            </Link>
            <Link 
              to="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-sifnos-deep-blue transition-colors font-medium"
            >
              Contact Our Concierge
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}