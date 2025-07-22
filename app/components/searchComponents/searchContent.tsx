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
      <div className="relative w-80 h-16">
        <input
          type="text"
          placeholder=" "
          className="peer h-16 w-80 pl-4 pr-8 rounded-l-full text-gray-700 bg-transparent
               placeholder-transparent focus:outline-none"
        />
        <p
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all
               duration-200
               peer-focus:-top-5 peer-focus:text-blue-500
               peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500"
        >
          Search...
        </p>
      </div>

      <button
        className="flex justify-center items-center bg-blue-500 h-16 w-16 rounded-r-full hover:bg-blue-600"
        onClick={searchHandler}
      >
        <Image src="/search.png" alt="search icon" height={30} width={30} />
      </button>
    </div>
  );
}
