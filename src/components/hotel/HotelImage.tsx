
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface HotelImageProps {
  hotel: any;
  imageUrl?: string; // Make imageUrl optional
  imageSrc?: string; // Keep the existing prop
  primaryType?: string | null;
  getHotelTypeIcon?: (type: string) => React.ReactNode;
}

const HotelImage = ({ 
  hotel, 
  imageSrc, 
  imageUrl, 
  primaryType, 
  getHotelTypeIcon 
}: HotelImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use imageUrl if provided, otherwise use imageSrc
  const actualImageSrc = imageUrl || imageSrc;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image for ${hotel.name}: ${e.currentTarget.src}`);
    setImageError(true);
    
    // Try to reload the image with a different cache-buster
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 1000);
    e.currentTarget.src = `/placeholder.svg?v=${timestamp}-${randomValue}`;
  };

  return (
    <div className="relative h-48 overflow-hidden">
      {!imageLoaded && !imageError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img 
        key={`hotel-image-${hotel.id}-${Date.now()}`}
        src={actualImageSrc} 
        alt={hotel.name} 
        className={`w-full h-full object-cover ${!imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager"
        fetchPriority="high"
      />
      {/* Display hotel type icon if available */}
      {primaryType && getHotelTypeIcon && (
        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-1 rounded-full">
          <div className="w-6 h-6 text-sifnos-turquoise">
            {getHotelTypeIcon(primaryType)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelImage;
