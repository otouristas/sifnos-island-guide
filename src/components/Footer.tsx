import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sifnos-deep-blue text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="font-montserrat font-bold text-xl text-white">
                Hotels<span className="text-sifnos-teal">Sifnos</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Find the perfect accommodation for your dream vacation on the beautiful island of Sifnos, Greece.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-sifnos-teal transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-sifnos-teal transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-sifnos-teal transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4 border-b border-sifnos-turquoise pb-2">
              Explore
            </h3>
            <ul className="space-y-2">
              <li><Link to="/hotels" className="text-gray-300 hover:text-sifnos-teal transition-colors">All Hotels</Link></li>
              <li><Link to="/locations" className="text-gray-300 hover:text-sifnos-teal transition-colors">Locations</Link></li>
              <li><Link to="/hotel-types" className="text-gray-300 hover:text-sifnos-teal transition-colors">Hotel Types</Link></li>
              <li><Link to="/beaches" className="text-gray-300 hover:text-sifnos-teal transition-colors">Beaches</Link></li>
              <li><Link to="/travel-guide" className="text-gray-300 hover:text-sifnos-teal transition-colors">Travel Guide</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-sifnos-teal transition-colors">FAQ</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-sifnos-teal transition-colors">List Your Hotel</Link></li>
            </ul>
          </div>
          
          {/* Locations */}
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4 border-b border-sifnos-turquoise pb-2">
              Locations
            </h3>
            <ul className="space-y-2">
              <li><Link to="/locations/apollonia" className="text-gray-300 hover:text-sifnos-teal transition-colors">Apollonia</Link></li>
              <li><Link to="/locations/kamares" className="text-gray-300 hover:text-sifnos-teal transition-colors">Kamares</Link></li>
              <li><Link to="/locations/platis-gialos" className="text-gray-300 hover:text-sifnos-teal transition-colors">Platis Gialos</Link></li>
              <li><Link to="/locations/kastro" className="text-gray-300 hover:text-sifnos-teal transition-colors">Kastro</Link></li>
              <li><Link to="/locations/vathi" className="text-gray-300 hover:text-sifnos-teal transition-colors">Vathi</Link></li>
              <li><Link to="/locations/faros" className="text-gray-300 hover:text-sifnos-teal transition-colors">Faros</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4 border-b border-sifnos-turquoise pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-sifnos-teal" />
                <a href="mailto:hello@hotelssifnos.com" className="text-gray-300 hover:text-sifnos-teal transition-colors">
                  hello@hotelssifnos.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin size={16} className="mr-2 text-sifnos-teal" />
                <span className="text-gray-300">
                  Sifnos Island, Cyclades, Greece
                </span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-md text-gray-800 focus:outline-none"
                />
                <button type="submit" className="bg-sifnos-turquoise hover:bg-sifnos-teal transition-colors text-white px-4 py-2 rounded-r-md">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-center font-montserrat font-semibold text-lg mb-6">Our Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <a 
              href="https://greececyclades.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/35309f91-b85f-4eef-a002-341d80d7ced4.png" 
                alt="Discover Cyclades" 
                className="h-8 w-auto brightness-0 invert"
              />
            </a>
            <a 
              href="https://cycladesrentacar.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://cycladesrentacar.com/cycladesrentacar.svg" 
                alt="Cyclades Rent A Car" 
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} HotelsSifnos.com. All rights reserved.
            </p>
            
            <div className="flex space-x-4 text-sm text-gray-400">
              <Link to="/about-us" className="hover:text-sifnos-teal transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-sifnos-teal transition-colors">Contact</Link>
              <Link to="/privacy-policy" className="hover:text-sifnos-teal transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-sifnos-teal transition-colors">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-sifnos-teal transition-colors">Cookie Policy</Link>
            </div>
          </div>
          
          {/* SEO Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Popular Searches</h4>
              <ul className="space-y-1">
                <li><Link to="/hotels" className="hover:text-sifnos-teal">Sifnos Hotels</Link></li>
                <li><Link to="/hotel-types/luxury-hotels" className="hover:text-sifnos-teal">Luxury Hotels in Sifnos</Link></li>
                <li><Link to="/hotel-types/beach-hotels" className="hover:text-sifnos-teal">Sifnos Hotels on the Beach</Link></li>
                <li><Link to="/hotel-types/boutique-hotels" className="hover:text-sifnos-teal">Boutique Hotels in Sifnos</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Top Locations</h4>
              <ul className="space-y-1">
                <li><Link to="/locations/apollonia" className="hover:text-sifnos-teal">Hotels in Apollonia</Link></li>
                <li><Link to="/locations/platis-gialos" className="hover:text-sifnos-teal">Platis Gialos Accommodations</Link></li>
                <li><Link to="/locations/kamares" className="hover:text-sifnos-teal">Kamares Beach Hotels</Link></li>
                <li><Link to="/locations/kastro" className="hover:text-sifnos-teal">Kastro Traditional Hotels</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Beaches</h4>
              <ul className="space-y-1">
                <li><Link to="/beaches" className="hover:text-sifnos-teal">Best Beaches in Sifnos</Link></li>
                <li><Link to="/beaches" className="hover:text-sifnos-teal">Platis Gialos Beach</Link></li>
                <li><Link to="/beaches" className="hover:text-sifnos-teal">Vathi Beach</Link></li>
                <li><Link to="/beaches" className="hover:text-sifnos-teal">Kamares Beach</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Travel Information</h4>
              <ul className="space-y-1">
                <li><Link to="/travel-guide" className="hover:text-sifnos-teal">Sifnos Travel Guide</Link></li>
                <li><Link to="/travel-guide" className="hover:text-sifnos-teal">How to Get to Sifnos</Link></li>
                <li><Link to="/travel-guide" className="hover:text-sifnos-teal">Best Time to Visit Sifnos</Link></li>
                <li><Link to="/faq" className="hover:text-sifnos-teal">Frequently Asked Questions</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
