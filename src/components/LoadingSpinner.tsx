
import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sifnos-deep-blue"></div>
        <p className="mt-4 text-sifnos-deep-blue font-medium">{t('loading')}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
