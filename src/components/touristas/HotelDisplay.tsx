
import { useState } from 'react';
import { MapPin, X, Hotel, ExternalLink } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getHotelImageUrl } from '@/utils/hotel-utils';
import { HotelType } from './utils/chat-utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateHotelUrl } from '@/lib/url-utils';
import { Link } from 'react-router-dom';

// Separator component
export const Separator = () => (
  <div className="flex items-center my-2 sm:my-4">
    <div className="h-px bg-gray-200 flex-grow"></div>
    <div className="mx-2 text-xs text-gray-400 font-medium">Touristas AI</div>
    <div className="h-px bg-gray-200 flex-grow"></div>
  </div>
);

// Hotel Content Component (used in both Dialog and Drawer)
export const HotelContent = ({ hotel }: { hotel: HotelType }) => {
  // Generate the URL for the hotel page
  const hotelSlug = generateHotelUrl(hotel.name);
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="w-full h-40 sm:h-60 overflow-hidden rounded-lg">
        <img 
          src={getHotelImageUrl(hotel)}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`Failed to load image for ${hotel.name}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sifnos-deep-blue" />
          <span className="text-xs sm:text-sm font-medium text-sifnos-deep-blue">{hotel.location}</span>
        </div>
      </div>
      
      {/* Amenities */}
      {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
        <div>
          <h4 className="font-medium mb-2 text-gray-700 text-sm sm:text-base">Amenities</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {hotel.hotel_amenities.map((amenity: any, i: number) => (
              <Badge key={i} variant="outline" className="bg-gray-50 text-xs sm:text-sm">
                {amenity.amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Description */}
      {hotel.description && (
        <div>
          <h4 className="font-medium mb-1.5 sm:mb-2 text-gray-700 text-sm sm:text-base">About</h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{hotel.description}</p>
        </div>
      )}
      
      {/* See More Link to Hotel Page */}
      <div className="pt-2">
        <Link 
          to={`/hotels/${hotelSlug}`}
          className="inline-flex items-center text-sifnos-deep-blue hover:text-blue-700 text-sm font-medium"
        >
          See Full Hotel Details
          <ExternalLink className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </div>
  );
};

// Hotel Dialog/Drawer Component
type HotelDialogProps = {
  hotel: HotelType;
  onClose: () => void;
};

export const HotelDialog = ({ hotel, onClose }: HotelDialogProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b pb-2 sm:pb-3">
          <DrawerTitle className="flex justify-between items-center text-sm sm:text-base">
            {hotel.name}
            <DrawerClose onClick={onClose}>
              <X className="h-4 w-4" />
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto">
          <HotelContent hotel={hotel} />
        </div>
      </DrawerContent>
    );
  }
  
  return (
    <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{hotel.name}</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
          {hotel.short_description || `A beautiful stay in ${hotel.location}, Sifnos`}
        </DialogDescription>
      </DialogHeader>
      <HotelContent hotel={hotel} />
    </DialogContent>
  );
};

// Hotel Card Component
export const HotelCard = ({ hotel }: { hotel: HotelType }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate the URL for the hotel page
  const hotelSlug = generateHotelUrl(hotel.name);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 mx-0.5 sm:mx-1">
      <div className="relative w-full h-28 sm:h-40 overflow-hidden bg-gray-100">
        <img 
          src={getHotelImageUrl(hotel)}
          alt={hotel.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.error(`Failed to load image for ${hotel.name}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
          loading="eager"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-3">
          <div className="flex items-center">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-xs">
              {hotel.location}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-xs sm:text-base truncate">{hotel.name}</h3>
        <div className="mt-0.5 sm:mt-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">{hotel.hotel_types?.join(', ')}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-1 px-2 pb-2">
        {isMobile ? (
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <Button 
              className="w-full rounded-sm bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 text-xs sm:text-sm py-1" 
              onClick={() => setIsOpen(true)}
            >
              View Details
            </Button>
            {isOpen && <HotelDialog hotel={hotel} onClose={() => setIsOpen(false)} />}
          </Drawer>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button 
              className="w-full rounded-sm bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 text-xs sm:text-sm py-1" 
              onClick={() => setIsOpen(true)}
            >
              View Details
            </Button>
            {isOpen && <HotelDialog hotel={hotel} onClose={() => setIsOpen(false)} />}
          </Dialog>
        )}
        
        {/* See More Link to Hotel Page */}
        <Link to={`/hotels/${hotelSlug}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full rounded-sm border-gray-300 text-xs sm:text-sm py-1 mt-1 sm:mt-0"
          >
            See More
            <ExternalLink className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Similar Hotels Grid Component
export const SimilarHotelsGrid = ({ hotels, className = '' }: { hotels: HotelType[], className?: string }) => {
  if (!hotels?.length) return null;
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {hotels.map((hotel) => (
        <div key={hotel.id}>
          <HotelCard hotel={hotel} />
        </div>
      ))}
    </div>
  );
};

// Hotel Carousel Component
export const HotelCarousel = ({ hotels }: { hotels: HotelType[] }) => {
  if (!hotels?.length) return null;
  
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {hotels.map((hotel) => (
          <CarouselItem key={hotel.id} className="basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3">
            <HotelCard hotel={hotel} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1 sm:left-2 bg-white/80 hover:bg-white h-6 w-6 sm:h-8 sm:w-8" />
      <CarouselNext className="right-1 sm:right-2 bg-white/80 hover:bg-white h-6 w-6 sm:h-8 sm:w-8" />
    </Carousel>
  );
};

// Export SidebarHotelCard for use in other components
export { SidebarHotelCard } from './SidebarHotelCard';
