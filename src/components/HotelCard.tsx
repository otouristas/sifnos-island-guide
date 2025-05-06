
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateHotelUrl } from '@/lib/url-utils';
import { getHotelTypeIcon } from './icons/HotelTypeIcons';
import { Skeleton } from '@/components/ui/skeleton';

// Define the HotelCard component that creates proper URLs
const HotelCard = ({ hotel, showLogo = false, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('/placeholder.svg');
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  // Create the URL-friendly slug for the hotel
  const hotelSlug = generateHotelUrl(hotel.name);
  
  // Find the main photo for the hotel
  const mainPhoto = hotel.hotel_photos?.find(photo => photo.is_main_photo)?.photo_url || '';
  
  // Debug log for identifying the hotel and its main photo
  console.log(`HotelCard: Hotel name: ${hotel.name}, mainPhoto: ${mainPhoto}`);
  
  useEffect(() => {
    // Generate cache-busting timestamp for all images
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 1000);
    
    // Construct image URL based on hotel name and available photos with strong cache busting
    let imageUrl = `/placeholder.svg?v=${timestamp}-${randomValue}`;
    
    // Special case for hotels with local images saved in specific directories
    if (hotel.name === "Meropi Rooms and Apartments") {
      imageUrl = `/uploads/hotels/meropirooms-hero.webp?v=${timestamp}-${randomValue}`;
    } else if (hotel.name === "Filadaki Villas") {
      // For Filadaki Villas, use one of the known images from the public directory
      imageUrl = `/uploads/hotels/filadaki-studios/home-page_9151.jpg.jpeg?v=${timestamp}-${randomValue}`;
      console.log(`Using Filadaki custom image path: ${imageUrl}`);
    } else if (hotel.name === "Morpheas Pension & Apartments") {
      // For Morpheas Pension, use its featured image with cache-busting
      imageUrl = `/uploads/hotels/morpheas-pension/sifnos-accommodation.jpg.jpeg?v=${timestamp}-${randomValue}`;
    } else if (hotel.name === "Villa Olivia Clara") {
      // For Villa Olivia Clara, use its featured image with cache-busting
      // Using the correct file path that exists in public/uploads/hotels/villa-olivia-clara/
      imageUrl = `/uploads/hotels/villa-olivia-clara/feature-image.jpeg?v=${timestamp}-${randomValue}`;
    } else if (mainPhoto) {
      // For other hotels, use the photos from the database with cache-busting
      imageUrl = `/uploads/hotels/${mainPhoto}?v=${timestamp}-${randomValue}`;
    }
    
    // Set the image source with cache busting
    setImageSrc(imageUrl);
    
    // Force reload the image by creating a new Image object
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      console.error(`Failed to load image for ${hotel.name}: ${imageUrl}`);
      setImageError(true);
      // If Villa Olivia Clara image fails, try with alternative path
      if (hotel.name === "Villa Olivia Clara") {
        const altPath = `/uploads/hotels/villa-olivia-clara/Villa-Olivia-Clara_001_pool-side-cabana-min-scaled.jpg.jpeg?v=${Date.now()}-${Math.random() * 1000}`;
        setImageSrc(altPath);
      }
    };
    img.src = imageUrl;
  }, [hotel.name, mainPhoto]);
  
  // Get the first hotel type for icon display (if any)
  const primaryType = hotel.hotel_types && hotel.hotel_types.length > 0 ? hotel.hotel_types[0] : null;
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = (e) => {
    console.error(`Failed to load image for ${hotel.name}: ${e.currentTarget.src}`);
    setImageError(true);
    
    // Try to reload the image with a different cache-buster
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 1000);
    e.currentTarget.src = `/placeholder.svg?v=${timestamp}-${randomValue}`;
  };

  const handleLogoLoad = () => {
    setLogoLoaded(true);
  };
  
  // Force reload the image after mount to bypass cache
  useEffect(() => {
    // Small delay to allow React to stabilize
    const timer = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(img.src);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setImageError(true);
      };
      img.src = imageSrc;
    }, 100);
    
    return () => clearTimeout(timer);
  }, [imageSrc]);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link to={`/hotels/${hotelSlug}`} className="block">
        {/* Hotel image with error handling and loading state */}
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img 
            key={`hotel-image-${hotel.id}-${Date.now()}`} // Force React to render a new image element
            src={imageSrc} 
            alt={hotel.name} 
            className={`w-full h-full object-cover ${!imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager" // Prioritize loading for better perceived performance
            fetchPriority="high" // Modern browsers will prioritize these images
          />
          {/* Display hotel type icon if available */}
          {primaryType && (
            <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-1 rounded-full">
              <div className="w-6 h-6 text-sifnos-turquoise">
                {getHotelTypeIcon(primaryType)}
              </div>
            </div>
          )}
          {showLogo && hotel.logo_url && (
            <div className="absolute bottom-2 right-2 bg-white p-1 rounded-md">
              <img 
                key={`hotel-logo-${hotel.id}-${Date.now()}`} // Force React to render a new image element
                src={`/uploads/hotels/${hotel.logo_url}?v=${Date.now()}-${Math.floor(Math.random() * 1000)}`} 
                alt={`${hotel.name} logo`} 
                className="h-8"
                onError={(e) => {
                  console.error(`Failed to load logo for ${hotel.name}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        {/* Hotel details */}
        <div className="p-4">
          <div className="flex items-center mb-1">
            {/* Display logo next to hotel name if showLogo is true */}
            {showLogo && hotel.logo_url && (
              <div className="mr-2 flex-shrink-0 w-6 h-6 overflow-hidden">
                <img 
                  src={`/uploads/hotels/${hotel.logo_url}?v=${Date.now()}-${Math.floor(Math.random() * 1000)}`} 
                  alt={`${hotel.name} logo`}
                  className="w-full h-full object-contain"
                  onLoad={handleLogoLoad}
                  onError={(e) => {
                    console.error(`Failed to load small logo for ${hotel.name}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
          
          {/* Hotel Types */}
          {hotel.hotel_types && hotel.hotel_types.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {hotel.hotel_types.map((type, index) => (
                <span key={index} className="text-xs bg-sifnos-turquoise/10 text-sifnos-deep-blue px-2 py-1 rounded-full">
                  {type.replace(/-/g, ' ').replace(/hotels/g, 'hotel')}
                </span>
              ))}
            </div>
          )}
          
          {/* Amenities */}
          {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hotel.hotel_amenities.slice(0, 3).map((amenity, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {amenity.amenity}
                </span>
              ))}
              {hotel.hotel_amenities.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{hotel.hotel_amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default HotelCard;
