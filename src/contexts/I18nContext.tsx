import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

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
    const translations = await import(`../locales/${lang}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}`, error);
    // Fallback to English
    const enTranslations = await import('../locales/en.json');
    return enTranslations.default;
  }
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to English
    const saved = localStorage.getItem('language') as Language;
    return saved && ['en', 'el', 'fr', 'it', 'de', 'sv', 'ru', 'tr'].includes(saved) 
      ? saved 
      : 'en';
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    
    // Load translations for the selected language
    loadTranslations(language).then(setTranslations);
  }, [language]);

  // Translation function with nested key support (e.g., "common.home")
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string>): string => {
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
  }, [translations]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
