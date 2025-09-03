import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'de' | 'es' | 'fr' | 'ja' | 'ko' | 'zh-cn' | 'zh-tw' | 'pt' | 'ru';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Language data
export const languages = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ko: { code: 'ko', name: '한국어', flag: '🇰🇷' },
  'zh-cn': { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
  'zh-tw': { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
  pt: { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ru: { code: 'ru', name: 'Русский', flag: '🇷🇺' },
} as const;

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as Language) || 'en';
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const module = await import(`../translations/${currentLanguage}.ts`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${currentLanguage}:`, error);
        // Fallback to English
        const module = await import('../translations/en.ts');
        setTranslations(module.default);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${currentLanguage}"`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};