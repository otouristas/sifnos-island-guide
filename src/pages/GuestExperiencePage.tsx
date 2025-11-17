import SEO from '@/components/SEO';
import { useI18n } from '@/contexts/I18nContext';
import { Smartphone, Wifi, MapPin, MessageSquare, Calendar, Shield, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function GuestExperiencePage() {
  const { t } = useI18n();

  return (
    <>
      <SEO
        title="Guest Experience - Digital Guide & Services | Hotels Sifnos"
        description="Access your personalized digital guest guide with WiFi details, local recommendations, hotel services, and instant communication. Everything you need for the perfect Sifnos stay."
        keywords={['guest guide', 'digital concierge', 'hotel services', 'sifnos guest experience']}
        schemaType="WebPage"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('/uploads/sifnos-hero.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Smartphone className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Your Digital Guest Guide
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Everything you need for the perfect stay, right at your fingertips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/hotels">Browse Hotels</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/pricing">List Your Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              What's Included
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access personalized information and services through a simple magic link
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">WiFi & Essentials</h3>
              <p className="text-muted-foreground">
                Instant access to WiFi credentials, check-in/out times, and important hotel information
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Local Explorer</h3>
              <p className="text-muted-foreground">
                Discover nearby restaurants, beaches, attractions, and hidden gems with interactive maps
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Instant Requests</h3>
              <p className="text-muted-foreground">
                Request housekeeping, maintenance, or late checkout directly through the app
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Booking Details</h3>
              <p className="text-muted-foreground">
                View your reservation, download invoices, and manage check-in preferences
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your information is protected with secure magic links and encrypted data
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">24/7 Access</h3>
              <p className="text-muted-foreground">
                Available anytime on any device - no app download required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, seamless, and secure access to your personalized guest portal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Receive Your Link</h3>
              <p className="text-muted-foreground">
                Get a secure magic link via email before your arrival
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Access Your Guide</h3>
              <p className="text-muted-foreground">
                Click the link to open your personalized guest portal
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Enjoy Your Stay</h3>
              <p className="text-muted-foreground">
                Everything you need is now at your fingertips
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Hotel Owners CTA */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="h-16 w-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Enhance Your Guest Experience
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Provide your guests with a modern, digital experience that increases satisfaction and reduces operational costs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/pricing">Learn More</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
