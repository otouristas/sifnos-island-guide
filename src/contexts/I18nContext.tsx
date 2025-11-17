import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Pre-import English translations as fallback
import enTranslationsFallback from '../locales/en.json';

export type Language = 'en' | 'el' | 'fr' | 'it' | 'de' | 'sv' | 'ru' | 'tr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

// Dynamic translation loader
const loadTranslations = async (lang: Language): Promise<Record<string, any>> => {
  try {
    // If English, use the pre-imported version
    if (lang === 'en') {
      return enTranslationsFallback;
    }
    
    // For other languages, try dynamic import
    const translations = await import(`../locales/${lang}.json`);
    return translations.default || enTranslationsFallback;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}`, error);
    // Fallback to English
    return enTranslationsFallback;
  }
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to English
    // Use try-catch to handle cases where localStorage might not be available
    try {
      const saved = localStorage.getItem('language') as Language;
      return saved && ['en', 'el', 'fr', 'it', 'de', 'sv', 'ru', 'tr'].includes(saved) 
        ? saved 
        : 'en';
    } catch {
      return 'en';
    }
  });

  // Initialize with English translations as fallback to prevent blank page
  const [translations, setTranslations] = useState<Record<string, any>>(enTranslationsFallback);
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.warn('Failed to save language to localStorage', e);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    
    // Load translations for the selected language
    setIsLoading(true);
    loadTranslations(language)
      .then((loadedTranslations) => {
        setTranslations(loadedTranslations);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load translations:', error);
        // Set empty translations as fallback
        setTranslations({});
        setIsLoading(false);
      });
  }, [language]);

  // Translation function with nested key support (e.g., "common.home")
  const t = (key: string, params?: Record<string, string>): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return key; // Return key if translations not loaded yet
    }

    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters if provided
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return value;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
