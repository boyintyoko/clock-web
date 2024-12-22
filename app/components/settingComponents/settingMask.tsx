import React from "react";

interface SettingType {
  isSettingOpen: boolean;
  setIsSettingOpen: (isOpen: boolean) => void;
}

export default function SettingMask({
  isSettingOpen,
  setIsSettingOpen,
}: SettingType) {
  return (
    <div
      onClick={() => setIsSettingOpen(!isSettingOpen)}
      className={`absolute inset-0 bg-black z-40 transition-opacity ${
        isSettingOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      }`}
    ></div>
  );
}
