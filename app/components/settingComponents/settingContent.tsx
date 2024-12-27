"use client";

import { useLanguage } from "@/app/context/languageContext";
import { useTime } from "@/app/context/timeContext";
import { useEffect } from "react";

export default function SettingContent() {
  const { setIsNowLanguage, isNowLanguage } = useLanguage();
  const { setIsNowTime, isNowTime } = useTime();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setIsNowLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFormat = e.target.value;
    setIsNowTime(Number(selectedFormat));
    localStorage.setItem("time", selectedFormat);
  };

  useEffect(() => {
    const time = localStorage.getItem("time");
    const language = localStorage.getItem("language");
    if (!(time || language)) {
      return;
    }
    setIsNowTime(Number(time));
    setIsNowLanguage(String(language));
  }, [setIsNowLanguage, setIsNowTime]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <p className="font-black text-xl mb-2">
          {(() => {
            if (isNowLanguage === "en") {
              return "Time format";
            } else if (isNowLanguage === "it") {
              return "Formato dell'orologio";
            }
            return "時間形式";
          })()}
        </p>
        <select
          onChange={handleFormatChange}
          value={isNowTime}
          className="border rounded-lg p-2 w-full"
        >
          <option value="24">
            {(() => {
              if (isNowLanguage === "en") {
                return "24-hour format.";
              } else if (isNowLanguage === "it") {
                return "Formato 24 ore.";
              }
              return "24時間形式";
            })()}
          </option>
          <option value="12">
            {(() => {
              if (isNowLanguage === "en") {
                return "12-hour format (AM/PM).";
              } else if (isNowLanguage === "it") {
                return "Formato 12 ore (AM/PM).";
              }
              return "12時間形式 (AM/PM)";
            })()}
          </option>
        </select>
      </div>

      <div className="mb-6">
        <p className="font-black text-xl mb-2">
          {(() => {
            if (isNowLanguage === "en") {
              return "Language.";
            } else if (isNowLanguage === "it") {
              return "Lingua.";
            }
            return "言語";
          })()}
        </p>
        <select
          value={isNowLanguage}
          onChange={handleLanguageChange}
          className="border rounded-lg p-2 w-full"
        >
          <option value="en">English</option>
          <option value="it">Italian</option>
          <option value="ja">日本語</option>
        </select>
      </div>
    </div>
  );
}
