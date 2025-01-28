"use client";
import SearchContent from "./searchContent";
import LinkContent from "./linkContent";
import Image from "next/image";
import { useEffect, useState } from "react";
import HistoryType from "@/app/types/HistoryType";

interface Props {
  isDarkMode: boolean;
  isHistoriesOpen: boolean;
  setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Search({
  isDarkMode,
  isHistoriesOpen,
  setIsHistoriesOpen,
}: Props) {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [histories, setHistories] = useState<HistoryType[]>([]);

  useEffect(() => {
    const histories = localStorage.getItem("history");
    if (!histories) return;
    setHistories(JSON.parse(histories));
    console.log("hello");
  }, []);

  const historyDelete = (id: number) => {
    const upDateHistories = histories.filter((history) => history.id !== id);
    setHistories(upDateHistories);
    localStorage.setItem("history", JSON.stringify(upDateHistories));
  };

  return (
    <div>
      <div className="absolute bottom-2 left-2">
        <SearchContent isSearch={isSearch} />
        <LinkContent
          isSearch={isSearch}
          isHistoriesOpen={isHistoriesOpen}
          setIsHistoriesOpen={setIsHistoriesOpen}
        />
      </div>
      <button className="flex justify-center items-center absolute bottom-4 left-96 ml-10 h-16 w-16 bg-white rounded-full bg-opacity-25">
        <Image
          src={`${isDarkMode ? "/DownBlack.png" : "/DownWhine.png"}`}
          alt="down icon"
          height={50}
          width={50}
          onClick={() => setIsSearch(!isSearch)}
        />
      </button>
      <div
        onClick={() => setIsHistoriesOpen(false)}
        className={`absolute top-0 left-0 transition-all h-screen w-screen bg-black ${
          isHistoriesOpen ? "bg-opacity-25" : "bg-opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        className={`absolute h-96 w-96 bg-white transition-all rounded-2xl shadow-lg overflow-y-auto ${
          isHistoriesOpen
            ? "opacity-100"
            : "bg-opacity-0 hidden pointer-events-none"
        } top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4`}
      >
        <h2 className="text-xl font-semibold mb-4">Search History</h2>
        {histories.length === 0 ? (
          <p className="text-center text-gray-500">
            No search history available.
          </p>
        ) : (
          <ul>
            {[...histories].reverse().map((history) => (
              <li
                key={history.id}
                className="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                <span className="text-sm">{history.content}</span>
                <button
                  onClick={() => historyDelete(history.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
