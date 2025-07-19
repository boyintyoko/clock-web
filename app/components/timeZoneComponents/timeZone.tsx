import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TimeZoneMask from "./timeZoneMask";
import TimeZoneContent from "./timeZoneContent";
import { useLanguage } from "@/app/context/languageContext";

interface SettingType {
  isTimeZone: boolean;
  setIsTimeZone: (isOpen: boolean) => void;
}

export default function TimeZone({ isTimeZone, setIsTimeZone }: SettingType) {
  const { isNowLanguage } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTimeZoneCount, setShowTimeZoneCount] = useState<number>(0);

  useEffect(() => {
    const currentLoader = scrollRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowTimeZoneCount((prev) => prev + 10);
        }
      },
      { threshold: 0.5 },
    );

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [showTimeZoneCount]);

  return (
    <div
      className={`absolute inset-0 flex justify-center items-center transition-all ${
        isTimeZone ? "visible opacity-100" : "invisible opacity-0"
      }`}
      id="timeZone"
    >
      <TimeZoneMask isTimeZone={isTimeZone} setIsTimeZone={setIsTimeZone} />
      <div
        ref={scrollRef}
        className={`h-96 w-96 bg-white rounded-2xl shadow-xl transform transition-transform overflow-auto ${
          isTimeZone ? "scale-100" : "scale-95"
        }`}
        style={{
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTimeZone(!isTimeZone)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
              aria-label="Go back"
            >
              <Image src="/back.png" alt="Back" height={25} width={25} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {isNowLanguage === "en"
                ? "Time zone"
                : isNowLanguage === "it"
                  ? "Fuso orario"
                  : "タイムゾーン"}
            </h2>
          </div>
        </div>
        <div className="p-6">
          <TimeZoneContent />
        </div>
      </div>
    </div>
  );
}
