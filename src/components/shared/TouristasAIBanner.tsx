import { Link } from 'react-router-dom';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TouristasAIBannerProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export default function TouristasAIBanner({ variant = 'inline', className = '' }: TouristasAIBannerProps) {
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 max-w-sm ${className}`}>
        <div className="bg-gradient-to-br from-primary to-primary-accent rounded-2xl shadow-2xl p-5 text-primary-foreground border-2 border-secondary/20 animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <img src="/uploads/touristas-ai-logo.svg" alt="AI" className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                Meet Touristas AI
                <Sparkles className="h-4 w-4" />
              </h3>
              <p className="text-sm text-primary-foreground/90">
                Your personal Sifnos travel assistant
              </p>
            </div>
          </div>
          
          <p className="text-sm mb-4 text-primary-foreground/80">
            Get instant hotel recommendations, ferry schedules & local tips tailored just for you!
          </p>
          
          <Button 
            asChild
            variant="secondary"
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Link to="/touristas-ai" className="flex items-center justify-center gap-2">
              Try Touristas AI Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-primary via-primary to-primary-accent rounded-2xl shadow-xl overflow-hidden ${className}`}>
      <div className="relative px-6 py-8 md:px-8 md:py-10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <img src="/uploads/touristas-ai-logo.svg" alt="Touristas AI" className="h-12 w-12" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2 flex items-center justify-center md:justify-start gap-2">
                Discover Sifnos with Touristas AI
                <Sparkles className="h-6 w-6 animate-pulse" />
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-4">
                Personalized hotel recommendations, real-time ferry schedules & insider travel tips — all powered by AI
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1">✨ Smart hotel matching</span>
                <span className="flex items-center gap-1">🚢 Live ferry updates</span>
                <span className="flex items-center gap-1">🗺️ Local recommendations</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                asChild
                size="lg"
                variant="secondary"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <Link to="/touristas-ai" className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Chat with AI Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
