import { useState, useEffect, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import UserMenu from './auth/UserMenu'; // Import the UserMenu component

const mainNavItems = [
  { 
    name: 'Hotels', 
    path: '/hotels',
    dropdown: [
      { name: 'All Hotels', path: '/hotels' },
      { name: 'Hotel Types', path: '/hotel-types' },
      { name: 'Luxury Hotels', path: '/hotel-types/luxury-hotels' },
      { name: 'Boutique Hotels', path: '/hotel-types/boutique-hotels' },
      { name: 'Beach Hotels', path: '/hotel-types/beach-hotels' },
      { name: 'Family-Friendly Hotels', path: '/hotel-types/family-friendly-hotels' },
      { name: 'Traditional Hotels', path: '/hotel-types/traditional-hotels' },
      { name: 'Luxury Villas', path: '/hotel-types/villas' },
    ]
  },
  { 
    name: 'Locations', 
    path: '/locations',
    dropdown: [
      { name: 'All Locations', path: '/locations' },
      { name: 'Apollonia', path: '/locations/apollonia' },
      { name: 'Kamares', path: '/locations/kamares' },
      { name: 'Platis Gialos', path: '/locations/platis-gialos' },
      { name: 'Kastro', path: '/locations/kastro' },
      { name: 'Vathi', path: '/locations/vathi' },
      { name: 'Faros', path: '/locations/faros' },
    ]
  },
  { name: 'Ferry Tickets', path: '/ferry-tickets' },
  { name: 'Beaches', path: '/beaches' },
  { name: 'Travel Guide', path: '/travel-guide' },
];

// Define prop types for the DesktopNavItems component
interface NavItemProps {
  location: ReturnType<typeof useLocation>;
  openDropdown: string | null;
  toggleDropdown: (name: string | null) => void;
}

// Memoize the desktop nav items to prevent unnecessary re-renders
const DesktopNavItems = memo(({ location, openDropdown, toggleDropdown }: NavItemProps) => (
  <div className="hidden md:block">
    <div className="ml-10 flex items-center space-x-2">
      {mainNavItems.map((item) => (
        <div key={item.name} className="relative group">
          {item.dropdown ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown(item.name)}
                className={`font-montserrat px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200 hover:text-[#1E2E48] ${
                  location.pathname.startsWith(item.path) 
                  ? 'text-[#1E2E48] border-b-2 border-[#1E2E48]' 
                  : 'text-gray-700'
                }`}
              >
                {item.name}
                <ChevronDown size={14} className="ml-1" />
              </button>
              <div 
                className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ${
                  openDropdown === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                {item.dropdown.map((dropdownItem) => (
                  <Link
                    key={dropdownItem.name}
                    to={dropdownItem.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1E2E48]"
                    onClick={() => toggleDropdown(null)}
                  >
                    {dropdownItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              to={item.path}
              className={`font-montserrat px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#1E2E48] ${
                location.pathname === item.path 
                ? 'text-[#1E2E48] border-b-2 border-[#1E2E48]' 
                : 'text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
));

// Define prop types for the MobileMenu component
interface MobileMenuProps extends NavItemProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Memoize the mobile menu to prevent unnecessary re-renders
const MobileMenu = memo(({ isOpen, location, openDropdown, toggleDropdown, setIsOpen }: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-white shadow-lg animate-fade-in">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {mainNavItems.map((item) => (
          <div key={item.name}>
            {item.dropdown ? (
              <>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.startsWith(item.path)
                    ? 'text-[#1E2E48] bg-[#E3D7C3]/10'
                    : 'text-gray-700 hover:bg-[#E3D7C3]/10 hover:text-[#1E2E48]'
                  }`}
                >
                  {item.name}
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openDropdown === item.name && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.path}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-[#E3D7C3]/10 hover:text-[#1E2E48]"
                        onClick={() => setIsOpen(false)}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                  ? 'text-[#1E2E48] bg-[#E3D7C3]/10'
                  : 'text-gray-700 hover:bg-[#E3D7C3]/10 hover:text-[#1E2E48]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Prevent animating on initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Use a passive scroll listener to improve performance
  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame to optimize scroll performance
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10);
      });
    };

    // Add passive scrolling for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = (name: string | null) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 transition-shadow ${
      isScrolled ? 'shadow-lg' : 'shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png" 
                alt="HotelsSifnos Logo" 
                className="h-8 w-8"
                loading="eager"
              />
              <span className="font-montserrat font-bold text-[#1E2E48] text-xl">
                Hotels<span className="text-[#E3D7C3]">Sifnos</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <DesktopNavItems 
            location={location} 
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
          />
          
          {/* User Menu - Add this */}
          <div className="hidden md:flex items-center">
            <UserMenu />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <UserMenu />
            <button
              type="button"
              className="p-2 rounded-md text-[#1E2E48]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with conditional rendering and optimization */}
      <MobileMenu
        isOpen={isOpen}
        location={location}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
        setIsOpen={setIsOpen}
      />
    </nav>
  );
}