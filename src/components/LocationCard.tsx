import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import OptimizedImage from './shared/OptimizedImage';

interface LocationCardProps {
  name: string;
  description: string;
  imageUrl: string;
  hotelsCount?: number;
  slug: string;
  className?: string;
}

export default function LocationCard({ 
  name, 
  description, 
  imageUrl, 
  hotelsCount = 0, 
  slug,
  className 
}: LocationCardProps) {
  return (
    <Link 
      to={`/locations/${slug}`} 
      className={cn(
        "group block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="relative h-48">
        <OptimizedImage
          src={imageUrl} 
          alt={`${name}, Sifnos`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white font-bold text-xl mb-1">{name}</h3>
          <div className="flex items-center text-white text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{hotelsCount} hotels</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white">
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        <div className="mt-2 text-sifnos-turquoise font-medium text-sm flex justify-between items-center">
          <span>View hotels</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  );
}
