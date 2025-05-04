
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HotelTypeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  className?: string;
}

export default function HotelTypeCard({ 
  title, 
  description, 
  imageUrl, 
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
        <img 
          src={imageUrl} 
          alt={`${title} in Sifnos`} 
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <h3 className="absolute bottom-0 left-0 right-0 text-white text-center font-bold text-xl p-4">
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
