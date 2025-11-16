import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Zap, Clock, Shield, ArrowRight, Search, Map, Calendar } from "lucide-react";
import { useTouristas } from "@/contexts/TouristasContext";

const TouristasAIPage = () => {
  const { openChat } = useTouristas();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Touristas AI - Your Intelligent Sifnos Travel Assistant | Hotels Sifnos"
        description="Experience intelligent hotel search with Touristas AI. Get instant recommendations, smart filtering, and personalized travel planning for your perfect Sifnos stay."
        keywords={['touristas ai', 'ai travel assistant', 'smart hotel booking', 'ai travel planner sifnos', 'intelligent hotel search']}
        schemaType="WebPage"
        canonical="https://hotelssifnos.com/touristas-ai"
      />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary to-primary-accent">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Your Intelligent Travel Assistant
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Find your perfect Sifnos hotel with AI-powered recommendations and natural language search
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button onClick={openChat} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Planning
              </Button>
              <Button size="lg" variant="outline" className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20 px-8 py-6 text-lg" asChild>
                <Link to="/hotels">Browse Hotels<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
              <div className="text-center"><div className="text-3xl font-bold text-primary-foreground mb-1">24/7</div><div className="text-sm text-primary-foreground/70">Available</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-primary-foreground mb-1">&lt;30s</div><div className="text-sm text-primary-foreground/70">Response</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-primary-foreground mb-1">100+</div><div className="text-sm text-primary-foreground/70">Hotels</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-primary-foreground mb-1">Smart</div><div className="text-sm text-primary-foreground/70">Filtering</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Smart Hotel Search</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Natural language processing meets local hotel expertise</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl border-2 border-border hover:border-accent transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6"><Search className="h-7 w-7 text-primary" /></div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">Natural Search</h3>
                <p className="text-muted-foreground">Simply describe what you're looking for in plain language and get relevant results</p>
              </div>
              <div className="p-8 rounded-xl border-2 border-border hover:border-accent transition-all">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6"><Zap className="h-7 w-7 text-accent" /></div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">Instant Results</h3>
                <p className="text-muted-foreground">Get hotel recommendations within seconds with pricing and availability</p>
              </div>
              <div className="p-8 rounded-xl border-2 border-border hover:border-accent transition-all">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6"><Shield className="h-7 w-7 text-primary" /></div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">Smart Filtering</h3>
                <p className="text-muted-foreground">Automatically filters by price, location, amenities, and your preferences</p>
              </div>
              <div className="p-8 rounded-xl border-2 border-border hover:border-accent transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6"><Clock className="h-7 w-7 text-primary" /></div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">24/7 Available</h3>
                <p className="text-muted-foreground">Get help anytime with instant responses and recommendations</p>
              </div>
              <div className="p-8 rounded-xl border-2 border-border hover:border-accent transition-all">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6"><Map className="h-7 w-7 text-accent" /></div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">Local Knowledge</h3>
                <p className="text-muted-foreground">Recommendations based on deep understanding of Sifnos locations</p>
              </div>
              <div className="p-8 rounded-xl border-2 border-border hover:border-accent transition-all">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6"><Calendar className="h-7 w-7 text-primary" /></div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">Real-time Data</h3>
                <p className="text-muted-foreground">Up-to-date pricing, availability, and hotel information</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-accent text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">Ready to Find Your Perfect Hotel?</h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">Start chatting with Touristas AI and discover your ideal Sifnos accommodation</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button onClick={openChat} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg">
                <MessageSquare className="mr-2 h-5 w-5" />Try Touristas AI
              </Button>
              <Button size="lg" variant="outline" className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20 px-8 py-6 text-lg" asChild>
                <Link to="/hotels">Browse All Hotels<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TouristasAIPage;
