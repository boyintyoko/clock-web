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
      onClick={() => setIsSettingOpen(false)}
      className={`absolute inset-0 z-20 bg-black transition-opacity ${
        isSettingOpen ? "opacity-50" : "opacity-0 pointer-events-none"
      }`}
      role="presentation"
    ></div>
  );
}
