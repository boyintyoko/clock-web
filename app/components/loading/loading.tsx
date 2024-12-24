"use client";
import { useEffect, useState } from "react";
import LoadingSecondHand from "./loadingSecondHand";

export default function Loading() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const url = localStorage.getItem("background");

    if (!url) return;
    setTimeout(() => {
      setIsLoading(true);
    }, 3000);
  }, []);

  return (
    <div
      className={`flex justify-center items-center transition-all bg-center bg-cover ${
        isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
      } absolute h-screen w-screen bg-white z-50`}
    >
      <div
        className={`relative flex justify-center items-center h-96 w-96 rounded-full border-8
        shadow-2xl transition-all top-0 hover:top-1 bg-white bg-opacity-25 backdrop-blur-md hover:backdrop-blur-0`}
      >
        {[...Array(12)].map((_, index) => {
          const number = (index + 12) % 12 || 12;
          const rotation = index * 30;
          return (
            <div
              key={index}
              className={`absolute flex justify-center items-center w-10 h-10 font-black text-xl`}
              style={{
                transform: `rotate(${rotation}deg) translate(0, -140px) rotate(-${rotation}deg)`,
              }}
            >
              {number}
            </div>
          );
        })}
        <div className="h-5 w-5 bg-black rounded-full"></div>
        <LoadingSecondHand />
      </div>
    </div>
  );
}
