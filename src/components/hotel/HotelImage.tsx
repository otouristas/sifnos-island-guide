
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface HotelImageProps {
  hotel: any;
  imageSrc: string;
  primaryType: string | null;
  getHotelTypeIcon: (type: string) => React.ReactNode;
}

const HotelImage = ({ hotel, imageSrc, primaryType, getHotelTypeIcon }: HotelImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageRef, setImageRef] = useState<HTMLDivElement | null>(null);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (!imageRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load images 200px before they enter viewport
        threshold: 0.1
      }
    );
    
    observer.observe(imageRef);
    
    return () => {
      if (imageRef) observer.disconnect();
    };
  }, [imageRef]);

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

  // Generate srcset for responsive images
  const generateSrcSet = (baseUrl: string): string => {
    const url = new URL(baseUrl, window.location.origin);
    const params = new URLSearchParams(url.search);
    
    // Add timestamp to prevent caching issues
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 1000);
    params.set('v', `${timestamp}-${randomValue}`);
    
    // Create srcset variations for different sizes
    return [
      `${url.pathname}?${params.toString()}&w=480 480w`,
      `${url.pathname}?${params.toString()}&w=800 800w`,
      `${url.pathname}?${params.toString()}&w=1200 1200w`,
      `${url.pathname}?${params.toString()}&w=1600 1600w`
    ].join(', ');
  };

  return (
    <div
      className="relative h-48 overflow-hidden bg-gray-100"
      ref={setImageRef}
    >
      {!imageLoaded && !imageError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {isVisible && (
        <img 
          src={imageSrc} 
          srcSet={generateSrcSet(imageSrc)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={hotel.name} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${!imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          width="800"
          height="600"
          decoding="async"
        />
      )}
      
      {/* Display hotel type icon if available */}
      {primaryType && (
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
