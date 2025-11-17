import React from 'react';
import OptimizedImage from '@/components/shared/OptimizedImage';

interface HotelImageProps {
  hotel: any;
  imageSrc: string;
  primaryType: string | null;
  getHotelTypeIcon: (type: string) => React.ReactNode;
}

const HotelImage = ({ hotel, imageSrc, primaryType, getHotelTypeIcon }: HotelImageProps) => {
  return (
    <div className="relative h-48 overflow-hidden">
      <OptimizedImage
        src={imageSrc} 
        alt={hotel.name} 
        className="w-full h-full object-cover"
        priority={false}
      />
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
