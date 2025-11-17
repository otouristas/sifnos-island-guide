import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HotelOwnerPortalPage() {
  const features = [
    {
      icon: Building2,
      title: 'Property Management',
      description: 'Complete control over your hotel listings, rooms, and availability calendar'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Analytics',
      description: 'Real-time insights into bookings, revenue, and performance metrics'
    },
    {
      icon: Users,
      title: 'Guest Management',
      description: 'Digital check-in, guest requests, and personalized guest experiences'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Built-in messaging system to communicate with potential and current guests'
    },
    {
      icon: BarChart3,
      title: 'Performance Reports',
      description: 'Detailed reports on occupancy rates, revenue trends, and market insights'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-level security for your data and payment processing'
    }
  ];

  const benefits = [
    'Zero commission on direct bookings',
    'Featured placement on high-traffic pages',
    'Professional photography support',
    'Multi-language support',
    'Mobile-optimized guest portal',
    '24/7 technical support'
  ];

  return (
    <>
      <SEO
        title="Hotel Owner Portal - Manage Your Property"
        description="Access the complete hotel management platform. Manage bookings, communicate with guests, and grow your business on HotelsSifnos.com"
        schemaType="WebPage"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Hotel Owner Portal
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Everything you need to manage your property and delight your guests, all in one powerful platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/hotel-owner/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">
              Powerful Features for Modern Hoteliers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">
                Why Choose HotelsSifnos.com?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-2xl p-12">
              <h2 className="font-heading text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join the leading hotel platform in Sifnos and start growing your business today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/hotel-owner/signup">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/owner-support">Contact Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
