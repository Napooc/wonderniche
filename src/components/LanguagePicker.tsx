import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation, languages, Language } from '@/contexts/TranslationContext';
import { Globe, Check } from 'lucide-react';

const LanguagePicker = () => {
  const { currentLanguage, setLanguage, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground hover:text-primary flex items-center space-x-2 px-3"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{languages[currentLanguage].flag}</span>
          <span className="hidden md:inline">{languages[currentLanguage].name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="p-2">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b mb-2">
            {t('common.selectLanguage')}
          </div>
          <div className="space-y-1">
            {Object.entries(languages).map(([key, language]) => (
              <button
                key={key}
                onClick={() => handleLanguageChange(key as Language)}
                className={`w-full flex items-center justify-between px-2 py-2 text-sm rounded-md hover:bg-accent transition-colors ${
                  currentLanguage === key ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </div>
                {currentLanguage === key && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguagePicker;