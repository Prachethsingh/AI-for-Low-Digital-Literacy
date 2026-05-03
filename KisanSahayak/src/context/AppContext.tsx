/**
 * App-level context: language, eligibility answers, backend URL.
 * All state is strongly typed. No legacy methods.
 */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'kannada' | 'english';

export interface EligibilityAnswers {
  is_farmer: boolean | null;
  has_aadhaar: boolean | null;
  is_woman: boolean | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  aadhaar: string;
  pan: string;
}

export interface UserHistory {
  lastQuery: string;
  eligibleSchemes: string[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  answers: EligibilityAnswers;
  setAnswer: (key: keyof EligibilityAnswers, value: boolean) => void;
  resetAnswers: () => void;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChatHistory: () => void;
  history: UserHistory;
  updateHistory: (update: Partial<UserHistory>) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const defaultAnswers: EligibilityAnswers = {
  is_farmer: null,
  has_aadhaar: null,
  is_woman: null,
};

const AppContext = createContext<AppContextType>({
  language: 'kannada',
  setLanguage: () => {},
  toggleLanguage: () => {},
  answers: defaultAnswers,
  setAnswer: () => {},
  resetAnswers: () => {},
  backendUrl: 'http://10.0.2.2:8000',
  setBackendUrl: () => {},
  chatHistory: [],
  addChatMessage: () => {},
  clearChatHistory: () => {},
  history: { lastQuery: '', eligibleSchemes: [] },
  updateHistory: () => {},
  userProfile: null,
  setUserProfile: () => {},
  isLoggedIn: false,
  logout: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('kannada');
  const [answers, setAnswers] = useState<EligibilityAnswers>(defaultAnswers);
  const [backendUrl, setBackendUrl] = useState('http://10.0.2.2:8000');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<UserHistory>({ lastQuery: '', eligibleSchemes: [] });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Persistence
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('language');
        if (savedLang) setLanguage(savedLang as Language);

        const savedAnswers = await AsyncStorage.getItem('answers');
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

        const savedChat = await AsyncStorage.getItem('chatHistory');
        if (savedChat) setChatHistory(JSON.parse(savedChat));

        const savedHistory = await AsyncStorage.getItem('history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to load state', e);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('language', language);
    AsyncStorage.setItem('answers', JSON.stringify(answers));
    AsyncStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    AsyncStorage.setItem('history', JSON.stringify(history));
    if (userProfile) {
      AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
    } else {
      AsyncStorage.removeItem('userProfile');
    }
  }, [language, answers, chatHistory, history, userProfile]);

  const toggleLanguage = () =>
    setLanguage(l => (l === 'kannada' ? 'english' : 'kannada'));

  const setAnswer = (key: keyof EligibilityAnswers, value: boolean) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  const resetAnswers = () => setAnswers(defaultAnswers);

  const addChatMessage = (msg: ChatMessage) =>
    setChatHistory(prev => [...prev, msg]);

  const clearChatHistory = () => setChatHistory([]);

  const updateHistory = (update: Partial<UserHistory>) =>
    setHistory(prev => ({ ...prev, ...update }));

  const logout = () => {
    setUserProfile(null);
    setChatHistory([]);
    setHistory({ lastQuery: '', eligibleSchemes: [] });
    resetAnswers();
  };

  const isLoggedIn = !!userProfile;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        answers,
        setAnswer,
        resetAnswers,
        backendUrl,
        setBackendUrl,
        chatHistory,
        addChatMessage,
        clearChatHistory,
        history,
        updateHistory,
        userProfile,
        setUserProfile,
        isLoggedIn,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
