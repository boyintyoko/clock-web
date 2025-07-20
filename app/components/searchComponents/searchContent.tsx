import Image from "next/image";
import React, { useEffect, useState } from "react";
import HistoryType from "@/app/types/HistoryType";

interface Search {
  isSearch: boolean;
  setHistories: React.Dispatch<React.SetStateAction<HistoryType[]>>;
  histories: HistoryType[];
}

export default function SearchContent({
  isSearch,
  setHistories,
  histories,
}: Search) {
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    try {
      const storedHistories = localStorage.getItem("history");
      if (!storedHistories) return;
      setHistories(JSON.parse(storedHistories));
    } catch (err) {
      console.log(err);
      localStorage.removeItem("history");
    }
  }, [setHistories]);

  const searchHandler = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();

    if (searchText.trim().length > 0) {
      window.open(`https://www.google.com/search?q=${searchText}`);

      const newId =
        histories.length > 0 ? Math.max(...histories.map((h) => h.id)) + 1 : 0;

      const newHistory: HistoryType = {
        content: searchText,
        id: newId,
        create_minutes: new Date().getMinutes(),
        create_hours: new Date().getHours(),
      };

      const updatedHistory = [...histories, newHistory];

      setHistories(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));

      setSearchText("");
    }
  };

  return (
    <div
      className={`flex items-center absolute ${
        isSearch ? "-bottom-20" : "bottom-2"
      } left-2 h-16 w-96 bg-white bg-opacity-50 rounded-full shadow-lg hover:ring-blue-500 ring-4 transition-all hover:shadow-2xl hover:translate-y-2`}
      id="inputSearch"
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
        <Image src="/search.png" alt="search icon" height={30} width={30} />
      </button>
    </div>
  );
}
