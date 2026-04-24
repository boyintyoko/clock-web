"use client";

import { useLanguage } from "@@/context/languageContext";
import type HistoryType from "@@/types/HistoryType";
import { supabase } from "@/lib/supabase";

type Props = {
	histories: HistoryType[];
	setHistories: (histories: HistoryType[]) => void;
};

export default function SearchHistoryContent({
	histories,
	setHistories,
}: Props) {
	const { isNowLanguage } = useLanguage();

	const historyDelete = async (id: number) => {
		console.log("delete id:", id);

		try {
			const { error } = await supabase.from("histories").delete().eq("id", id);

			if (error) {
				console.error("delete error:", error);
				return;
			}

			const updatedHistories = histories.filter((h) => h.id !== id);

			setHistories(updatedHistories);

			console.log("delete success");
		} catch (err) {
			console.error("delete failed:", err);
		}
	};

	if (histories.length === 0) {
		return (
			<div className="fade-in-up flex justify-center p-10">
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
		<ul className="fade-in-up">
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
					<div className="flex items-center gap-3 min-w-0">
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
