import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from '../i18n/translations';
import { useAuth } from './AuthContext';
import { updateUserProfileDoc } from '../services/firebase';

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [currentLang, setCurrentLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('dermavision_lang');
    if (saved === 'en' || saved === 'ta' || saved === 'hi') {
      return saved as Language;
    }
    return 'en';
  });

  useEffect(() => {
    const savedLoc = localStorage.getItem('dermavision_lang');
    if (!savedLoc && userProfile && typeof userProfile === 'object' && 'preferredLanguage' in userProfile && userProfile.preferredLanguage) {
      const dbLang = userProfile.preferredLanguage as Language;
      if (dbLang === 'en' || dbLang === 'ta' || dbLang === 'hi') {
        setCurrentLangState(dbLang);
        localStorage.setItem('dermavision_lang', dbLang);
      }
    }
  }, [userProfile]);

  const setLanguage = async (newLang: Language) => {
    setCurrentLangState(newLang);
    localStorage.setItem('dermavision_lang', newLang);

    if (user?.uid) {
      try {
        await updateUserProfileDoc(user.uid, { preferredLanguage: newLang });
      } catch (err) {
        console.warn('Firestore language update notice:', err);
      }
    }
  };

  const t = translations[currentLang] || translations['en'];

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
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
