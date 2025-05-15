
import React, { useState } from 'react';

interface HotelLogoProps {
  hotel: any;
  hotelLogoUrl: string | null;
  position: 'corner' | 'inline';
}

const HotelLogo = ({ hotel, hotelLogoUrl, position }: HotelLogoProps) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  if (!hotelLogoUrl) return null;

  const handleLogoLoad = () => {
    setLogoLoaded(true);
    setLogoError(false);
    if (position === 'corner') {
      console.log(`Logo loaded successfully for ${hotel.name}: ${hotelLogoUrl}`);
    }
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load ${position} logo for ${hotel.name}: ${hotelLogoUrl}`);
    setLogoError(true);
    e.currentTarget.style.display = 'none';
  };

  if (position === 'corner') {
    return (
      <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-md shadow-sm">
        <img 
          key={`hotel-big-logo-${hotel.id}-${Date.now()}`}
          src={hotelLogoUrl}
          alt={`${hotel.name} logo`} 
          className={`h-8 w-auto max-w-[80px] object-contain ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLogoLoad}
          onError={handleLogoError}
          style={logoError ? { display: 'none' } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-7 h-7 bg-white rounded-full p-0.5 shadow-sm border border-gray-100 overflow-hidden">
      <img 
        key={`hotel-small-logo-${hotel.id}-${Date.now()}`}
        src={hotelLogoUrl}
        alt={`${hotel.name} logo`}
        className={`w-full h-full object-contain ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLogoLoad}
        onError={handleLogoError}
        style={logoError ? { display: 'none' } : undefined}
      />
    </div>
  );
};

export default HotelLogo;
