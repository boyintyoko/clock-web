"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface LanguageType {
  isNowLanguage: string;
  setIsNowLanguage: (isNowLanguage: string) => void;
}

const LanguageContext = createContext<LanguageType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isNowLanguage, setIsNowLanguage] = useState<string>("ja");

  useEffect(() => {
    const language = localStorage.getItem("language");

    if (!(language === "en" || language === "it" || language === "ja")) {
      localStorage.setItem("language", "ja");
      return;
    }

    setIsNowLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ isNowLanguage, setIsNowLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
