import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Zap, Clock, Shield, ArrowRight, Search, Map, Calendar } from "lucide-react";
import { useTouristas } from "@/contexts/TouristasContext";

const TouristasAIPage = () => {
  const { openChat, openChatWithPrompt } = useTouristas();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Touristas AI - Sifnos Travel Assistant 2026 | Hotels, Beaches & Itineraries"
        description="Plan your 2026 Sifnos trip with Touristas AI. Get instant hotel recommendations, compare locations like Kamares vs Platis Gialos, and generate custom 3–7 day itineraries with one simple chat."
        keywords={['touristas ai', 'ai travel assistant', 'sifnos trip planner 2026', 'smart hotel booking', 'ai travel planner sifnos', 'intelligent hotel search']}
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
            <div className="pt-8 space-y-3">
              <p className="text-sm md:text-base text-primary-foreground/80">Or start with a ready-made prompt:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
                  onClick={() => openChatWithPrompt('Plan a 3-day Sifnos itinerary in June 2026 for 2 adults who love beaches and good food.')}
                >
                  Plan 3-day trip
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
                  onClick={() => openChatWithPrompt('Find a family-friendly hotel in Sifnos for 2 adults and 2 kids near a calm beach, budget €180 per night.')}
                >
                  Find family hotel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
                  onClick={() => openChatWithPrompt('Compare staying in Kamares vs Platis Gialos for a 5-night Sifnos trip in August 2026.')}
                >
                  Compare Kamares vs Platis Gialos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
                  onClick={() => openChatWithPrompt('Recommend 3 luxury villas in Sifnos for 4 adults with private pool and sea view in September 2026.')}
                >
                  Suggest luxury villas
                </Button>
              </div>
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

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-background to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-foreground mb-4">How Touristas AI Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powered by advanced AI trained on comprehensive Sifnos data, real-time hotel information, and 2026 travel updates
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">Ask Naturally</h3>
                <p className="text-muted-foreground">Describe your ideal stay in plain language. No filters, no forms—just conversation.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">2</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">AI Analyzes</h3>
                <p className="text-muted-foreground">Our AI searches through 50+ hotels, compares locations, checks 2026 availability, and considers your preferences.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">Get Results</h3>
                <p className="text-muted-foreground">Receive personalized hotel recommendations with photos, prices, and direct booking links.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to plan your perfect Sifnos trip</p>
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

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              <details className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/30 transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-foreground text-lg list-none">
                  <h3>What makes Touristas AI different from other hotel search tools?</h3>
                  <span className="text-2xl text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Touristas AI is specifically trained on Sifnos island data, including all hotels, locations, beaches, restaurants, and 2026 travel information. It understands natural language queries and provides personalized recommendations based on your specific needs, not just generic filters.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/30 transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-foreground text-lg list-none">
                  <h3>Does Touristas AI have access to real-time hotel availability?</h3>
                  <span className="text-2xl text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Yes! Touristas AI integrates with real-time booking systems and can check availability for your specific dates. It also provides up-to-date pricing information for the 2026 season.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/30 transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-foreground text-lg list-none">
                  <h3>Can Touristas AI help me plan my entire Sifnos itinerary?</h3>
                  <span className="text-2xl text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Absolutely! Touristas AI can help you plan 3-7 day itineraries, suggest restaurants, recommend beaches, provide ferry information, and even create complete travel packages including hotels and transportation.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/30 transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-foreground text-lg list-none">
                  <h3>Is the information updated for 2026?</h3>
                  <span className="text-2xl text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Yes, all information is current for the 2026 season. Touristas AI has access to the latest hotel data, 2026 ferry schedules, seasonal information, and any new openings or updates on the island.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-accent text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">Ready to Find Your Perfect Hotel?</h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Start chatting with Touristas AI and discover your ideal Sifnos accommodation. Get personalized recommendations, compare locations, and plan your perfect 2026 Greek island escape.
            </p>
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
