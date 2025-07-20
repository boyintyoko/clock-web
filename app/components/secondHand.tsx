"use client";
import { useEffect, useState } from "react";
import { useTimeZone } from "../context/timeZoneContext";

interface isDarkModeType {
  isDarkMode: boolean;
}

export default function SecondHand({ isDarkMode }: isDarkModeType) {
  const [angle, setAngle] = useState(0);
  const { isNowTimeZone } = useTimeZone();

  useEffect(() => {
    if (!isNowTimeZone) return;

    const formatter = new Intl.DateTimeFormat("ja-JP", {
      timeZone: isNowTimeZone,
      second: "2-digit",
    });

    const updateAngle = () => {
      const parts = formatter.formatToParts(new Date());
      const secondStr = parts.find((p) => p.type === "second")?.value ?? "0";
      const seconds = parseInt(secondStr, 10);
      setAngle((360 + seconds * 6 - 90) % 360);
    };

    updateAngle();
    const interval = setInterval(updateAngle, 250);

    return () => clearInterval(interval);
  }, [isNowTimeZone]);

  return (
    <div
      className={`absolute left-1/2 transition-all ease ${
        isDarkMode ? "bg-black" : "bg-white"
      } w-44 `}
      style={{
        height: "2px",
        borderRadius: "9999px",
        transformOrigin: "0% 50%",
        transform: `rotate(${angle}deg)`,
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.4)",
      }}
    ></div>
  );
}
