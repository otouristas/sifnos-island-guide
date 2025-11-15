import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Award, Sparkles, HeadphonesIcon, TrendingUp, Users } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Best Price Guarantee',
    description: 'Compare prices across multiple platforms and get the best deals available',
    stat: '100%',
    statLabel: 'Price Match',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Search',
    description: 'Smart recommendations tailored to your preferences and travel style',
    stat: '95%',
    statLabel: 'Accuracy',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Reviews',
    description: 'Authentic feedback from real travelers who stayed at our partner hotels',
    stat: '5,000+',
    statLabel: 'Reviews',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Expert local assistance whenever you need help planning your trip',
    stat: '< 2h',
    statLabel: 'Response Time',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
];

const trustBadges = [
  { label: 'Hotels Listed', value: 25, suffix: '+' },
  { label: 'Happy Travelers', value: 5000, suffix: '+' },
  { label: 'Countries Reached', value: 50, suffix: '+' },
  { label: 'Years Experience', value: 10, suffix: '+' },
];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl font-heading font-bold text-foreground">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-accent-50 via-background to-accent-50 relative overflow-hidden">
      {/* Decorative background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">
            <TrendingUp className="h-3 w-3 mr-1" />
            Why Choose Us
          </Badge>
          <h2 className="text-4xl font-heading font-bold text-foreground mb-3">
            Your Trusted Sifnos Travel Partner
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than just a booking platform — we're your local experts dedicated to creating perfect stays
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`
                  group relative p-6 rounded-2xl border-2 border-border
                  ${feature.bgColor}
                  hover:shadow-elegant-lg hover:scale-105
                  transition-all duration-500
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`
                      w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color}
                      flex items-center justify-center
                      transform transition-all duration-500
                      group-hover:scale-110 group-hover:rotate-6
                      shadow-lg
                    `}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stat Badge */}
                  <div className="pt-3">
                    <div className="inline-flex flex-col items-center gap-1 px-4 py-2 bg-background/80 rounded-lg border border-border">
                      <span className="text-2xl font-bold text-foreground">{feature.stat}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {feature.statLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges / Social Proof */}
        <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-elegant">
          <div className="text-center mb-8">
            <Users className="h-8 w-8 mx-auto mb-3 text-accent" />
            <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
              Trusted by Thousands of Travelers
            </h3>
            <p className="text-muted-foreground">
              Join our community of happy guests who found their perfect Sifnos stay
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="text-center">
                <AnimatedCounter value={badge.value} suffix={badge.suffix} />
                <p className="text-sm text-muted-foreground mt-2">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
