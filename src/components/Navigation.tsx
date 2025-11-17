import { useState, useEffect, memo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, HelpCircle, Globe } from 'lucide-react';
import AuthButton from '@/components/auth/AuthButton';
import UserMenu from '@/components/auth/UserMenu';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/contexts/I18nContext';
import TouristasLogo from '@/components/TouristasLogo';

// Navigation items will be translated using i18n
const getMainNavItems = (t: (key: string) => string) => [
  { name: t('common.home'), path: '/' },
  {
    name: t('common.hotels'),
    path: '/hotels',
    children: [
      { name: t('common.allHotels'), path: '/hotels' },
      { name: t('common.luxuryHotels'), path: '/hotel-types/luxury-hotels' },
      { name: t('common.beachHotels'), path: '/hotel-types/beach-hotels' },
      { name: t('common.villas'), path: '/hotel-types/villas' },
      { name: t('common.budgetHotels'), path: '/hotel-types/budget-hotels' },
    ],
  },
  {
    name: t('common.explore'),
    path: '/locations',
    children: [
      { name: t('common.allLocations'), path: '/locations' },
      { name: 'Apollonia', path: '/locations/apollonia' },
      { name: 'Kamares', path: '/locations/kamares' },
      { name: 'Platis Gialos', path: '/locations/platis-gialos' },
      { name: t('common.beaches'), path: '/beaches' },
      { name: t('common.travelGuide'), path: '/travel-guide' },
    ],
  },
  { name: t('common.ferryTickets'), path: '/ferry-tickets' },
  { name: t('common.blog'), path: '/blog' },
  { name: t('common.contact'), path: '/contact' },
];

interface NavItemProps {
  location: ReturnType<typeof useLocation>;
  openDropdown: string | null;
  toggleDropdown: (name: string | null) => void;
  navItems: ReturnType<typeof getMainNavItems>;
}

