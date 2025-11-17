console.log('[I18N] 🚀 Starting I18nContext.tsx module evaluation');
console.log('[I18N] React available before import?', typeof window !== 'undefined' ? 'yes' : 'SSR');

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

console.log('[I18N] ✅ React hooks imported');
console.log('[I18N] createContext:', typeof createContext);

// Static imports for all translations (fixes React undefined issue)
import enTranslations from '../locales/en.json';
import elTranslations from '../locales/el.json';
import frTranslations from '../locales/fr.json';
import itTranslations from '../locales/it.json';
import deTranslations from '../locales/de.json';
import svTranslations from '../locales/sv.json';
import ruTranslations from '../locales/ru.json';
import trTranslations from '../locales/tr.json';

console.log('[I18N] ✅ All translations imported statically');

export type Language = 'en' | 'el' | 'fr' | 'it' | 'de' | 'sv' | 'ru' | 'tr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

console.log('[I18N] 🎯 About to call createContext...');
console.log('[I18N] createContext function:', createContext);

const I18nContext = createContext<I18nContextType | undefined>(undefined);

console.log('[I18N] ✅ I18nContext created successfully:', I18nContext);

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

// Translation map with static imports
const translationMap: Record<Language, any> = {
  en: enTranslations,
  el: elTranslations,
  fr: frTranslations,
  it: itTranslations,
  de: deTranslations,
  sv: svTranslations,
  ru: ruTranslations,
  tr: trTranslations,
};

console.log('[I18N] 📦 Translation map created');

export const I18nProvider = ({ children }: I18nProviderProps) => {
  console.log('[I18N] 🎨 I18nProvider rendering');
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

  const [translations, setTranslations] = useState<Record<string, any>>(() => {
    // Initialize with the saved language's translations
    const saved = localStorage.getItem('language') as Language;
    const initialLang = saved && ['en', 'el', 'fr', 'it', 'de', 'sv', 'ru', 'tr'].includes(saved) ? saved : 'en';
    return translationMap[initialLang];
  });

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
    console.log('[I18N] 🔄 Language changed to:', language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    
    // Update translations from static map
    setTranslations(translationMap[language]);
    console.log('[I18N] ✅ Translations updated for:', language);
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
