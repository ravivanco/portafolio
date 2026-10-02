import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language } from '../../core/domain/entities/types';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const initialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('rv-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* storage unavailable */
  }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('rv-lang', language);
    } catch {
      /* storage unavailable */
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
