import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  
  return (
    <footer className="bg-sifnos-deep-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold mb-4 block">
              HotelsSifnos.com
            </Link>
            <p className="text-gray-300">
              Discover the best accommodations in Sifnos. Find your perfect hotel and explore the beauty of Sifnos.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Subscribe to our Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Stay up-to-date with our latest offers and news.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none"
              />
              <button className="bg-sifnos-turquoise hover:bg-sifnos-teal text-white px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-sifnos-turquoise transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sifnos-turquoise transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-sifnos-turquoise transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-sifnos-turquoise transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/locations" className="hover:text-sifnos-turquoise transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-sifnos-turquoise transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/hotel-types" className="hover:text-sifnos-turquoise transition-colors">
                  Hotel Types
                </Link>
              </li>
              <li>
                <Link to="/beaches" className="hover:text-sifnos-turquoise transition-colors">
                  Beaches
                </Link>
              </li>
              <li>
                <Link to="/travel-guide" className="hover:text-sifnos-turquoise transition-colors">
                  Travel Guide
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-sifnos-turquoise transition-colors">
                  List Your Hotel
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.sifnos.gr/" target="_blank" rel="noopener noreferrer" className="hover:text-sifnos-turquoise transition-colors">
                  Official Sifnos Website
                </a>
              </li>
              <li>
                <a href="https://www.cyclades.gr/" target="_blank" rel="noopener noreferrer" className="hover:text-sifnos-turquoise transition-colors">
                  Cyclades Islands
                </a>
              </li>
              <li>
                <a href="https://www.visitgreece.gr/" target="_blank" rel="noopener noreferrer" className="hover:text-sifnos-turquoise transition-colors">
                  Visit Greece
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                &copy; {new Date().getFullYear()} HotelsSifnos.com
              </li>
              <li>
                All rights reserved.
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Made with ❤️ in Sifnos
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
