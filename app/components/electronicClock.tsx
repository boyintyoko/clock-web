"use client";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHour(now.getHours());
      setMinute(now.getMinutes());
      setSecond(now.getSeconds());
      setDay(now.getDay());
      setDate(now.getDate());
      setMonth(now.getMonth() + 1);
      setPeriod(hour >= 12 ? "PM" : "AM");
    };

    setDays(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [hour]);

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
        <div className="flex h-full items-end  text-sm ml-2">{period}</div>
      </div>
    </div>
  );
}
