import Link from "next/link";
import Image from "next/image";
import History from "./historyComponents/history";

interface Props {
  isSearch: boolean;
  isHistoriesOpen: boolean;
  setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LinkContent({
  isSearch,
  isHistoriesOpen,
  setIsHistoriesOpen,
}: Props) {
  return (
    <div
      className={`flex items-center justify-evenly absolute ${
        isSearch ? "bottom-2" : "-bottom-20"
      } left-2 h-16 w-96 bg-white bg-opacity-50 rounded-full shadow-lg ring-blue-500 ring-4 transition-all hover:shadow-2xl hover:translate-y-2`}
    >
      <Link
        href="https://chatgpt.com"
        rel="noopener noreferrer"
        target="_blank"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
      >
        <Image
          src="/linkImages/white/ChatGpt.png"
          alt="ChatGPT icon"
          height={20}
          width={20}
        />
      </Link>
      <Link
        href="https://www.google.com"
        rel="noopener noreferrer"
        target="_blank"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
      >
        <Image
          src="/linkImages/white/Google.png"
          alt="Google icon"
          height={20}
          width={20}
        />
      </Link>
      <Link
        href="https://mail.google.com/mail/u/0/#inbox"
        rel="noopener noreferrer"
        target="_blank"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
      >
        <Image
          src="/linkImages/white/Mail.png"
          alt="Mail icon"
          height={20}
          width={20}
        />
      </Link>
      <Link
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
      >
        <Image
          src="/linkImages/white/Youtube.png"
          alt="Youtube icon"
          height={20}
          width={20}
        />
      </Link>
      <History
        isHistoriesOpen={isHistoriesOpen}
        setIsHistoriesOpen={setIsHistoriesOpen}
      />
    </div>
  );
}
