"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface BackgroundContextType {
  background: string;
  setBackground: (background: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [background, setBackground] = useState<string>("");

  useEffect(() => {
    const url = localStorage.getItem("background");
    if (!url) return;
    setBackground(url);
  }, []);

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
};
