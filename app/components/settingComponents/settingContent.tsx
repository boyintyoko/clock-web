import { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/languageContext";

export default function SettingContent() {
  const [language, setLanguage] = useState("ja");

  const { setIsNowLanguage, isNowLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
    setIsNowLanguage(selectedLanguage);
  };

  useEffect(() => {
    const language = localStorage.getItem("language");
    if (!language) {
      setIsNowLanguage("ja");
      return;
    }
    setLanguage(language);
    setIsNowLanguage(language);
  }, [setIsNowLanguage]);

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
        <select className="border rounded-lg p-2 w-full">
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
            {" "}
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
          value={language}
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
