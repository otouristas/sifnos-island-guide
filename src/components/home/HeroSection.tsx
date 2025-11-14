import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Star, Shield, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: 'url(/uploads/homepage-hero.jpg)',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/40 to-primary-accent/50" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm animate-fade-in">
          <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse" />
          🏝️ 25+ Handpicked Hotels in Sifnos
        </div>
        
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight">
          Find Your Perfect Stay in Paradise
        </h1>
        
        <p className="font-body text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
          Discover handpicked hotels, villas & resorts powered by AI-driven recommendations
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animation-delay-400">
          <Button
            onClick={() => navigate('/touristas-ai')}
            size="lg"
            variant="premium"
            className="text-lg px-8 py-6 h-auto shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            <Bot className="mr-2 h-5 w-5" />
            Try Touristas AI
          </Button>
          
          <Button
            onClick={() => navigate('/hotels')}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 h-auto border-2 border-white/80 text-white hover:bg-white hover:text-primary transition-all duration-300"
          >
            Browse Hotels
          </Button>
        </div>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap gap-6 justify-center items-center text-white/90 animate-fade-in-up animation-delay-600">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent fill-accent" />
            <span className="font-body text-sm">500+ Reviews</span>
          </div>
          
          <div className="hidden sm:block w-px h-6 bg-white/30" />
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="font-body text-sm">Best Price Guarantee</span>
          </div>
          
          <div className="hidden sm:block w-px h-6 bg-white/30" />
          
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            <span className="font-body text-sm">Secure Booking</span>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
