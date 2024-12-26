"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useBackground } from "@/app/context/backgroundContext";
import { useGoods } from "@/app/context/goodContext";
import { useLanguage } from "@/app/context/languageContext";

interface GoodsType {
  isGoodsOpen: boolean;
}

export default function GoodsContent({ isGoodsOpen }: GoodsType) {
  const [goods, setGoods] = useState<string[]>([]);

  const { setBackground } = useBackground();
  const { setIsNowGoods } = useGoods();
  const { isNowLanguage } = useLanguage();

  const setImageBackground = (url: string) => {
    setBackground(url);
    localStorage.setItem("background", url);
  };

  useEffect(() => {
    if (!isGoodsOpen) return;

    const storedGoods = localStorage.getItem("goods");
    if (!storedGoods) return;

    try {
      const parsedGoods = JSON.parse(storedGoods);
      if (Array.isArray(parsedGoods)) {
        setGoods(parsedGoods);
      } else {
        console.error("Invalid goods data in localStorage");
      }
    } catch (error) {
      console.error("Failed to parse goods from localStorage:", error);
    }
  }, [isGoodsOpen]);

  const goodDeleteHandle = (url: string) => {
    const updatedGoods = goods.filter((good) => good !== url);
    setGoods(updatedGoods);
    setIsNowGoods(updatedGoods);
    localStorage.setItem("goods", JSON.stringify(updatedGoods));
  };

  return (
    <div>
      {goods.length > 0 ? (
        <div className="flex flex-col gap-4">
          {goods.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 relative"
            >
              <button
                onClick={() => goodDeleteHandle(item)}
                className="absolute rounded-tr-lg right-0 top-0 z-10 w-10 h-10  bg-white p-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 text-red-500 hover:text-red-700"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div
                onClick={() => setImageBackground(item)}
                className="rounded-lg overflow-hidden hover:shadow-lg transition-transform hover:scale-105 duration-200 cursor-pointer"
              >
                <Image
                  src={item}
                  alt={`Image ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-bold">
          {(() => {
            if (isNowLanguage === "en") {
              return "Nothing.";
            } else if (isNowLanguage === "it") {
              return "Niente.";
            }
            return "何もありません。";
          })()}
        </p>
      )}
    </div>
  );
}
