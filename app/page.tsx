"use client";

import { useEffect, useState } from "react";
import { useBackground } from "./context/backgroundContext";
import ChangeImageButton from "./components/changeImageButton";
import ElectronicClock from "./components/electronicClock";
import SecondHand from "./components/secondHand";
import MinuteHand from "./components/minuteHand";
import HourHand from "./components/hourHand";
import Image from "next/image";
import Setting from "./components/settingComponents/setting";
import Loading from "./components/loading/loading";
import Goods from "./components/goodsComponents/goods";
import styled from "styled-components";
import colors from "@/data/colorData";
import colorsRGB from "@/data/colorsDataRGB";
import Search from "./components/searchComponents/search";

interface MainSelectionProps {
  $background: string;
}

const MainSelection = styled.div<MainSelectionProps>`
  ::selection {
    background: ${(props) =>
      colors.includes(props.$background)
        ? colorsRGB[props.$background]
        : "#fff"};
    color: ${(props) => (colors.includes(props.$background) ? "#fff" : "#000")};
  }
`;

export default function Home() {
  const [user, setUser] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [isGoodsOpen, setIsGoodsOpen] = useState<boolean>(false);
  const { background } = useBackground();

  useEffect(() => {
    setUser(background);
  }, [background]);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (!isDarkMode) return;
    setIsDarkMode(JSON.parse(isDarkMode));
  }, []);

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

    return `url(/color/${user}.png)`;
  };

  return (
    <MainSelection $background={background}>
      <div
        className="flex flex-col justify-center items-center h-screen w-full bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: checkImage(user),
        }}
      >
        <Loading />
        <label
          className="absolute top-1 right-1 flex items-center cursor-pointer mb-4 transition-all hover:top-2"
          htmlFor="switch"
          aria-label="Toggle dark mode"
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

        <ChangeImageButton isDarkMode={isDarkMode} />
        <ElectronicClock isDarkMode={isDarkMode} />
        <div
          className={`relative flex justify-center items-center h-96 w-96 rounded-full border-8 ${
            isDarkMode ? "border-black" : "border-white"
          } shadow-2xl transition-all top-0 hover:top-1 bg-white bg-opacity-25 backdrop-blur-md hover:backdrop-blur-0`}
        >
          {[...Array(12)].map((_, index) => {
            const number = (index + 12) % 12 || 12;
            const rotation = index * 30;
            return (
              <div
                key={index}
                className={`absolute transition-all flex justify-center items-center w-10 ${
                  isDarkMode ? "text-black" : "text-white"
                }  h-10 font-black text-xl`}
                style={{
                  transform: `rotate(${rotation}deg) translate(0, -140px) rotate(-${rotation}deg)`,
                }}
              >
                {number}
              </div>
            );
          })}
          <div
            className={`dot h-5 w-5 rounded-full transition-all ${
              isDarkMode ? "bg-black" : "bg-white"
            }  z-10`}
            style={{
              boxShadow: `0px 0px 4px ${isDarkMode ? "#000" : "#fff"}`,
            }}
          ></div>
          <SecondHand isDarkMode={isDarkMode} />
          <MinuteHand isDarkMode={isDarkMode} />
          <HourHand isDarkMode={isDarkMode} />
        </div>
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
        </div>
        <Goods isGoodsOpen={isGoodsOpen} setIsGoodsOpen={setIsGoodsOpen} />
        <Setting
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
        />
        <Search isDarkMode={isDarkMode}/>
      </div>
    </MainSelection>
  );
}
