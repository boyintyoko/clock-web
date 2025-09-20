import Image from "next/image";
import Mask from "./mask";

interface Props {
  title: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export default function Modal({ title, isOpen, setIsOpen, children }: Props) {
  return (
    <div
      className={`absolute inset-0 flex justify-center items-center transition-all ${isOpen ? "visible opacity-100" : "invisible opacity-0"
        }
        }`}
    >
      <Mask isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`h-96 w-96 bg-white rounded-2xl shadow-xl transform transition-transform z-30 overflow-auto `}
        style={{
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full transition-all hover:translate-y-1"
              aria-label="Go back"
            >
              <Image src="/back.png" alt="Back" height={25} width={25} />
            </button>
            <h3 className="font-bold">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
