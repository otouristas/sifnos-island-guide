import SEO from '@/components/SEO';
import { Search, Calendar, CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: 'Search & Discover',
      description: 'Browse our curated selection of hotels in Sifnos. Filter by location, type, amenities, and price range to find your perfect match.'
    },
    {
      icon: Calendar,
      title: 'Check Availability',
      description: 'Select your dates and see real-time availability. View detailed room information, photos, and amenities before booking.'
    },
    {
      icon: CreditCard,
      title: 'Book Securely',
      description: 'Complete your reservation with our secure payment system. Receive instant confirmation via email with all booking details.'
    },
    {
      icon: MapPin,
      title: 'Arrive & Enjoy',
      description: 'Check in at your hotel and access your digital guest guide. Get personalized recommendations and make special requests anytime.'
    },
    {
      icon: CheckCircle,
      title: 'Share Your Experience',
      description: 'After your stay, share your feedback to help future travelers. Your review helps hotels improve their service.'
    }
  ];

  const features = [
    'Instant booking confirmation',
    'Best price guarantee',
    'Free cancellation on most bookings',
    'Secure payment processing',
    '24/7 customer support',
    'Digital guest portal access'
  ];

  return (
    <>
      <SEO
        title="How It Works - Booking Your Perfect Stay in Sifnos"
        description="Learn how easy it is to find and book your ideal accommodation in Sifnos. Simple steps from search to check-in."
        schemaType="WebPage"
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                How It Works
              </h1>
              <p className="text-xl text-muted-foreground">
                Booking your perfect stay in Sifnos is simple and straightforward
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 mb-12 last:mb-0">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-heading text-2xl font-bold text-primary">
                        {index + 1}
                      </span>
                      <h3 className="font-heading text-2xl font-bold">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">
                Why Book With Us?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-2xl p-12">
              <h2 className="font-heading text-3xl font-bold mb-4">
                Ready to Find Your Perfect Stay?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start exploring our collection of hotels in Sifnos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/hotels">Browse Hotels</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/guest-support">Get Help</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
