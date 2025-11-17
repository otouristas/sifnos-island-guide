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
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Search',
    description: 'Smart recommendations tailored to your preferences and travel style',
    stat: '95%',
    statLabel: 'Accuracy',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Reviews',
    description: 'Authentic feedback from real travelers who stayed at our partner hotels',
    stat: '5,000+',
    statLabel: 'Reviews',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Expert local assistance whenever you need help planning your trip',
    stat: '< 2h',
    statLabel: 'Response Time',
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
    <div ref={ref}>
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-4">
            Why Book With Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for the perfect Sifnos stay
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-sifnos-beige hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sifnos-beige/20 text-sifnos-deep-blue">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-heading font-bold text-sifnos-deep-blue mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {feature.description}
                </p>

                {/* Stat */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-sifnos-deep-blue">{feature.stat}</span>
                  <span className="text-xs text-gray-500 uppercase">{feature.statLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges / Social Proof */}
        <div className="bg-sifnos-deep-blue rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-heading font-bold mb-2">
              Trusted by Thousands of Travelers
            </h3>
            <p className="text-sifnos-beige/80">
              Join our community of happy guests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="text-center">
                <div className="text-3xl font-heading font-bold text-sifnos-beige mb-1">
                  <AnimatedCounter value={badge.value} suffix={badge.suffix} />
                </div>
                <p className="text-sm text-white/70">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
