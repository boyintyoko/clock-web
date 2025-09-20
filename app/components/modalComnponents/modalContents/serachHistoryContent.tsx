import {useLanguage} from "@/app/context/languageContext";
import HistoryType from "@/app/types/HistoryType";

interface Props {
  histories: HistoryType[];
  setHistories: (histories: HistoryType[]) => void;
}

export default function SearchHistoryContent({histories, setHistories}: Props) {
  const {isNowLanguage} = useLanguage();

  const historyDelete = (id: number) => {
    const updatedHistories = histories.filter((h) => h.id !== id);
    localStorage.setItem("history", JSON.stringify(updatedHistories));
    setHistories(updatedHistories);
  };

  if (histories.length === 0) {
    return (
      <p className="text-center text-gray-400 italic mt-4">
        {isNowLanguage === "en"
          ? "No search history available."
          : isNowLanguage === "it"
            ? "Non è disponibile la cronologia delle ricerche."
            : "履歴がありません"}
      </p>
    );
  }

  return (
    <ul className="space-y-2 mt-2 font-bold">
      {[...histories].reverse().map((history) => (
        <li
          key={history.id}
          className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 min-w-[50px]">
              {history.create_hours.toString().padStart(2, "0")}:
              {history.create_minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-sm text-gray-700 truncate">{history.content}</span>
          </div>
          <button
            onClick={() => historyDelete(history.id)}
            className="text-red-500 hover:text-red-700 font-bold text-xs px-2 py-1 rounded-md transition-colors"
          >
            {isNowLanguage === "en"
              ? "Delete"
              : isNowLanguage === "it"
                ? "Cancella"
                : "削除"}
          </button>
        </li>
      ))}
    </ul>
  );
}

