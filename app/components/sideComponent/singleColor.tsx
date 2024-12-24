import Image from "next/image";
import colors from "@/data/colorData";
import { useBackground } from "@/app/context/backgroundContext";

export default function SingleColor() {
  const { setBackground } = useBackground();

  const colorChangeHandler = (color: string) => {
    localStorage.setItem("background", color);
    setBackground(color);
  };

  return (
    <div className="flex flex-nowrap overflow-auto gap-2 border-b pb-3">
      {colors.map((color, i) => (
        <button
          key={i}
          onClick={() => colorChangeHandler(color)}
          className="flex items-center justify-center p-0 border-none bg-transparent"
        >
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={`/color/${color}.png`}
              height={50}
              width={50}
              alt={color}
              onError={(e) => {
                e.currentTarget.src = "/default.png";
              }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
