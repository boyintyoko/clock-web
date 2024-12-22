"use client";

import { useState } from "react";
import ChangeImageSide from "./sideComponent/changeImageSide";
import Mask from "./sideComponent/mask";

export default function ChangeImageButton() {
  const [isChange, setIsChange] = useState<boolean>(false);

  return (
    <div>
      <button
        onClick={() => setIsChange(!isChange)}
        className={`flex flex-col absolute top-1 left-1 h-12 w-12 bg-white hover:top-2 ${
          isChange ? "opacity-80" : "bg-opacity-40"
        }  shadow-lg transition-all`}
      >
        <span
          style={{ height: "2px", top: "calc(100% / 2 + -5px)" }}
          className={`absolute w-1/2  bg-black`}
        ></span>
        <span
          style={{ height: "1px", top: "calc(100% / 2 + 10px)" }}
          className="absolute w-1/4 bg-black"
        ></span>
        <span
          style={{ height: "1px", top: "calc(100% / 2 + -10px)" }}
          className="absolute w-1/4 right-0 bg-black"
        ></span>
        <span
          style={{ height: "3px", top: "calc(100% / 2 + 10px)" }}
          className="absolute w-1/2 right-0 bg-black"
        ></span>
      </button>
      <Mask isChange={isChange} setIsChange={setIsChange} />
      <ChangeImageSide isChange={isChange} />
    </div>
  );
}
