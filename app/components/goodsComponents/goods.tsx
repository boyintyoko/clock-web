import GoodsContent from "./goodsContent";
import GoodsMask from "./goodsMask";

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
        className={`z-50 w-96 h-96 bg-white overflow-auto rounded-lg shadow-xl transition-all duration-300 ease-in-out transform ${
          isGoodsOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-black mb-4">Goods</h2>
          <GoodsContent isGoodsOpen={isGoodsOpen} />
        </div>
      </div>
    </div>
  );
}
