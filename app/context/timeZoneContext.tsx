"use client";

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";

interface TimeZoneType {
  isNowTimeZone: string;
  setIsNowTimeZone: (isNowTimeZone: string) => void;
}

const TimeZoneContext = createContext<TimeZoneType | undefined>(undefined);

export const TimeZoneProvider = ({ children }: { children: ReactNode }) => {
  const [isNowTimeZone, setIsNowTimeZone] = useState<string>("");

  useEffect(() => {
    const timeZone = localStorage.getItem("timeZone");
    if (!timeZone) return;
    setIsNowTimeZone(timeZone);
  }, []);

  return (
    <TimeZoneContext.Provider value={{ isNowTimeZone, setIsNowTimeZone }}>
      {children}
    </TimeZoneContext.Provider>
  );
};

export const useTimeZone = () => {
  const context = useContext(TimeZoneContext);
  if (!context) {
    throw new Error("useTimeZone must be used within a TimeZoneContext");
  }
  return context;
};
