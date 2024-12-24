"use client";
import { useEffect, useState } from "react";

interface isDarkModeType {
  isDarkMode: boolean;
}

export default function MinuteHand({ isDarkMode }: isDarkModeType) {
  const [minutes, setMinutes] = useState<number>();
  useEffect(() => {
    const getMinutes = () => {
      const minutes = new Date().getMinutes();
      setMinutes(minutes * 6 - 90);
    };
    getMinutes();
    setInterval(getMinutes, 100);
  });
  return (
    <div
      className={`absolute left-1/2 transition-all ${
        isDarkMode ? "bg-black" : "bg-white"
      } w-44 transition-all`}
      style={{
        height: "4px",
        borderRadius: "9999px",
        transformOrigin: "0% 50%",
        transform: `rotate(${minutes}deg)`,
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.4)",
      }}
    ></div>
  );
}
