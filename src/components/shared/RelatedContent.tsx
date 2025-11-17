import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MapPin, Waves, BookOpenCheck, Ship, Hotel } from 'lucide-react';

interface RelatedContentItem {
  title: string;
  url: string;
  description?: string;
  icon?: any;
  type?: 'location' | 'guide' | 'hotel-type' | 'blog' | 'ferry';
}

interface RelatedContentProps {
  title?: string;
  items: RelatedContentItem[];
  columns?: 2 | 3 | 4;
}

export default function RelatedContent({ 
  title = "You Might Also Like", 
  items, 
  columns = 3 
}: RelatedContentProps) {
  if (items.length === 0) return null;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  const getIcon = (item: RelatedContentItem) => {
    if (item.icon) return item.icon;
    
    switch (item.type) {
      case 'location':
        return MapPin;
      case 'guide':
        return BookOpenCheck;
      case 'hotel-type':
        return Hotel;
      case 'ferry':
        return Ship;
      case 'blog':
        return BookOpenCheck;
      default:
        return ArrowRight;
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-sifnos-deep-blue mb-8 text-center">
          {title}
        </h2>
        
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
          {items.map((item, index) => {
            const Icon = getIcon(item);
            return (
              <Link key={index} to={item.url}>
                <Card className="h-full border-2 border-gray-100 hover:border-sifnos-turquoise/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-sifnos-turquoise/10 to-sifnos-deep-blue/10 flex items-center justify-center group-hover:bg-sifnos-turquoise/20 transition-colors">
                        <Icon className="h-6 w-6 text-sifnos-turquoise" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-lg text-sifnos-deep-blue mb-2 group-hover:text-sifnos-turquoise transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center text-sifnos-deep-blue font-medium text-sm group-hover:text-sifnos-turquoise transition-colors">
                          <span>Explore</span>
                          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

