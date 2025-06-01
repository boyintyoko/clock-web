"use client";
import { useEffect, useState } from "react";

interface isDarkModeType {
  isDarkMode: boolean;
}

export default function SecondHand({ isDarkMode }: isDarkModeType) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const updateAngle = () => {
      const seconds = new Date().getSeconds();

      setAngle(seconds * 6 - 90);
      console.log(angle);
    };

    updateAngle();
    const interval = setInterval(updateAngle, 1000);

    return () => clearInterval(interval);
  }, [angle]);

  return (
    <div
      className={`absolute left-1/2 transition-all ${
        isDarkMode ? "bg-black" : "bg-white"
      } w-44  `}
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
