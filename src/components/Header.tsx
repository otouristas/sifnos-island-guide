
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-sifnos-deep-blue">
          Hotels Sifnos
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/hotels" className="text-gray-700 hover:text-sifnos-turquoise">
                Hotels
              </Link>
            </li>
            <li>
              <Link to="/locations" className="text-gray-700 hover:text-sifnos-turquoise">
                Locations
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-sifnos-turquoise">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-700 hover:text-sifnos-turquoise">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
