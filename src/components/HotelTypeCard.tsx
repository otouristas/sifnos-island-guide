
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getHotelTypeIcon } from './icons/HotelTypeIcons';

interface HotelTypeCardProps {
  title: string;
  description: string;
  imageUrl?: string; // Made optional
  slug: string;
  className?: string;
}

export default function HotelTypeCard({ 
  title, 
  description, 
  slug,
  className 
}: HotelTypeCardProps) {
  return (
    <Link 
      to={`/hotel-types/${slug}`} 
      className={cn(
        "group block rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="relative">
        <div className="w-full h-40 bg-sifnos-turquoise/10 flex items-center justify-center p-6 group-hover:bg-sifnos-turquoise/20 transition-colors duration-500">
          <div className="w-24 h-24 text-sifnos-turquoise group-hover:scale-110 transition-transform duration-500">
            {getHotelTypeIcon(slug)}
          </div>
        </div>
        <h3 className="absolute bottom-0 left-0 right-0 text-sifnos-deep-blue text-center font-bold text-xl p-4 bg-white/80 backdrop-blur-sm">
          {title}
        </h3>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        <div className="mt-3 text-sifnos-turquoise font-medium text-sm flex justify-between items-center">
          <span>Explore {title}</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  );
}
