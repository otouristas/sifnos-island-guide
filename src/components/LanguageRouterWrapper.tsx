import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { getLanguageFromPath } from '@/contexts/LanguageRouter';

interface LanguageRouterWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that syncs URL language prefix with I18n context
 * Should be placed inside BrowserRouter and I18nProvider
 */
export function LanguageRouterWrapper({ children }: LanguageRouterWrapperProps) {
  const location = useLocation();
  const { language, setLanguage } = useI18n();

  useEffect(() => {
    const urlLanguage = getLanguageFromPath(location.pathname);
    
    // Only update if different to avoid unnecessary re-renders
    if (urlLanguage !== language) {
      setLanguage(urlLanguage);
    }
  }, [location.pathname, language, setLanguage]);

  return <>{children}</>;
}

