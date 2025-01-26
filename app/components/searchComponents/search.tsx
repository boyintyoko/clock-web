import SearchContent from "./searchContent";
import LinkContent from "./linkContent";
import Image from "next/image";
import { useState } from "react";

interface IsDarkMode {
  isDarkMode: boolean;
}

export default function Search({ isDarkMode }: IsDarkMode) {
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <div>
      <div className="absolute bottom-2 left-2">
        <SearchContent isSearch={isSearch} />
        <LinkContent isSearch={isSearch} />
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
    </div>
  );
}
