import { useLanguage } from "@/app/context/languageContext";
import HistoryType from "@/app/types/HistoryType";

interface Props {
	histories: HistoryType[];
	setHistories: (histories: HistoryType[]) => void;
}

export default function SearchHistoryContent({
	histories,
	setHistories,
}: Props) {
	const { isNowLanguage } = useLanguage();

	/* 履歴削除 */
	const historyDelete = (id: number) => {
		const updatedHistories = histories.filter((h) => h.id !== id);

		localStorage.setItem("history", JSON.stringify(updatedHistories));

		setHistories(updatedHistories);
	};

	/* 履歴が空 */
	if (histories.length === 0) {
		return (
			<div className="fade-in-up flex justify-center py-10">
				<p
					className="
            text-gray-500
            font-semibold
            text-lg
            italic
          "
				>
					{isNowLanguage === "en"
						? "No search history yet."
						: isNowLanguage === "it"
							? "Nessuna cronologia."
							: "履歴はまだありません。"}
				</p>
			</div>
		);
	}

	return (
		<ul className="fade-in-up space-y-3 mt-3">
			{[...histories].reverse().map((history) => (
				<li
					key={history.id}
					className="
            fade-in-up
            flex
            items-center
            justify-between
            p-4
            rounded-2xl
            bg-white/10
            backdrop-blur-md
            border border-white/20
            shadow-md
            transition-all duration-200
            hover:-translate-y-1
            hover:shadow-lg
          "
				>
					{/* 左側 */}
					<div className="flex items-center gap-3 min-w-0">
						{/* 時刻 */}
						<span
							className="
                text-xs
                text-gray-500
                min-w-[55px]
                font-mono
              "
						>
							{history.create_hours.toString().padStart(2, "0")}:
							{history.create_minutes.toString().padStart(2, "0")}
						</span>

						{/* 検索内容 */}
						<span
							className="
                text-sm
                text-gray-800
                truncate
                font-semibold
              "
						>
							{history.content}
						</span>
					</div>

					{/* 削除ボタン */}
					<button
						onClick={() => historyDelete(history.id)}
						className="
              ml-3
              px-3
              py-1
              rounded-lg
              border border-red-400
              text-red-400
              text-xs
              font-semibold
              transition-all duration-200
              hover:bg-red-400
              hover:text-white
              hover:scale-105
              active:scale-90
            "
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
