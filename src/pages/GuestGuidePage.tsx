import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Smartphone, Map, MessageSquare, Calendar, Star, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GuestGuidePage() {
  const features = [
    {
      icon: Smartphone,
      title: 'Digital Guest Portal',
      description: 'Access your personalized guest portal with hotel info, WiFi details, and check-in/out times'
    },
    {
      icon: Map,
      title: 'Interactive Area Guide',
      description: 'Discover beaches, restaurants, and attractions near your hotel with distances and directions'
    },
    {
      icon: MessageSquare,
      title: 'Easy Requests',
      description: 'Submit requests for housekeeping, maintenance, or special services directly through the portal'
    },
    {
      icon: Calendar,
      title: 'Digital Check-in',
      description: 'Complete check-in formalities online before arrival for a smooth experience'
    },
    {
      icon: Utensils,
      title: 'Local Recommendations',
      description: 'Get curated recommendations for dining, activities, and hidden gems from locals'
    },
    {
      icon: Star,
      title: 'Share Your Experience',
      description: 'Leave reviews and ratings to help future travelers and improve hotel services'
    }
  ];

  return (
    <>
      <SEO
        title="Guest Guide - Everything You Need for Your Stay"
        description="Learn how to make the most of your stay in Sifnos. Access your digital guest portal, discover local attractions, and get personalized recommendations."
        schemaType="WebPage"
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Guest Guide
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Everything you need to make your stay in Sifnos unforgettable
              </p>
              <Button asChild size="lg">
                <Link to="/how-it-works">Learn How to Book</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">
              What You Get as a Guest
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Access */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">
                How to Access Your Guest Portal
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold mb-2">Book Your Stay</h3>
                    <p className="text-muted-foreground">
                      Complete your booking on HotelsSifnos.com and receive instant confirmation
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold mb-2">Check Your Email</h3>
                    <p className="text-muted-foreground">
                      Look for an email with your unique guest portal link - it arrives within minutes
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold mb-2">Click & Explore</h3>
                    <p className="text-muted-foreground">
                      Click the link to access your personalized guest portal with all the information you need
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">
                Tips for a Great Stay
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Before Arrival</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Review ferry schedules and book tickets in advance</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Complete digital check-in to save time</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Check hotel's specific policies and amenities</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>During Your Stay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Use the guest portal for recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Submit requests through the app for quick response</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Explore nearby beaches and villages</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-3xl font-bold mb-4">
                Ready to Experience Sifnos?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Browse our collection of hotels and start planning your perfect getaway
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/hotels">Browse Hotels</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/guest-support">Get Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
