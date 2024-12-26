import { Dispatch, SetStateAction } from "react";

interface IsChangeType {
  isChange: boolean;
  setIsChange: Dispatch<SetStateAction<boolean>>;
}

export default function Mask({ isChange, setIsChange }: IsChangeType) {
  return (
    <div
      onClick={() => setIsChange(!isChange)}
      className={`absolute transition-all z-30 top-0 left-0 bg-black ${
        isChange
          ? "bg-opacity-50 pointer-events-auto"
          : "bg-opacity-0 pointer-events-none"
      } h-screen`}
      style={{ width: "calc(100% - 384px)" }}
    ></div>
  );
}
