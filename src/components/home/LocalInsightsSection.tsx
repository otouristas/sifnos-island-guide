import { Link } from 'react-router-dom';
import { Lightbulb, MapPin, Utensils, Camera, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const insights = [
  {
    icon: Utensils,
    title: 'Hidden Tavernas',
    description: 'Skip the tourist spots. Ask locals for the best family-run tavernas in Artemonas and Kastro.',
    link: '/travel-guide#dining',
    color: 'from-orange-500/10 to-red-500/10',
    iconColor: 'text-orange-600'
  },
  {
    icon: Camera,
    title: 'Secret Sunset Spots',
    description: 'Kastro offers the best sunset views, but arrive early—locals know the best spots fill up fast.',
    link: '/locations/kastro',
    color: 'from-purple-500/10 to-pink-500/10',
    iconColor: 'text-purple-600'
  },
  {
    icon: Heart,
    title: 'Local Pottery',
    description: 'Visit Vathi for authentic pottery workshops. Many artisans welcome visitors to watch them work.',
    link: '/travel-guide#pottery',
    color: 'from-red-500/10 to-orange-500/10',
    iconColor: 'text-red-600'
  },
  {
    icon: MapPin,
    title: 'Off-the-Beaten Path',
    description: 'Explore the 365 churches scattered across the island. Each has its own story and stunning views.',
    link: '/travel-guide#culture',
    color: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-600'
  }
];

export default function LocalInsightsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sifnos-beige/20 rounded-full mb-4">
            <Lightbulb className="h-5 w-5 text-sifnos-deep-blue" />
            <span className="text-sm font-semibold text-sifnos-deep-blue">Local Insights</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-4">
            Insider Tips from Sifnos Locals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover hidden gems and authentic experiences that only locals know about
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <Link key={index} to={insight.link}>
                <Card className="h-full border-2 border-gray-100 hover:border-sifnos-turquoise/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${insight.iconColor}`} />
                    </div>
                    <h3 className="font-heading font-bold text-sifnos-deep-blue mb-2 text-lg group-hover:text-sifnos-turquoise transition-colors">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/travel-guide"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-sifnos-deep-blue text-sifnos-deep-blue rounded-xl hover:bg-sifnos-deep-blue hover:text-white transition-all duration-300 font-semibold text-lg"
          >
            Read Complete Travel Guide
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

