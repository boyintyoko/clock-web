"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/languageContext";
import { useTime } from "../context/timeContext";

interface isDarkModeType {
  isDarkMode: boolean;
}

export default function ElectronicClock({ isDarkMode }: isDarkModeType) {
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [date, setDate] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [period, setPeriod] = useState<string>("");

  const [days, setDays] = useState<string[]>([]);
  const { isNowLanguage } = useLanguage();
  const { isNowTime } = useTime();

  const formatHour = (hour: number): number => {
    if (isNowTime === 12) {
      return hour % 12 === 0 ? 12 : hour % 12;
    }
    return hour;
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      setHour(formatHour(currentHour));
      setMinute(now.getMinutes());
      setSecond(now.getSeconds());
      setDay(now.getDay());
      setDate(now.getDate());
      setMonth(now.getMonth() + 1);
      setPeriod(currentHour >= 12 ? "PM" : "AM");
    };

    (() => {
      if (isNowLanguage === "en") {
        setDays(["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."]);
      } else if (isNowLanguage === "it") {
        setDays(["Dom.", "Lun.", "Mar.", "Mer.", "Gio.", "Ven.", "Sab."]);
      } else {
        setDays([
          "日曜日",
          "月曜日",
          "火曜日",
          "水曜日",
          "木曜日",
          "金曜日",
          "土曜日",
        ]);
      }
    })();

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isNowLanguage, isNowTime]);

  return (
    <div>
      <div className="relative flex justify-center bg-opacity-25 bg-white items-center w-64 rounded-xl mb-2 shadow-md transition-all top-0 hover:top-1">
        <div
          className={`flex items-center justify-center transition-all gap-5 w-full text-sm ${
            isDarkMode ? "text-black" : "text-white"
          }`}
        >
          <div>{days[day]}</div>
          <div>
            {month.toString().padStart(2, "0")}/
            {date.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
      <div
        className={`relative flex justify-center bg-opacity-25 bg-white items-center w-64 h-20 rounded-xl mb-6 shadow-md transition-all top-0 hover:top-1 ${
          isDarkMode ? "text-black" : "text-white"
        }`}
      >
        <div className="flex items-center text-3xl">
          {hour.toString().padStart(2, "0")}
        </div>
        <div className="text-3xl mx-1">:</div>
        <div className="flex items-center text-3xl">
          {minute.toString().padStart(2, "0")}
        </div>
        <div className="text-3xl mx-1">:</div>
        <div className="flex items-center text-3xl">
          {second.toString().padStart(2, "0")}
        </div>
        {isNowTime === 12 && (
          <div className="flex h-full items-end text-sm ml-2">{period}</div>
        )}
      </div>
    </div>
  );
}
