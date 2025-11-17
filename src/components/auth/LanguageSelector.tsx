import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n, Language } from "@/contexts/I18nContext";
import { useLanguageRouter } from "@/contexts/LanguageRouter";

const languages: Array<{ code: Language; name: string; flag: string }> = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

export const LanguageSelector = () => {
  const { language } = useI18n();
  const { changeLanguage } = useLanguageRouter();
  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <Select value={language} onValueChange={(value) => changeLanguage(value as Language)}>
      <SelectTrigger 
        className="w-[140px] border-none bg-transparent hover:bg-accent/50 transition-colors"
        aria-label={`Select language - Current: ${currentLang.name}`}
      >
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue>
          <span className="mr-2">{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover/95 backdrop-blur-md border-border z-[10000]">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
