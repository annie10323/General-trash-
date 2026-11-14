import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
}

const STORAGE_KEY = 'ecosort_language_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && ['zh-TW', 'en', 'ja'].includes(saved)) {
        return saved;
      }
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) return 'en';
      if (browserLang.startsWith('ja')) return 'ja';
    } catch (e) {}
    return 'zh-TW';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    const dict = TRANSLATIONS[language] as any;
    let current = dict;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to zh-TW
        const fallbackDict = TRANSLATIONS['zh-TW'] as any;
        let fbCurrent = fallbackDict;
        for (const fbKey of keys) {
          if (fbCurrent && typeof fbCurrent === 'object' && fbKey in fbCurrent) {
            fbCurrent = fbCurrent[fbKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fbCurrent === 'string' ? fbCurrent : fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

