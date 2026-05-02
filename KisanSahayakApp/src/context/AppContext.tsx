/**
 * App-level context: language, eligibility answers, backend URL.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'kannada' | 'english';

export interface EligibilityAnswers {
  is_farmer: boolean | null;
  has_aadhaar: boolean | null;
  is_woman: boolean | null;
}

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  answers: EligibilityAnswers;
  setAnswer: (key: keyof EligibilityAnswers, value: boolean) => void;
  resetAnswers: () => void;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
}

const defaultAnswers: EligibilityAnswers = {
  is_farmer: null,
  has_aadhaar: null,
  is_woman: null,
};

const AppContext = createContext<AppContextType>({
  language: 'kannada',
  toggleLanguage: () => {},
  answers: defaultAnswers,
  setAnswer: () => {},
  resetAnswers: () => {},
  backendUrl: 'http://10.0.2.2:8000', // Android emulator → localhost
  setBackendUrl: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('kannada');
  const [answers, setAnswers] = useState<EligibilityAnswers>(defaultAnswers);
  const [backendUrl, setBackendUrl] = useState('http://10.0.2.2:8000');

  const toggleLanguage = () =>
    setLanguage(l => (l === 'kannada' ? 'english' : 'kannada'));

  const setAnswer = (key: keyof EligibilityAnswers, value: boolean) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  const resetAnswers = () => setAnswers(defaultAnswers);

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        answers,
        setAnswer,
        resetAnswers,
        backendUrl,
        setBackendUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
