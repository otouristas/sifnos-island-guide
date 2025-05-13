
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { currentLanguage } = useLanguage();

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Create main nav items with translations
  const mainNavItems = [
    { name: t('home'), path: `/${currentLanguage}` },
    { 
      name: t('hotels'), 
      path: `/${currentLanguage}/hotels`,
      dropdown: [
        { name: t('allHotels'), path: `/${currentLanguage}/hotels` },
        { name: t('hotelTypes'), path: `/${currentLanguage}/hotel-types` },
        { name: t('luxuryHotels'), path: `/${currentLanguage}/hotel-types/luxury-hotels` },
        { name: t('boutiqueHotels'), path: `/${currentLanguage}/hotel-types/boutique-hotels` },
        { name: t('beachHotels'), path: `/${currentLanguage}/hotel-types/beach-hotels` },
        { name: t('familyFriendlyHotels'), path: `/${currentLanguage}/hotel-types/family-friendly-hotels` },
        { name: t('traditionalHotels'), path: `/${currentLanguage}/hotel-types/traditional-hotels` },
        { name: t('luxuryVillas'), path: `/${currentLanguage}/hotel-types/villas` },
      ]
    },
    { 
      name: t('locations'), 
      path: `/${currentLanguage}/locations`,
      dropdown: [
        { name: t('allLocations'), path: `/${currentLanguage}/locations` },
        { name: t('apollonia'), path: `/${currentLanguage}/locations/apollonia` },
        { name: t('kamares'), path: `/${currentLanguage}/locations/kamares` },
        { name: t('platisGialos'), path: `/${currentLanguage}/locations/platis-gialos` },
        { name: t('kastro'), path: `/${currentLanguage}/locations/kastro` },
        { name: t('vathi'), path: `/${currentLanguage}/locations/vathi` },
        { name: t('faros'), path: `/${currentLanguage}/locations/faros` },
      ]
    },
    { name: t('beaches'), path: `/${currentLanguage}/beaches` },
    { name: t('travelGuide'), path: `/${currentLanguage}/travel-guide` },
    { name: t('aboutUs'), path: `/${currentLanguage}/about-us` },
    { name: t('faq'), path: `/${currentLanguage}/faq` },
    { name: t('contact'), path: `/${currentLanguage}/contact` }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to={`/${currentLanguage}`} className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png" 
                alt="HotelsSifnos Logo" 
                className="h-8 w-8"
              />
              <span className="font-montserrat font-bold text-[#1E2E48] text-xl">
                Hotels<span className="text-[#E3D7C3]">Sifnos</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-2 mr-4">
              {mainNavItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`font-montserrat px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200 hover:text-[#1E2E48] ${
                          location.pathname.includes(item.path.substring(3)) 
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
                            onClick={() => setOpenDropdown(null)}
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
                        location.pathname === item.path.substring(3) || location.pathname === item.path
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
            
            {/* Language Selector */}
            <LanguageSelector />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSelector />
            <button
              type="button"
              className="p-2 rounded-md text-[#1E2E48]"
              onClick={() => setIsOpen(!isOpen)}
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
            {mainNavItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname.includes(item.path.substring(3))
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
                      location.pathname === item.path.substring(3) || location.pathname === item.path
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
      )}
    </nav>
  );
}
