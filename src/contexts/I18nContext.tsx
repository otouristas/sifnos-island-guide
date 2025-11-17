import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

// Import all translations statically
import enTranslations from '../locales/en.json';
import elTranslations from '../locales/el.json';
import frTranslations from '../locales/fr.json';
import itTranslations from '../locales/it.json';
import deTranslations from '../locales/de.json';
import svTranslations from '../locales/sv.json';
import ruTranslations from '../locales/ru.json';
import trTranslations from '../locales/tr.json';

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

const translationsMap: Record<Language, Record<string, any>> = {
  en: enTranslations,
  el: elTranslations,
  fr: frTranslations,
  it: itTranslations,
  de: deTranslations,
  sv: svTranslations,
  ru: ruTranslations,
  tr: trTranslations,
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to English
    const saved = localStorage.getItem('language') as Language;
    return saved && ['en', 'el', 'fr', 'it', 'de', 'sv', 'ru', 'tr'].includes(saved) 
      ? saved 
      : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Get translations directly from map
  const translations = useMemo(() => translationsMap[language] || translationsMap.en, [language]);

  // Translation function with nested key support (e.g., "common.home")
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string>): string => {
      const keys = key.split('.');
      let value: any = translations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if translation not found
          value = translationsMap.en;
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              return key; // Return key if even English translation not found
            }
          }
          break;
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
