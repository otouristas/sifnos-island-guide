
import React, { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      className ? 
      `${className} ${isActive ? 'text-sifnos-turquoise' : 'text-gray-700 hover:text-sifnos-turquoise'}` :
      `text-gray-700 hover:text-sifnos-turquoise ${isActive ? 'text-sifnos-turquoise' : ''}`
    }
  >
    {children}
  </RouterNavLink>
);

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, className, onClick }) => (
  <Link to={to} className={`block py-2 px-4 text-sm hover:bg-gray-100 ${className || ''}`} onClick={onClick}>
    {children}
  </Link>
);

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png" 
              alt="Hotels Sifnos" 
              className="h-10" 
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent">Hotels</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/hotels"
                            className="block p-2 hover:bg-gray-100 rounded"
                          >
                            All Hotels
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/hotel-types/luxury"
                            className="block p-2 hover:bg-gray-100 rounded"
                          >
                            Luxury Hotels
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/hotel-types/boutique"
                            className="block p-2 hover:bg-gray-100 rounded"
                          >
                            Boutique Hotels
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent">Locations</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/locations"
                            className="block p-2 hover:bg-gray-100 rounded"
                          >
                            All Locations
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/locations/apollonia"
                            className="block p-2 hover:bg-gray-100 rounded"
                          >
                            Apollonia
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/locations/kamares"
                            className="block p-2 hover:bg-gray-100 rounded"
                          >
                            Kamares
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <NavLink to="/beaches">Beaches</NavLink>
            <NavLink to="/travel-guide">Travel Guide</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/pricing" className="text-sifnos-turquoise font-medium">List Your Hotel</NavLink>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  className="h-6 w-6"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-3 py-2">
              <div className="space-y-2">
                <div className="font-medium px-4 py-1">Hotels</div>
                <MobileNavLink 
                  to="/hotels" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-8"
                >
                  All Hotels
                </MobileNavLink>
                <MobileNavLink 
                  to="/hotel-types/luxury" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-8"
                >
                  Luxury Hotels
                </MobileNavLink>
                <MobileNavLink 
                  to="/hotel-types/boutique" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-8"
                >
                  Boutique Hotels
                </MobileNavLink>
              </div>

              <div className="space-y-2">
                <div className="font-medium px-4 py-1">Locations</div>
                <MobileNavLink 
                  to="/locations" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-8"
                >
                  All Locations
                </MobileNavLink>
                <MobileNavLink 
                  to="/locations/apollonia" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-8"
                >
                  Apollonia
                </MobileNavLink>
                <MobileNavLink 
                  to="/locations/kamares" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-8"
                >
                  Kamares
                </MobileNavLink>
              </div>
              
              <MobileNavLink 
                to="/beaches" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Beaches
              </MobileNavLink>
              <MobileNavLink 
                to="/travel-guide" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Travel Guide
              </MobileNavLink>
              <MobileNavLink 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </MobileNavLink>
              <MobileNavLink 
                to="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sifnos-turquoise font-medium"
              >
                List Your Hotel
              </MobileNavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
