import { Shield, Award, Clock, ThumbsUp, Users, Star } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export default function TrustBadges({ variant = 'default', className = '' }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      label: 'Secure Booking',
      description: '100% Safe & Encrypted'
    },
    {
      icon: Award,
      label: 'Best Price Guarantee',
      description: 'Lowest rates guaranteed'
    },
    {
      icon: Clock,
      label: '24/7 Support',
      description: 'Always here to help'
    },
    {
      icon: Star,
      label: '4.8/5 Rating',
      description: 'From 2,500+ reviews'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{badge.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{badge.label}</h3>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
