
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage, languages } = useLanguage();

  return (
    <div className="flex items-center">
      <Select value={currentLanguage} onValueChange={setLanguage}>
        <SelectTrigger className="w-[140px] h-9 bg-transparent border border-gray-300 focus:ring-0 hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-600" />
            <SelectValue>
              {languages.find(lang => lang.code === currentLanguage)?.name || t('currentLanguage')}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
