
import { Input } from "@/components/ui/input";
import { ValidationError } from "@formspree/react";
import { Globe, MapPin, ExternalLink } from "lucide-react";

interface OnlinePresenceSectionProps {
  state: any;
}

export const OnlinePresenceSection = ({ state }: OnlinePresenceSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Online Presence</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="website" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Globe className="h-4 w-4" /> Website URL
          </label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://your-hotel-website.com"
          />
          <ValidationError prefix="Website" field="website" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="googleMaps" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <MapPin className="h-4 w-4" /> Google Maps URL
          </label>
          <Input
            id="googleMaps"
            name="googleMaps"
            type="url"
            placeholder="https://maps.google.com/?q=your-hotel"
          />
          <ValidationError prefix="Google Maps" field="googleMaps" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="bookingUrl" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <ExternalLink className="h-4 w-4" /> Booking.com URL
          </label>
          <Input
            id="bookingUrl"
            name="bookingUrl"
            type="url"
            placeholder="https://www.booking.com/your-property"
          />
          <ValidationError prefix="Booking URL" field="bookingUrl" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="airbnbUrl" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <ExternalLink className="h-4 w-4" /> Airbnb URL
          </label>
          <Input
            id="airbnbUrl"
            name="airbnbUrl"
            type="url"
            placeholder="https://www.airbnb.com/your-property"
          />
          <ValidationError prefix="Airbnb URL" field="airbnbUrl" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
      </div>
    </div>
  );
};
