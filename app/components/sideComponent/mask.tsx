import { Dispatch, SetStateAction } from "react";

interface IsChangeType {
  isChange: boolean;
  setIsChange: Dispatch<SetStateAction<boolean>>;
}

export default function Mask({ isChange, setIsChange }: IsChangeType) {
  const changeSideBar = () => {
    setIsChange(!isChange);
    localStorage.setItem("isSideBarChang", JSON.stringify(!isChange));
  };
  return (
    <div
      onClick={() => changeSideBar()}
      className={`absolute transition-all z-30 top-0 left-0 bg-black ${
        isChange
          ? "bg-opacity-50 pointer-events-auto"
          : "bg-opacity-0 pointer-events-none"
      } h-screen`}
      style={{ width: "calc(100% - 384px)" }}
    ></div>
  );
}
