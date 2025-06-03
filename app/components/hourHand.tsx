"use client";
import { useEffect, useState } from "react";

interface isDarkModeType {
  isDarkMode: boolean;
}

export default function HourHand({ isDarkMode }: isDarkModeType) {
  const [hourAngle, setHourAngle] = useState<number>(0);

  useEffect(() => {
    const updateHourAngle = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const angle = ((360 + (hours % 12) * 30 + minutes * 0.5 - 90) % 360);
      setHourAngle(angle);
    };

    updateHourAngle();
    const intervalId = setInterval(updateHourAngle, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`absolute left-1/2 transition-all ${
        isDarkMode ? "bg-black" : "bg-white"
      } w-20`}
      style={{
        height: "4px",
        borderRadius: "9999px",
        transformOrigin: "0% 50%",
        transform: `rotate(${hourAngle}deg)`,
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.4)",
        transition: "transform 0.2s linear",
      }}
    ></div>
  );
}
