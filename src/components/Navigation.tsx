import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Menu, X } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const activeClass = "text-sifnos-deep-blue font-semibold border-b-2 border-sifnos-turquoise pb-1";
  const normalClass = "text-gray-700 hover:text-sifnos-turquoise transition-colors duration-200";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="bg-sifnos-deep-blue py-2">
        <div className="page-container">
          <div className="flex items-center justify-between text-white">
            <div className="text-sm">
              Welcome to Sifnos Island - Your Ultimate Travel Guide
            </div>
            <div className="flex items-center space-x-4">
              <a href="tel:+306944977747" className="hover:text-sifnos-turquoise transition-colors duration-200">
                Call Us: +30 6944977747
              </a>
              <a href="mailto:info@greececyclades.com" className="hover:text-sifnos-turquoise transition-colors duration-200">
                Email Us: info@greececyclades.com
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border-b">
        <div className="page-container">
          <nav className="flex justify-center md:justify-start">
            <ul className="flex overflow-x-auto space-x-1 md:space-x-4 py-3 px-2 md:px-0 w-full">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/hotels" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Hotels
                </NavLink>
              </li>
              <li>
                <NavLink to="/rooms" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Rooms
                </NavLink>
              </li>
              <li>
                <NavLink to="/travel-guide" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Travel Guide
                </NavLink>
              </li>
              <li>
                <NavLink to="/sifnos-map" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Sifnos Map
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/touristas-ai" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <span className="flex items-center">
                    Touristas AI
                    <span className="ml-1 text-[10px] bg-sifnos-turquoise text-white rounded-full px-1">NEW</span>
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
