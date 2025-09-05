import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation, languages, Language } from '@/contexts/TranslationContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface MobileLanguagePickerProps {
  onLanguageChange?: () => void;
}

const MobileLanguagePicker = ({ onLanguageChange }: MobileLanguagePickerProps) => {
  const { currentLanguage, setLanguage, t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setIsExpanded(false);
    onLanguageChange?.();
  };

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-foreground hover:text-primary hover:bg-card/50 px-4 py-3"
      >
        <div className="flex items-center space-x-3">
          <Globe className="w-4 h-4" />
          <span className="text-lg">{languages[currentLanguage].flag}</span>
          <span className="font-medium">{languages[currentLanguage].name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </Button>
      
      {isExpanded && (
        <div className="mt-2 space-y-1 max-h-80 overflow-y-auto bg-card/30 rounded-lg p-2 border border-border/20">
          {Object.entries(languages).map(([key, language]) => (
            <button
              key={key}
              onClick={() => handleLanguageChange(key as Language)}
              className={`w-full flex items-center justify-between px-3 py-3 text-sm rounded-md hover:bg-accent/50 transition-colors ${
                currentLanguage === key ? 'bg-accent/70 text-accent-foreground' : 'text-card-foreground'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </div>
              {currentLanguage === key && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileLanguagePicker;
