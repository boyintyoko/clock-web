"use client";

interface isDarkModeType {
  isDarkMode: boolean;
}

import { useState } from "react";
import ChangeImageSide from "./sideComponent/changeImageSide";
import Mask from "./sideComponent/mask";

export default function ChangeImageButton({ isDarkMode }: isDarkModeType) {
  const [isChange, setIsChange] = useState<boolean>(false);

  const openClickHandle = () => {
    setIsChange(!isChange);
  };

  return (
    <div>
      <button
        id="changeImageButton"
        onClick={openClickHandle}
        className={`flex flex-col items-center justify-center ${
          !isChange ? "gap-2" : "gap-0 z-50"
        } absolute top-1 left-1 h-12 w-12 bg-white hover:top-2 bg-opacity-45 shadow-lg transition-all`}
      >
        <span
          style={{ height: "3px" }}
          className={`w-8 transition-all ${
            isChange ? "absolute rotate-45" : ""
          } ${isDarkMode ? "bg-black" : "bg-white"}`}
        ></span>
        <span
          style={{ height: "3px" }}
          className={`w-8 transition-all ${
            isChange ? "opacity-0 hidden" : "opacity-100"
          } ${isDarkMode ? "bg-black" : "bg-white"}`}
        ></span>
        <span
          style={{ height: "3px" }}
          className={`w-8 transition-all ${
            isChange ? "absolute -rotate-45" : ""
          } ${isDarkMode ? "bg-black" : "bg-white"}`}
        ></span>
      </button>
      <Mask isChange={isChange} setIsChange={setIsChange} />
      <ChangeImageSide isChange={isChange} setIsChange={setIsChange} />
    </div>
  );
}
