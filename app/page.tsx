"use client";

import { useEffect, useState } from "react";
import { useBackground } from "./context/backgroundContext";
import ChangeImageButton from "./components/changeImageButton";
import ElectronicClock from "./components/electronicClock";
import Image from "next/image";
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
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
        <div className="flex flex-row-reverse gap-5 absolute top-1 right-1">
          <label
            className="flex items-center cursor-pointer mb-4 transition-all hover:top-2"
            htmlFor="switch"
            aria-label="Toggle dark mode"
            id="toggleMode"
          >
            <input
              className="sr-only"
              type="checkbox"
              id="switch"
              checked={isDarkMode}
              onChange={handleSwitchChange}
            />
            <div
              className={`w-14 h-8 rounded-2xl p-1 transition-all ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <div
                className={`h-6 w-6 bg-blue-500 rounded-full shadow-md transform transition-transform ${
                  isDarkMode && "translate-x-6"
                }`}
              ></div>
            </div>
          </label>
          <p className="text-white font-bold">{isNowTimeZone}</p>
        </div>
        <Loading />
        <ChangeImageButton isDarkMode={isDarkMode} />
        <ElectronicClock isDarkMode={isDarkMode} />
        <Clock isDarkMode={isDarkMode} />
        <div className="flex gap-2 absolute right-2 bottom-2">
          <button
            className={`transition-all shadow-xl ${
              isDarkMode ? "bg-black" : "bg-white"
            } rounded-full p-3 hover:translate-y-1`}
            onClick={() => setIsGoodsOpen(!isGoodsOpen)}
          >
            <Image
              src={`${
                isDarkMode ? "/icons/heartWhite.svg" : "/icons/heartBlack.svg"
              }`}
              alt="heart"
              height={30}
              width={30}
            />
          </button>
          <button
            className={`transition-all shadow-xl ${
              isDarkMode ? "bg-black" : "bg-white"
            } rounded-full p-3 hover:translate-y-1`}
            onClick={() => setIsSettingOpen(!isSettingOpen)}
          >
            <Image
              src={`${
                isDarkMode
                  ? "/icons/settingWhite.svg"
                  : "/icons/settingBlack.svg"
              }`}
              alt="setting"
              height={30}
              width={30}
            />
          </button>
          <button
            className={`transition-all shadow-xl ${
              isDarkMode ? "bg-black" : "bg-white"
            } rounded-full p-3 hover:translate-y-1`}
            onClick={() => setIsTimeZone(!isTimeZone)}
          >
            <Image
              src={`${
                isDarkMode
                  ? "/icons/timeZoneWhite.svg"
                  : "/icons/timeZoneBlack.svg"
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
