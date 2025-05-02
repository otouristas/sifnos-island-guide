
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

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
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link to="/hotels" className="text-gray-300 hover:text-sifnos-teal transition-colors">Hotels</Link></li>
              <li><Link to="/villas" className="text-gray-300 hover:text-sifnos-teal transition-colors">Villas</Link></li>
              <li><Link to="/beaches" className="text-gray-300 hover:text-sifnos-teal transition-colors">Beaches</Link></li>
              <li><Link to="/travel-guide" className="text-gray-300 hover:text-sifnos-teal transition-colors">Travel Guide</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-sifnos-teal transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4 border-b border-sifnos-turquoise pb-2">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-sifnos-teal" />
                <a href="mailto:info@hotelssifnos.com" className="text-gray-300 hover:text-sifnos-teal transition-colors">
                  info@hotelssifnos.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4 border-b border-sifnos-turquoise pb-2">
              Newsletter
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to our newsletter for the latest offers and updates.
            </p>
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

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HotelsSifnos.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
