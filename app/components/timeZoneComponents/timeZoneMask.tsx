import React from "react";

interface SettingType {
  isTimeZone: boolean;
  setIsTimeZone: (isOpen: boolean) => void;
}

export default function TimeZoneMask({
  isTimeZone,
  setIsTimeZone,
}: SettingType) {
  return (
    <div
      onClick={() => setIsTimeZone(false)}
      className={`absolute inset-0 z-20 bg-black transition-opacity ${
        isTimeZone ? "opacity-50" : "opacity-0 pointer-events-none"
      }`}
      role="presentation"
    ></div>
  );
}
