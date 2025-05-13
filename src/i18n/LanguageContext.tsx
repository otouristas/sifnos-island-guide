
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from './index'; // Import the initialized i18n instance
import { supportedLanguages, defaultLanguage } from './index';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  languages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || defaultLanguage);

  // Map of language codes to their names (both in their own language)
  const languages = supportedLanguages.map(code => ({
    code,
    name: t('languageName', { lng: code }) // Use the language name in its own language
  }));

  // Update language on path change
  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    // Check if the first part of the path is a language code
    if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
      const langFromPath = pathParts[0];
      if (langFromPath !== currentLanguage) {
        i18n.changeLanguage(langFromPath);
        setCurrentLanguage(langFromPath);
      }
    } else if (path === '/' || !path.startsWith(`/${currentLanguage}/`)) {
      // Add language prefix to path if at root or missing
      const newPath = `/${currentLanguage}${path === '/' ? '' : path}`;
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, currentLanguage, navigate]);

  // Function to change language
  const setLanguage = (lang: string) => {
    if (!supportedLanguages.includes(lang)) {
      console.warn(`Language ${lang} is not supported`);
      return;
    }

    // Change i18next language
    i18n.changeLanguage(lang);
    
    // Update current language
    setCurrentLanguage(lang);
    
    // Update the URL to reflect the language change
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
      // Replace the language code in the path
      pathParts[0] = lang;
      navigate(`/${pathParts.join('/')}${location.search}`);
    } else {
      // Add language code to the path
      navigate(`/${lang}${path === '/' ? '' : path}${location.search}`);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
