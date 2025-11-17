import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n, Language } from './I18nContext';

// Language URL prefix mapping
export const LANGUAGE_PREFIXES: Record<Language, string> = {
  en: '', // Default - no prefix
  el: '/gr', // Greek
  fr: '/fr', // French
  it: '/it', // Italian
  de: '/de', // German
  sv: '/sv', // Swedish
  ru: '/ru', // Russian
  tr: '/tr', // Turkish
};

// Reverse mapping for detection
export const PREFIX_TO_LANGUAGE: Record<string, Language> = {
  '': 'en',
  'gr': 'el',
  'fr': 'fr',
  'it': 'it',
  'de': 'de',
  'sv': 'sv',
  'ru': 'ru',
  'tr': 'tr',
};

/**
 * Extract language from URL path
 * /gr/hotels -> 'el'
 * /fr/contact -> 'fr'
 * /hotels -> 'en'
 */
export function getLanguageFromPath(pathname: string): Language {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
  if (match) {
    const prefix = match[1];
    return PREFIX_TO_LANGUAGE[prefix] || 'en';
  }
  return 'en';
}

/**
 * Remove language prefix from path
 * /gr/hotels -> /hotels
 * /hotels -> /hotels
 */
export function removeLanguagePrefix(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match && PREFIX_TO_LANGUAGE[match[1]]) {
    return match[2] || '/';
  }
  return pathname;
}

/**
 * Add language prefix to path
 * /hotels, 'el' -> /gr/hotels
 * /hotels, 'en' -> /hotels
 */
export function addLanguagePrefix(pathname: string, language: Language): string {
  const cleanPath = removeLanguagePrefix(pathname);
  const prefix = LANGUAGE_PREFIXES[language];
  
  if (!prefix) {
    return cleanPath;
  }
  
  return `${prefix}${cleanPath}`;
}

/**
 * Hook to sync URL with language context
 */
export function useLanguageRouter() {
  const { language, setLanguage } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync URL language with context on mount and URL change
  useEffect(() => {
    const urlLanguage = getLanguageFromPath(location.pathname);
    
    if (urlLanguage !== language) {
      // URL language takes precedence
      setLanguage(urlLanguage);
    }
  }, [location.pathname, language, setLanguage]);

  /**
   * Navigate to path with current language prefix
   */
  const navigateWithLanguage = (path: string, options?: { replace?: boolean }) => {
    const pathWithLanguage = addLanguagePrefix(path, language);
    navigate(pathWithLanguage, options);
  };

  /**
   * Change language and update URL
   */
  const changeLanguage = (newLanguage: Language) => {
    const currentPath = removeLanguagePrefix(location.pathname);
    const search = location.search;
    const hash = location.hash;
    const newPath = addLanguagePrefix(currentPath, newLanguage);
    
    setLanguage(newLanguage);
    navigate(`${newPath}${search}${hash}`, { replace: true });
  };

  return {
    navigateWithLanguage,
    changeLanguage,
    currentPath: removeLanguagePrefix(location.pathname),
  };
}

