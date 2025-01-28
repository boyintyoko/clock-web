import Image from "next/image";
import React, { useEffect, useState } from "react";
import HistoryType from "@/app/types/HistoryType";

interface Search {
  isSearch: boolean;
}

export default function SearchContent({ isSearch }: Search) {
  const [searchText, setSearchText] = useState<string>("");
  const [historyText, setHistoryText] = useState<HistoryType[]>([]);

  useEffect(() => {
    try {
      const histories = localStorage.getItem("history");
      if (!histories) return;
      setHistoryText(JSON.parse(histories));
    } catch (err) {
      console.log(err);
      localStorage.removeItem("history");
    }
  }, []);

  const searchHandler = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ): void => {
    if (searchText.length > 0) {
      e.preventDefault();
      window.open(`https://www.google.com/search?q=${searchText}`);

      const newHistory: HistoryType = {
        content: searchText,
        id: historyText.length,
        create: new Date().toISOString(),
      };

      const updatedHistory = [...historyText, newHistory];
      setHistoryText(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));

      setSearchText("");
    }
  };

  return (
    <div
      className={`flex items-center absolute ${
        isSearch ? "-bottom-20" : "bottom-2"
      } left-2 h-16 w-96 bg-white bg-opacity-50 rounded-full shadow-lg hover:ring-blue-500 ring-4 transition-all hover:shadow-2xl`}
    >
      <form onSubmit={searchHandler}>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          value={searchText}
          placeholder="Search..."
          className="rounded-l-full placeholder:text-gray-700 h-16 w-80 pl-4 pr-8 text-gray-700 bg-transparent focus:outline-none focus:ring-blue-500 transition-all"
        />
      </form>
      <button
        className="flex justify-center items-center bg-blue-500 h-16 w-16 rounded-r-full hover:bg-blue-600"
        onClick={searchHandler}
      >
        <Image src="/search.png" alt="youtube icon" height={30} width={30} />
      </button>
    </div>
  );
}
