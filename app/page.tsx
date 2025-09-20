"use client";

import {useEffect, useState} from "react";
import {useBackground} from "./context/backgroundContext";
import ElectronicClock from "./components/electronicClock";
import Loading from "./components/loading/loading";
import styled from "styled-components";
import colors from "@/data/colorData";
import colorsRGB from "@/data/colorRGBData";
import Search from "./components/searchComponents/search";
import Clock from "./components/clock";
import {useTimeZone} from "./context/timeZoneContext";
import Modal from "./components/modalComnponents/main"
import SettingContent from "./components/modalComnponents/modalContents/settingContent";
import TimeZoneContent from "./components/modalComnponents/modalContents/timeZoneContent";
import GoodsContent from "./components/modalComnponents/modalContents/goodsContent";
import ModalButton from "./components/modalComnponents/modalButton";
import HeaderMain from "./components/header/main";
import LinkSettingContent from "./components/modalComnponents/modalContents/linkSettingContent";

interface MainSelectionProps {
  $background: string;
}

interface UrlItem {
  link: string;
  url: string;
  alt: string;
  id: number;
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
  const [isTimeZoneOpen, setIsTimeZoneOpen] = useState<boolean>(false);
  const [isHistoriesOpen, setIsHistoriesOpen] = useState<boolean>(false);
  const {background} = useBackground();
  const {isNowTimeZone} = useTimeZone();
  const [temperatureUnits, setTempratureUnits] = useState<string>("F");
  const [isLinkSettingOpen, setIsLinkSettingOpen] = useState<boolean>(false);
  const [urls, setUrls] = useState<UrlItem[]>([]);


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
        <HeaderMain isDarkMode={isDarkMode} isNowTimeZone={isNowTimeZone} setIsDarkMode={setIsDarkMode} temperatureUnits={temperatureUnits} setTempratureUnits={setTempratureUnits} />

        <Loading />
        <ElectronicClock isDarkMode={isDarkMode} />
        <Clock isDarkMode={isDarkMode} />
        <div>
          <div className="flex gap-2 absolute right-2 bottom-2">
            <ModalButton isOpen={isGoodsOpen} setIsOpen={setIsGoodsOpen} isDarkMode={isDarkMode} blackImageUrl={"/icons/heartBlack.svg"} whiteImageUrl={"/icons/heartWhite.svg"} />
            <ModalButton isOpen={isSettingOpen} setIsOpen={setIsSettingOpen} isDarkMode={isDarkMode} blackImageUrl={"/icons/settingBlack.svg"} whiteImageUrl={"/icons/settingWhite.svg"} />
            <ModalButton isOpen={isTimeZoneOpen} setIsOpen={setIsTimeZoneOpen} isDarkMode={isDarkMode} blackImageUrl={"/icons/timeZoneBlack.svg"} whiteImageUrl={"/icons/timeZoneWhite.svg"} />
          </div>


          <Search
            isDarkMode={isDarkMode}
            isHistoriesOpen={isHistoriesOpen}
            setIsHistoriesOpen={setIsHistoriesOpen}
            setIsLinkSettingOpen={setIsLinkSettingOpen}
            isLinkSettingOpen={isLinkSettingOpen}
            urls={urls}
            setUrls={setUrls}
          />

        </div>
        <Modal isOpen={isSettingOpen} setIsOpen={setIsSettingOpen} title="Setting">
          <SettingContent isSettingOpen={isSettingOpen} setIsSettingOpen={setIsSettingOpen} temperatureUnits={temperatureUnits} setTemperatureUnits={setTempratureUnits} />
        </Modal>

        <Modal isOpen={isTimeZoneOpen} setIsOpen={setIsTimeZoneOpen} title="Time zone">
          <TimeZoneContent />
        </Modal>

        <Modal isOpen={isGoodsOpen} setIsOpen={setIsGoodsOpen} title="Time zone">
          <GoodsContent isGoodsOpen={isGoodsOpen} />
        </Modal>
        <Modal isOpen={isLinkSettingOpen} setIsOpen={setIsLinkSettingOpen} title="Link setting">
          <LinkSettingContent urls={urls} setUrls={setUrls} />
        </Modal>
      </div>
    </MainSelection>
  );
}
