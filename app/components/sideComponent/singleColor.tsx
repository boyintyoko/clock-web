"use client";

import Image from "next/image";
import colors from "@/data/colorData";
import { useBackground } from "@/app/context/backgroundContext";
import { useEffect, useState } from "react";

export default function SingleColor() {
  const { setBackground, background } = useBackground();
  const [isNowBackground, setIsNowBackground] = useState<string>("");

  const colorChangeHandler = (color: string) => {
    localStorage.getItem("background");
    localStorage.setItem("background", color);
    setBackground(color);
    setIsNowBackground(color);
  };

  useEffect(() => {
    if (background.startsWith("https")) {
      setIsNowBackground("");
    }
  }, [background]);

  useEffect(() => {
    const url = localStorage.getItem("background");
    if (url?.startsWith("https")) return;
    if (!url) return;
    setIsNowBackground(url);
  }, []);

  return (
    <div className="flex flex-nowrap overflow-auto gap-2 border-b pb-3">
      {colors.map((color, i) => (
        <button
          key={i}
          onClick={() => colorChangeHandler(color)}
          className={`flex border-2 transition-all rounded-full items-center ${
            isNowBackground === color && "border-blue-500"
          } justify-center p-1 bg-transparent`}
        >
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={`/color/${color}.png`}
              height={50}
              width={50}
              alt={color}
              onError={(e) => {
                e.currentTarget.src = "/default.png";
              }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
