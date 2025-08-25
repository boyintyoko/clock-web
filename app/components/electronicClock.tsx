"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/languageContext";
import { useTime } from "../context/timeContext";
import { useTimeZone } from "../context/timeZoneContext";

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
  const { isNowTimeZone } = useTimeZone();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeZone = isNowTimeZone || "Asia/Tokyo";

      const formatter = new Intl.DateTimeFormat("en-US", {
        hour12: isNowTime === 12,
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "short",
        day: "numeric",
        month: "numeric",
      });

      const parts = formatter.formatToParts(now);
      const getPart = (type: string) =>
        parts.find((p) => p.type === type)?.value;

      const currentHour = getPart("hour");
      const currentMinute = getPart("minute");
      const currentSecond = getPart("second");
      const currentDay = getPart("weekday");
      const currentDate = getPart("day");
      const currentMonth = getPart("month");
      const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";

      setHour(currentHour ? Number(currentHour) : 0);
      setMinute(currentMinute ? Number(currentMinute) : 0);
      setSecond(currentSecond ? Number(currentSecond) : 0);

      const weekMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };
      setDay(currentDay ? (weekMap[currentDay] ?? 0) : 0);

      setDate(currentDate ? Number(currentDate) : 0);
      setMonth(currentMonth ? Number(currentMonth) : 0);
      setPeriod(dayPeriod.toUpperCase());
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
  }, [isNowLanguage, isNowTime, isNowTimeZone]);

  return (
    <div id="electronicClock">
      <div className="relative flex justify-center bg-opacity-25 bg-white items-center w-64 rounded-xl mb-2 shadow-md transition-all top-0 hover:top-1">
        <div
          className={`flex items-center justify-center transition-all gap-5 w-full text-sm ${
            isDarkMode ? "text-black" : "text-white"
          }`}
        >
          <div>{days[day]}</div>
          <div>
            {isNowLanguage === "en" ? (
              <div>
                {month.toString().padStart(2, "0")}/
                {date.toString().padStart(2, "0")}
              </div>
            ) : isNowLanguage === "it" ? (
              <div>
                {date.toString().padStart(2, "0")}/
                {month.toString().padStart(2, "0")}
              </div>
            ) : (
              <div>
                {month.toString().padStart(2, "0")}/
                {date.toString().padStart(2, "0")}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`relative flex justify-center bg-opacity-25 bg-white items-center w-64 h-20 rounded-xl mb-6 shadow-md transition-all top-0 hover:top-1 ${
          isDarkMode ? "text-black" : "text-white"
        }`}
      >
        <div className="flex items-end">
          <div className="flex text-3xl">
            {hour.toString().padStart(2, "0")}
          </div>
          <div className="text-3xl mx-1">:</div>
          <div className="flex text-3xl">
            {minute.toString().padStart(2, "0")}
          </div>
          <div className="text-3xl mx-1">.</div>
          <div className="flex text-2xl">
            {second.toString().padStart(2, "0")}
          </div>
          {isNowTime === 12 && (
            <div className="flex h-full items-end text-sm ml-2">{period}</div>
          )}
        </div>
      </div>
    </div>
  );
}