const DesktopNavItems = memo(({ location, openDropdown, toggleDropdown, navItems }: NavItemProps) => {
  const hoverTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  const handleKeyDown = (e: React.KeyboardEvent, itemName: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(openDropdown === itemName ? null : itemName);
    } else if (e.key === 'Escape') {
      toggleDropdown(null);
    }
  };

  const handleMouseEnter = (itemName: string) => {
    // Clear any pending timeout for this item
    const timeout = hoverTimeouts.current.get(itemName);
    if (timeout) {
      clearTimeout(timeout);
      hoverTimeouts.current.delete(itemName);
    }
    toggleDropdown(itemName);
  };

  const handleMouseLeave = (itemName: string) => {
    // Set a longer timeout to close the dropdown - gives time to move to dropdown
    const timeout = setTimeout(() => {
      // Only close if still not hovering over the dropdown area
      if (openDropdown === itemName) {
        toggleDropdown(null);
      }
      hoverTimeouts.current.delete(itemName);
    }, 300);
    hoverTimeouts.current.set(itemName, timeout);
  };

  return (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || 
          (item.children?.some(child => location.pathname === child.path));
        
        if (item.children) {
          const isOpen = openDropdown === item.name;
          
          return (
            <div 
              key={item.name} 
              className="relative"
              onMouseEnter={() => {
                // Clear any pending timeout
                const timeout = hoverTimeouts.current.get(item.name);
                if (timeout) {
                  clearTimeout(timeout);
                  hoverTimeouts.current.delete(item.name);
                }
                toggleDropdown(item.name);
              }}
              onMouseLeave={(e) => {
                // Check if we're moving to the dropdown
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (relatedTarget && relatedTarget.closest(`[data-dropdown="${item.name}"]`)) {
                  return; // Don't close if moving to dropdown
                }
                // Set timeout to close
                const timeout = setTimeout(() => {
                  toggleDropdown(null);
                  hoverTimeouts.current.delete(item.name);
                }, 150);
                hoverTimeouts.current.set(item.name, timeout);
              }}
            >
              <button 
                className="text-gray-700 hover:text-sifnos-deep-blue px-3 py-2 text-base font-medium flex items-center space-x-1.5"
                onClick={() => toggleDropdown(isOpen ? null : item.name)}
                onKeyDown={(e) => handleKeyDown(e, item.name)}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <span>{item.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu - With data attribute for hover detection */}
              {isOpen && (
                <div 
                  data-dropdown={item.name}
                  className="absolute top-full left-0 pt-1 w-56 z-[60]"
                  onMouseEnter={() => {
                    const timeout = hoverTimeouts.current.get(item.name);
                    if (timeout) {
                      clearTimeout(timeout);
                      hoverTimeouts.current.delete(item.name);
                    }
                  }}
                >
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sifnos-beige/20 hover:text-sifnos-deep-blue transition-colors cursor-pointer"
                        onClick={() => toggleDropdown(null)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`text-gray-700 hover:text-sifnos-deep-blue px-3 py-2 text-base font-medium flex items-center space-x-1.5 group ${
              isActive ? 'text-sifnos-deep-blue font-semibold' : ''
            }`}
          >
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );
});

DesktopNavItems.displayName = 'DesktopNavItems';

interface MobileMenuProps extends NavItemProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu = memo(({ isOpen, location, openDropdown, toggleDropdown, setIsOpen, navItems }: MobileMenuProps) => (
  <div
    className={`fixed inset-0 z-50 bg-background/95 backdrop-blur-lg transition-all duration-300 lg:hidden ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}
  >
    <div className="container flex flex-col h-full py-6">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="text-2xl font-bold text-primary" onClick={() => setIsOpen(false)}>
          Hotels Sifnos
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-accent/50 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name} className="mb-2">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleDropdown(openDropdown === item.name ? null : item.name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown(openDropdown === item.name ? null : item.name);
                      }
                    }}
                    className={`w-full flex justify-between items-center p-4 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-accent/20 text-accent font-semibold' : 'hover:bg-accent/10 active:bg-accent/15'
                    }`}
                    aria-expanded={openDropdown === item.name}
                    aria-haspopup="true"
                  >
                    <span className="text-lg">{item.name}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === item.name && (
                    <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={`block p-3 rounded-lg transition-colors min-h-[44px] flex items-center ${
                            location.pathname === child.path
                              ? 'bg-accent/20 text-accent font-medium'
                              : 'hover:bg-accent/10 active:bg-accent/15'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block p-4 rounded-lg text-lg transition-colors ${
                    isActive ? 'bg-accent/20 text-accent font-semibold' : 'hover:bg-accent/10'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border space-y-3">
        <LanguageSelector />
        <AuthButton />
      </div>
    </div>
  </div>
));

MobileMenu.displayName = 'MobileMenu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useI18n();
  const mainNavItems = getMainNavItems(t);

  const toggleDropdown = (name: string | null) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-sm h-14 md:h-[72px]">
        <div className="max-w-[2000px] mx-auto h-full pl-0">
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-12">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 pl-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl md:text-2xl font-heading font-bold bg-gradient-to-r from-[#1E2E48] to-[#E3D7C3] bg-clip-text text-transparent">
                    Hotels Sifnos
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] md:text-xs text-gray-500 font-medium">powered by</span>
                    <TouristasLogo size="sm" className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-[10px] md:text-xs text-gray-500 font-medium">Touristas AI</span>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <DesktopNavItems
                  location={location}
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  navItems={mainNavItems}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 ml-auto pr-4">
              {/* Language Selector - Desktop */}
              <div className="hidden md:block">
                <LanguageSelector />
              </div>

              {/* Help Icon */}
              <Link to="/contact" className="hidden md:block">
                <HelpCircle className="h-5 w-5 text-gray-600 hover:text-sifnos-deep-blue transition-colors" />
              </Link>

              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link to="/signin" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                      Sign In
                    </Link>
                    <Link to="/signup" className="inline-flex items-center justify-center rounded-md bg-sifnos-deep-blue px-4 py-2 text-sm font-medium text-white hover:bg-sifnos-deep-blue/90 transition-colors">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isOpen}
        location={location}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
        setIsOpen={setIsOpen}
        navItems={mainNavItems}
      />
    </>
  );
};

export default Navigation;
