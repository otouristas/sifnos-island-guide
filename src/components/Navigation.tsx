
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'Villas', path: '/villas' },
  { name: 'Beaches', path: '/beaches' },
  { name: 'Restaurants', path: '/restaurants' },
  { name: 'Travel Guide', path: '/travel-guide' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
  { name: 'About Us', path: '/about-us' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="font-montserrat font-bold text-sifnos-deep-blue text-xl">
                Hotels<span className="text-sifnos-turquoise">Sifnos</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-montserrat px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-sifnos-turquoise ${
                    location.pathname === item.path 
                    ? 'text-sifnos-turquoise border-b-2 border-sifnos-turquoise' 
                    : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-sifnos-deep-blue"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                  ? 'text-sifnos-turquoise bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-sifnos-turquoise'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
