import React from "react";
import SettingMask from "./settingMask";
import SettingContent from "./settingContent";
import Image from "next/image";
import { useLanguage } from "@/app/context/languageContext";

interface SettingType {
  isSettingOpen: boolean;
  setIsSettingOpen: (isOpen: boolean) => void;
}

export default function Setting({
  isSettingOpen,
  setIsSettingOpen,
}: SettingType) {
  const { isNowLanguage } = useLanguage();

  return (
    <div
      className={`absolute inset-0 flex justify-center items-center transition-all ${
        isSettingOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <SettingMask
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
      />

      <div
        className={`w-full max-w-md bg-white rounded-2xl shadow-xl transform transition-transform ${
          isSettingOpen ? "scale-100" : "scale-95"
        }`}
        style={{
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingOpen(!isSettingOpen)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
              aria-label="Go back"
            >
              <Image src="/back.png" alt="Back" height={25} width={25} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {isNowLanguage === "en"
                ? "Settings"
                : isNowLanguage === "it"
                ? "Impostazione"
                : "設定"}
            </h2>
          </div>
        </div>
        <div className="p-6">
          <SettingContent />
        </div>
      </div>
    </div>
  );
}
