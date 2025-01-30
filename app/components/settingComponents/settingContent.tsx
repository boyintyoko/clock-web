import React, { useEffect } from "react";
import { useLanguage } from "@/app/context/languageContext";
import { useTime } from "@/app/context/timeContext";
import { useRouter } from "next/navigation";
export default function SettingContent() {
  const { setIsNowLanguage, isNowLanguage } = useLanguage();
  const { setIsNowTime, isNowTime } = useTime();
  const router = useRouter();

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
    if (time) setIsNowTime(Number(time));
    if (language) setIsNowLanguage(language);
    if (!language) setIsNowLanguage("en");
  }, [setIsNowLanguage, setIsNowTime]);

  const clearMemories = () => {
    localStorage.removeItem("background");
    localStorage.removeItem("goods");
    localStorage.removeItem("history");
    localStorage.removeItem("language");
    localStorage.removeItem("isDarkMode");
    localStorage.removeItem("time");
    router.refresh();
  };

  return (
    <div className="space-y-6 overflow-auto">
      <div>
        <label className="block font-bold text-lg mb-2">
          {isNowLanguage === "en"
            ? "Time format"
            : isNowLanguage === "it"
            ? "Formato dell'orologio"
            : "時間形式"}
        </label>
        <select
          onChange={handleFormatChange}
          value={isNowTime}
          className="block w-full border rounded-lg p-2"
        >
          <option value="24">
            {isNowLanguage === "en"
              ? "24-hour format"
              : isNowLanguage === "it"
              ? "Formato 24 ore"
              : "24時間形式"}
          </option>
          <option value="12">
            {isNowLanguage === "en"
              ? "12-hour format (AM/PM)"
              : isNowLanguage === "it"
              ? "Formato 12 ore (AM/PM)"
              : "12時間形式 (AM/PM)"}
          </option>
        </select>
      </div>

      <div>
        <label className="block font-bold text-lg mb-2">
          {isNowLanguage === "en"
            ? "Language"
            : isNowLanguage === "it"
            ? "Lingua"
            : "言語"}
        </label>
        <select
          value={isNowLanguage}
          onChange={handleLanguageChange}
          className="block w-full border rounded-lg p-2"
        >
          <option value="en">English</option>
          <option value="it">Italian</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      <div>
        <button
          onClick={clearMemories}
          className="border-red-500 border p-3 rounded-full text-red-500"
        >
          Clear memories
        </button>
      </div>
    </div>
  );
}
