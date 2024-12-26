import React from "react";
import SettingMask from "./settingMask";
import SettingContent from "./settingContent";
import Image from "next/image";

interface SettingType {
  isSettingOpen: boolean;
  setIsSettingOpen: (isOpen: boolean) => void;
}

export default function Setting({
  isSettingOpen,
  setIsSettingOpen,
}: SettingType) {
  return (
    <div
      className={`absolute inset-0 flex justify-center items-center ${
        !isSettingOpen ? "pointer-events-none" : ""
      }`}
    >
      <SettingMask
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
      />

      <div
        className={`z-50 w-96 h-96 bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out transform ${
          isSettingOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSettingOpen(!isSettingOpen)}
              className="flex justify-center items-center"
            >
              <Image src="/back.png" alt="back image" height={25} width={25} />
            </button>
            <h2 className="text-2xl font-extrabold text-gray-800">Settings</h2>
          </div>
        </div>
        <div className="p-6">
          <SettingContent />
        </div>
      </div>
    </div>
  );
}
