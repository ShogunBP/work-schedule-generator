import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface TranslationContextType {
  t: (key: TranslationKey) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  getWeekDays: () => string[];
  formatDate: (date: Date) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved && (saved === 'pt' || saved === 'en') ? saved : 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const value = translations[language][key];
    // Se for um array (weekDays), retornar a chave como fallback
    return typeof value === 'string' ? value : key;
  }, [language]);

  const getWeekDays = useCallback((): string[] => {
    return translations[language].weekDays;
  }, [language]);

  const formatDate = useCallback((date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', options);
  }, [language]);

  return (
    <TranslationContext.Provider
      value={{
        t,
        language,
        setLanguage,
        getWeekDays,
        formatDate
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
