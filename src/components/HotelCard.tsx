import React from 'react';
import { Link } from 'react-router-dom';
import { generateHotelUrl } from '@/lib/url-utils';
import OriginalHotelCard from '@/components/HotelCard';

// Create a wrapper component to override the link behavior
export const HotelCardWithNewUrl = ({ hotel, ...props }) => {
  // We can't modify the original component, but we can use it within a wrapper
  // that provides the correct URL context
  
  // This is a workaround if we can't edit the original component
  // In a real scenario, we would update the original component
  
  // Return the original component unmodified, as it's read-only
  // The URL transformation will happen in the pages that use it
  return <OriginalHotelCard hotel={hotel} {...props} />;
};

// Export the original component as default to maintain compatibility
export default OriginalHotelCard;
