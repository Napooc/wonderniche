import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation, languages, Language } from '@/contexts/TranslationContext';
import { Globe, Check } from 'lucide-react';
const LanguagePicker = () => {
  const {
    currentLanguage,
    setLanguage,
    t
  } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setOpen(false);
  };
  return <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-foreground hover:text-primary flex items-center space-x-2 px-3 md:px-3 bg-fuchsia-500 hover:bg-fuchsia-400">
          <Globe className="w-4 h-4" />
          <span className="text-sm">{languages[currentLanguage].flag}</span>
          <span className="hidden lg:inline text-sm">{languages[currentLanguage].name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-card/95 backdrop-blur-md border border-border/50 shadow-xl z-[60] max-h-[80vh]" align="end" sideOffset={8} side="bottom">
        <div className="p-3 bg-card/95 backdrop-blur-md rounded-lg">
          <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b border-border/30 mb-2">
            {t('common.selectLanguage')}
          </div>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {Object.entries(languages).map(([key, language]) => <button key={key} onClick={() => handleLanguageChange(key as Language)} className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md hover:bg-accent/50 transition-colors ${currentLanguage === key ? 'bg-accent/70 text-accent-foreground' : 'text-card-foreground'}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                </div>
                {currentLanguage === key && <Check className="w-4 h-4 text-primary" />}
              </button>)}
          </div>
        </div>
      </PopoverContent>
    </Popover>;
};
export default LanguagePicker;