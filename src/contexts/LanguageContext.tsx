import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation } from '@/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof import('@/i18n').translations.pt) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem('language');
    if (saved === 'pt' || saved === 'en') {
      return saved;
    }
    // Try to detect from browser language
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'pt' ? 'pt' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: keyof typeof import('@/i18n').translations.pt) => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
