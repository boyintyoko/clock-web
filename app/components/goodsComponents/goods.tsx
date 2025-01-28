import GoodsContent from "./goodsContent";
import GoodsMask from "./goodsMask";
import Image from "next/image";

interface GoodsType {
  isGoodsOpen: boolean;
  setIsGoodsOpen: (isOpen: boolean) => void;
}

export default function Goods({ isGoodsOpen, setIsGoodsOpen }: GoodsType) {
  return (
    <div
      className={`absolute inset-0 flex justify-center items-center ${
        !isGoodsOpen && "pointer-events-none"
      }`}
    >
      <GoodsMask isGoodsOpen={isGoodsOpen} setIsGoodsOpen={setIsGoodsOpen} />
      <div
        className={`z-50 w-96 h-96 bg-white overflow-auto rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform ${
          isGoodsOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-6">
          <div>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setIsGoodsOpen(!isGoodsOpen)}
                className="flex justify-center items-center"
              >
                <Image
                  src="/back.png"
                  alt="back image"
                  height={25}
                  width={25}
                />
              </button>
              <h2 className="text-2xl font-extrabold text-gray-800">Goods</h2>
            </div>
          </div>
        </div>
        <div className="p-6">
          <GoodsContent isGoodsOpen={isGoodsOpen} />
        </div>
      </div>
    </div>
  );
}
