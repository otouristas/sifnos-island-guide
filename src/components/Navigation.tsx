import { useState, useEffect, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, HelpCircle } from 'lucide-react';
import AuthButton from '@/components/auth/AuthButton';
import UserMenu from '@/components/auth/UserMenu';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const mainNavItems = [
  { name: 'Home', path: '/' },
  {
    name: 'Hotels',
    path: '/hotels',
    children: [
      { name: 'All Hotels', path: '/hotels' },
      { name: 'Luxury Hotels', path: '/hotels/luxury' },
      { name: 'Beach Hotels', path: '/hotels/beach' },
      { name: 'Budget Hotels', path: '/hotels/budget' },
    ],
  },
  {
    name: 'Explore',
    path: '/locations',
    children: [
      { name: 'Locations', path: '/locations' },
      { name: 'Beaches', path: '/beaches' },
      { name: 'Travel Guide', path: '/travel-guide' },
    ],
  },
  { name: 'Ferry Tickets', path: '/ferry-tickets' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

interface NavItemProps {
  location: ReturnType<typeof useLocation>;
  openDropdown: string | null;
  toggleDropdown: (name: string | null) => void;
}

const DesktopNavItems = memo(({ location, openDropdown, toggleDropdown }: NavItemProps) => (
  <NavigationMenu className="hidden lg:flex">
    <NavigationMenuList className="gap-1">
      {mainNavItems.map((item) => {
        const isActive = location.pathname === item.path || 
          (item.children?.some(child => location.pathname === child.path));
        
        if (item.children) {
          return (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuTrigger 
                className={`bg-transparent hover:bg-accent/50 transition-all duration-200 ${
                  isActive ? 'text-accent font-semibold' : 'text-foreground'
                }`}
              >
                {item.name}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-3 bg-popover/95 backdrop-blur-md border-border">
                  {item.children.map((child) => (
                    <li key={child.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={child.path}
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{child.name}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        }

        return (
          <NavigationMenuItem key={item.name}>
            <Link to={item.path}>
              <Button
                variant="ghost"
                className={`transition-all duration-200 ${
                  isActive ? 'text-accent font-semibold bg-accent/10' : 'text-foreground hover:bg-accent/50'
                }`}
              >
                {item.name}
              </Button>
            </Link>
          </NavigationMenuItem>
        );
      })}
    </NavigationMenuList>
  </NavigationMenu>
));

DesktopNavItems.displayName = 'DesktopNavItems';

interface MobileMenuProps extends NavItemProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu = memo(({ isOpen, location, openDropdown, toggleDropdown, setIsOpen }: MobileMenuProps) => (
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
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name} className="mb-2">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleDropdown(openDropdown === item.name ? null : item.name)}
                    className={`w-full flex justify-between items-center p-4 rounded-lg transition-colors ${
                      isActive ? 'bg-accent/20 text-accent font-semibold' : 'hover:bg-accent/10'
                    }`}
                  >
                    <span className="text-lg">{item.name}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === item.name && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={`block p-3 rounded-lg transition-colors ${
                            location.pathname === child.path
                              ? 'bg-accent/20 text-accent font-medium'
                              : 'hover:bg-accent/10'
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
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl shadow-[var(--shadow-elegant)] border-b border-border/50'
            : 'bg-background/95 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-xl group-hover:bg-accent/30 transition-all duration-300 rounded-full"></div>
                <span className="relative text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Hotels Sifnos
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNavItems
              location={location}
              openDropdown={openDropdown}
              toggleDropdown={toggleDropdown}
            />

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Help Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex hover:bg-accent/50 transition-colors"
                aria-label="Help"
                asChild
              >
                <Link to="/contact">
                  <HelpCircle className="h-5 w-5" />
                </Link>
              </Button>

              {/* Language Selector - Desktop */}
              <div className="hidden lg:block">
                <LanguageSelector />
              </div>

              {/* Auth Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                {user ? (
                  <UserMenu />
                ) : (
                  <AuthButton />
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-accent/50 rounded-lg transition-colors"
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
      />
    </>
  );
};

export default Navigation;
