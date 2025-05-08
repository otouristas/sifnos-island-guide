
import { useState } from 'react';
import { MapPin, X, Hotel } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getHotelImageUrl } from '@/utils/hotel-utils';
import { HotelType } from './utils/chat-utils';

// Separator component
export const Separator = () => (
  <div className="flex items-center my-4">
    <div className="h-px bg-gray-200 flex-grow"></div>
    <div className="mx-2 text-xs text-gray-400 font-medium">Touristas AI</div>
    <div className="h-px bg-gray-200 flex-grow"></div>
  </div>
);

// Hotel Content Component (used in both Dialog and Drawer)
export const HotelContent = ({ hotel }: { hotel: HotelType }) => {
  return (
    <div className="space-y-4">
      <div className="w-full h-60 overflow-hidden rounded-lg">
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
      
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
          <MapPin className="h-4 w-4 text-sifnos-deep-blue" />
          <span className="text-sm font-medium text-sifnos-deep-blue">{hotel.location}</span>
        </div>
      </div>
      
      {/* Amenities */}
      {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
        <div>
          <h4 className="font-medium mb-2 text-gray-700">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.hotel_amenities.map((amenity: any, i: number) => (
              <Badge key={i} variant="outline" className="bg-gray-50">
                {amenity.amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Description */}
      {hotel.description && (
        <div>
          <h4 className="font-medium mb-2 text-gray-700">About</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{hotel.description}</p>
        </div>
      )}
    </div>
  );
};

// Hotel Dialog/Drawer Component
type HotelDialogProps = {
  hotel: HotelType;
  onClose: () => void;
};

export const HotelDialog = ({ hotel, onClose }: HotelDialogProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  if (isMobile) {
    return (
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b pb-3">
          <DrawerTitle className="flex justify-between">
            {hotel.name}
            <DrawerClose onClick={onClose}>
              <X className="h-4 w-4" />
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-4 overflow-y-auto">
          <HotelContent hotel={hotel} />
        </div>
      </DrawerContent>
    );
  }
  
  return (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{hotel.name}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {hotel.short_description || `A beautiful stay in ${hotel.location}, Sifnos`}
        </DialogDescription>
      </DialogHeader>
      <HotelContent hotel={hotel} />
    </DialogContent>
  );
};

// Hotel Card Component
export const HotelCard = ({ hotel }: { hotel: HotelType }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 mx-1">
      <div className="relative w-full h-40 overflow-hidden bg-gray-100">
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
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-xs">
              {hotel.location}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-base truncate">{hotel.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">{hotel.hotel_types?.join(', ')}</span>
        </div>
      </div>
      
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <Button className="w-full rounded-none bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90" onClick={() => setIsOpen(true)}>
            View Details
          </Button>
          {isOpen && <HotelDialog hotel={hotel} onClose={() => setIsOpen(false)} />}
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button className="w-full rounded-none bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90" onClick={() => setIsOpen(true)}>
            View Details
          </Button>
          {isOpen && <HotelDialog hotel={hotel} onClose={() => setIsOpen(false)} />}
        </Dialog>
      )}
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
          <CarouselItem key={hotel.id} className="md:basis-1/2 lg:basis-1/3">
            <HotelCard hotel={hotel} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
      <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
    </Carousel>
  );
};
