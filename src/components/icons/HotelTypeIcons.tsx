
import { cn } from '@/lib/utils';

interface HotelTypeIconProps {
  className?: string;
}

// Luxury Hotels Icon
export const LuxuryHotelIcon = ({ className }: HotelTypeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
    >
      <path d="M2 12h20M2 12v8a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-8" />
      <path d="M5 12V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7" />
      <path d="M5 15h14" />
      <path d="M9 18v-3" />
      <path d="M15 18v-3" />
      <path d="M12 7v4" />
      <path d="M10 9h4" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
      <circle cx="4" cy="4" r="1" fill="currentColor" />
      <circle cx="20" cy="4" r="1" fill="currentColor" />
    </svg>
  );
};

// Boutique Hotels Icon
export const BoutiqueHotelIcon = ({ className }: HotelTypeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 9h1v3h-1z" />
      <path d="M14 9h1v3h-1z" />
      <path d="M9 17h6" />
      <path d="M9 21v-4" />
      <path d="M15 21v-4" />
      <path d="M11 13h2" />
      <path d="M12 9v4" />
    </svg>
  );
};

// Beach Hotels Icon
export const BeachHotelIcon = ({ className }: HotelTypeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
    >
      <path d="M17 17h4v4H3v-4h4" />
      <path d="M12 17a5 5 0 0 0-5-5c-2.76 0-5 2.24-5 5h10z" />
      <path d="M18 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
      <path d="M3 13c3.87 0 7-3.13 7-7 0 3.87 3.13 7 7 7-3.87 0-7 3.13-7 7 0-3.87-3.13-7-7-7z" />
    </svg>
  );
};

// Family-Friendly Hotels Icon
export const FamilyHotelIcon = ({ className }: HotelTypeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <circle cx="16" cy="11" r="2" />
      <path d="M17 17h2a2 2 0 0 1 2 2v1" />
      <circle cx="19" cy="5" r="2" />
      <path d="M21 9h-2" />
    </svg>
  );
};

// Traditional Hotels Icon
export const TraditionalHotelIcon = ({ className }: HotelTypeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
    >
      <rect x="3" y="11" width="18" height="10" rx="1" />
      <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
      <path d="M8 8v1" />
      <path d="M16 8v1" />
      <path d="M12 4v3" />
      <path d="M2 21h20" />
      <path d="M10 16h4" />
    </svg>
  );
};

// Function to get the appropriate icon based on the hotel type slug
export const getHotelTypeIcon = (slug: string) => {
  switch (slug) {
    case "luxury-hotels":
      return <LuxuryHotelIcon />;
    case "boutique-hotels":
      return <BoutiqueHotelIcon />;
    case "beach-hotels":
      return <BeachHotelIcon />;
    case "family-friendly-hotels":
      return <FamilyHotelIcon />;
    case "traditional-hotels":
      return <TraditionalHotelIcon />;
    default:
      return <LuxuryHotelIcon />;
  }
};
