
import React, { useState } from 'react';

interface HotelLogoProps {
  hotel: any;
  hotelLogoUrl: string | null;
  position: 'corner' | 'inline';
}

const HotelLogo = ({ hotel, hotelLogoUrl, position }: HotelLogoProps) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  if (!hotelLogoUrl || hasError) return null;

  const handleLogoLoad = () => {
    setLogoLoaded(true);
    if (position === 'corner') {
      console.log(`Logo loaded successfully for ${hotel.name}: ${hotelLogoUrl}`);
    }
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // For debugging purposes, log the specific URL that failed
    console.error(`Failed to load ${position} logo for ${hotel.name}`);
    setHasError(true);
  };

  if (position === 'corner') {
    return (
      <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-md shadow-sm">
        <img 
          key={`hotel-logo-${hotel.id}-${position}-${hotelLogoUrl}`}
          src={hotelLogoUrl}
          alt={`${hotel.name} logo`} 
          className="h-8 w-auto max-w-[80px] object-contain"
          onLoad={handleLogoLoad}
          onError={handleLogoError}
        />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-7 h-7 bg-white rounded-full p-0.5 shadow-sm border border-gray-100 overflow-hidden">
      <img 
        key={`hotel-logo-${hotel.id}-${position}-${hotelLogoUrl}`}
        src={hotelLogoUrl}
        alt={`${hotel.name} logo`}
        className="w-full h-full object-contain"
        onLoad={handleLogoLoad}
        onError={handleLogoError}
      />
    </div>
  );
};

export default HotelLogo;
