"use client";

import { useBackgroundDesc } from "./context/backgroundDesc";
import { useEffect, useState } from "react";
import { useBackground } from "./context/backgroundContext";
import ChangeImageButton from "./components/changeImageButton";
import ElectronicClock from "./components/electronicClock";
import Image from "next/image";
import Link from "next/link";
import Setting from "./components/settingComponents/setting";
import Loading from "./components/loading/loading";
import Goods from "./components/goodsComponents/goods";
import styled from "styled-components";
import colors from "@/data/colorData";
import colorsRGB from "@/data/colorRGBData";
import Search from "./components/searchComponents/search";
import Clock from "./components/clock";
import TimeZone from "./components/timeZoneComponents/timeZone";
import axios from "axios";
import { useTimeZone } from "./context/timeZoneContext";

interface MainSelectionProps {
  $background: string;
}
const MainSelection = styled.div<MainSelectionProps>`
  ::selection {
    background: ${(props) =>
      colors.includes(props.$background)
        ? "#fff"
        : colorsRGB[props.$background.replace(".png", "")]};
    color: ${(props) =>
      colors.includes(props.$background.replace(".png", "")) ? "#fff" : "#000"};
  }
`;

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [isGoodsOpen, setIsGoodsOpen] = useState<boolean>(false);
  const [isTimeZone, setIsTimeZone] = useState<boolean>(false);
  const [isHistoriesOpen, setIsHistoriesOpen] = useState<boolean>(false);
  const { backgroundDesc } = useBackgroundDesc();
  const { background } = useBackground();
  const { isNowTimeZone } = useTimeZone();

  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [wheatherIcon, setWheatherIcon] = useState<string>("");
  const [navigatorPermission, setNavigatorPermission] =
    useState<boolean>(false);

  useEffect(() => {
    const getIsNowWeather = async () => {
      if (!navigator.permissions) {
        setNavigatorPermission(false);
        return;
      }

      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setNavigatorPermission(true);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const res = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);

            console.log(res);

            const temp = res.data.temp;
            const hum = res.data.hum;
            const wheatherIcon = res.data.weatherIcon;

            setTemperature(temp);
            setHumidity(hum);
            setWheatherIcon(wheatherIcon);
          },
          (error) => console.error(error.message),
        );
      } catch (error) {
        console.error("天気取得エラー:", error);
      }
    };

    getIsNowWeather();
    const interval = setInterval(getIsNowWeather, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (!(isDarkMode === "true" || isDarkMode === "false")) {
      localStorage.setItem("isDarkMode", "false");
      setIsDarkMode(false);
      return;
    }
    if (!isDarkMode) return;
    setIsDarkMode(JSON.parse(isDarkMode));
  }, [isDarkMode]);

  const handleSwitchChange = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", !isDarkMode ? "true" : "false");
  };

  const checkImage = (userBackgroundImage: string) => {
    if (!userBackgroundImage) {
      return "url(/initialValuePhoto.avif)";
    }

    if (userBackgroundImage.startsWith("https")) {
      return `url(${userBackgroundImage})`;
    }

    if (colors.includes(userBackgroundImage) + ".png") {
      return `url(/colors/${userBackgroundImage})`;
    } else {
      return "url(/initialValuePhoto.avif)";
    }
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      localStorage.setItem("hasVisited", JSON.stringify(true));
    }
  }, []);

  return (
    <MainSelection $background={background}>
      <div
        className="flex flex-col justify-center items-center h-screen w-full bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: checkImage(background),
        }}
      >
        <div className="flex flex-row-reverse gap-6 items-center absolute top-2 right-2 z-10">
          <label
            htmlFor="switch"
            aria-label="Toggle dark mode"
            id="toggleMode"
            className="flex items-center cursor-pointer transition-transform hover:-translate-y-1"
          >
            <input
              id="switch"
              type="checkbox"
              checked={isDarkMode}
              onChange={handleSwitchChange}
              className="sr-only"
            />
            <div
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-blue-500 rounded-full shadow-md transition-transform duration-300 ${
                  isDarkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </label>

          {backgroundDesc && background.startsWith("https") && (
            <Link
              href={backgroundDesc.userUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:-translate-y-1 transition-transform"
            >
              {backgroundDesc.userImage && (
                <Image
                  src={backgroundDesc.userImage}
                  alt="user image"
                  width={40}
                  height={40}
                  className={`rounded-full border-2 ${isDarkMode ? "border-gray-700" : "border-white"}`}
                />
              )}
              <div
                className={`${isDarkMode ? "text-gray-700" : "text-white"} text-sm leading-tight`}
              >
                <p className="font-bold">{backgroundDesc.name}</p>
                <p className="opacity-75">@{backgroundDesc.userName}</p>
              </div>
            </Link>
          )}

          {navigatorPermission && (
            <>
              {temperature !== null && humidity !== null ? (
                <div
                  className={`flex gap-1 ${isDarkMode ? "text-gray-700" : "text-white"} font-semibold`}
                >
                  <div className="flex items-center gap-2 text-sm transition-transform hover:-translate-y-1">
                    <div>
                      {temperature.toFixed(0)}℃ / {humidity}%
                    </div>
                  </div>
                  <Image
                    className="transition-transform hover:-translate-y-1"
                    src={`https://openweathermap.org/img/wn/${wheatherIcon}@2x.png`}
                    alt="weather icon"
                    height={30}
                    width={30}
                  />
                </div>
              ) : (
                <div
                  className={`${isDarkMode ? "text-gray-700" : "text-white"} text-sm`}
                >
                  Loading weather...
                </div>
              )}
            </>
          )}

          <p
            className={`text-sm font-semibold ${isDarkMode ? "text-gray-700" : "text-white"} whitespace-nowrap transition-transform hover:-translate-y-1`}
          >
            {isNowTimeZone}
          </p>
        </div>

        <Loading />
        <ChangeImageButton isDarkMode={isDarkMode} />
        <ElectronicClock isDarkMode={isDarkMode} />
        <Clock isDarkMode={isDarkMode} />
        <div className="flex gap-2 absolute right-2 bottom-2">
          <button
            className={`transition-all shadow-xl bg-opacity-50 bg-white
            } rounded-full p-3 hover:translate-y-1`}
            onClick={() => setIsGoodsOpen(!isGoodsOpen)}
          >
            <Image
              src={`${
                isDarkMode ? "/icons/heartBlack.svg" : "/icons/heartWhite.svg"
              }`}
              alt="heart"
              height={30}
              width={30}
            />
          </button>
          <button
            className={`transition-all shadow-xl bg-opacity-50 bg-white
            } rounded-full p-3 hover:translate-y-1`}
            onClick={() => setIsSettingOpen(!isSettingOpen)}
          >
            <Image
              src={`${
                isDarkMode
                  ? "/icons/settingBlack.svg"
                  : "/icons/settingWhite.svg"
              }`}
              alt="setting"
              height={30}
              width={30}
            />
          </button>
          <button
            className={`transition-all shadow-xl bg-opacity-50 
            bg-white rounded-full p-3 hover:translate-y-1`}
            onClick={() => setIsTimeZone(!isTimeZone)}
          >
            <Image
              src={`${
                isDarkMode
                  ? "/icons/timeZoneBlack.svg"
                  : "/icons/timeZoneWhite.svg"
              }`}
              alt="setting"
              height={30}
              width={30}
            />
          </button>
        </div>
        <Goods isGoodsOpen={isGoodsOpen} setIsGoodsOpen={setIsGoodsOpen} />
        <Setting
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
        />
        <TimeZone isTimeZone={isTimeZone} setIsTimeZone={setIsTimeZone} />
        <Search
          isDarkMode={isDarkMode}
          isHistoriesOpen={isHistoriesOpen}
          setIsHistoriesOpen={setIsHistoriesOpen}
        />
      </div>
    </MainSelection>
  );
}
