
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import our translations
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enHotels from './locales/en/hotels.json';
import enNavigation from './locales/en/navigation.json';
import enSEO from './locales/en/seo.json';

import elCommon from './locales/el/common.json';
import elHome from './locales/el/home.json';
import elHotels from './locales/el/hotels.json';
import elNavigation from './locales/el/navigation.json';
import elSEO from './locales/el/seo.json';

// Define supported languages and namespaces
export const supportedLanguages = ['en', 'el'];
export const defaultLanguage = 'en';
export const namespaces = ['common', 'home', 'hotels', 'navigation', 'seo'];
export const defaultNamespace = 'common';

// Resources bundle containing all translations
const resources = {
  en: {
    common: enCommon,
    home: enHome,
    hotels: enHotels,
    navigation: enNavigation,
    seo: enSEO
  },
  el: {
    common: elCommon,
    home: elHome,
    hotels: elHotels,
    navigation: elNavigation,
    seo: elSEO
  }
};

// Initialize i18next
i18n
  // Load translations from the server if needed
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    // Default language
    fallbackLng: defaultLanguage,
    // Default namespace
    defaultNS: defaultNamespace,
    // List of namespaces to load
    ns: namespaces,
    
    // Detect language from different sources
    detection: {
      // Order and from where user language should be detected
      order: ['path', 'localStorage', 'navigator'],
      // Look for the language in the URL path as the first segment
      lookupFromPathIndex: 0,
      // Save user language preference to localStorage
      caches: ['localStorage'],
      // Always include the language in the URL path
      checkWhitelist: true
    },
    
    // Allow keys to be phrases in different languages
    keySeparator: false,
    // Don't escape HTML entities in values
    interpolation: {
      escapeValue: false
    },
    
    // React specific options
    react: {
      // Wait for translations to be loaded before rendering
      useSuspense: true,
    }
  });

export default i18n;
