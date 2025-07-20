"use client";

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
import { useTimeZone } from "./context/timeZoneContext";
import { useBackgroundDesc } from "./context/backgroundDesc";

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
  const [user, setUser] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [isGoodsOpen, setIsGoodsOpen] = useState<boolean>(false);
  const [isTimeZone, setIsTimeZone] = useState<boolean>(false);
  const [isHistoriesOpen, setIsHistoriesOpen] = useState<boolean>(false);
  const { backgroundDesc } = useBackgroundDesc();
  const { background } = useBackground();
  const { isNowTimeZone } = useTimeZone();

  useEffect(() => {
    setUser(background);
  }, [background]);

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

  const checkImage = (user: string) => {
    if (!user) {
      return "url(/initialValuePhoto.avif)";
    }

    if (user.startsWith("https")) {
      return `url(${user})`;
    }

    if (colors.includes(user) + ".png") {
      return `url(/colors/${user})`;
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
          backgroundImage: checkImage(user),
        }}
      >
        <div className="flex flex-row-reverse gap-6 items-center absolute top-2 right-2 z-10">
          {/* ダークモードスイッチ */}
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

          <p
            className={`text-sm font-semibold ${isDarkMode ? "text-gray-700" : "text-white"} whitespace-nowrap transition-transform hover:-translate-y-1`}
          >
            {isNowTimeZone}
          </p>

          {backgroundDesc && (
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
