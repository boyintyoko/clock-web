interface GoodsType {
  isGoodsOpen: boolean;
  setIsGoodsOpen: (isOpen: boolean) => void;
}

export default function GoodsMask({ isGoodsOpen, setIsGoodsOpen }: GoodsType) {
  return (
    <div
      onClick={() => setIsGoodsOpen(!isGoodsOpen)}
      className={`absolute inset-0 bg-black transition-opacity ${
        isGoodsOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      }`}
    ></div>
  );
}
