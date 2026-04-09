"use client";

import { useEffect, useState } from "react";
import { useTimeZone } from "@/app/context/timeZoneContext";

export default function TimeZoneContent() {
	const [supportTimeZone, setSupportTimeZone] = useState<string[]>([]);
	const [search, setSearch] = useState("");

	const { isNowTimeZone, setIsNowTimeZone } = useTimeZone();

	/* タイムゾーン取得 */
	useEffect(() => {
		const timeZones = Intl.supportedValuesOf("timeZone");
		setSupportTimeZone(timeZones);
	}, []);

	/* タイムゾーン変更（バグ修正版） */
	const changeTimeZone = (tz: string) => {
		if (tz === isNowTimeZone) return;

		localStorage.setItem("timeZone", tz);

		setIsNowTimeZone(tz);

		window.location.reload();
	};

	/* 検索フィルター */
	const filteredTimeZones = supportTimeZone.filter((tz) =>
		tz.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="fade-in-up max-w-xl mx-auto space-y-4">
			{/* 検索ボックス */}
			<div
				className="
          p-3
          rounded-2xl
          bg-white/10
          backdrop-blur-md
          border border-white/20
          shadow-md
        "
			>
				<input
					type="text"
					placeholder="Search time zone..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="
            w-full
            p-3
            rounded-xl
            border border-gray-400/40
            bg-white/20
            backdrop-blur
            outline-none
            transition-all duration-200
            placeholder-gray-500
            focus:bg-white/30
          "
				/>
			</div>

			{/* タイムゾーン一覧 */}
			<div
				className="
          space-y-3
          max-h-[65vh]
          overflow-y-auto
          pr-2
        "
			>
				{filteredTimeZones.length > 0 ? (
					filteredTimeZones.map((tz) => (
						<button
							key={tz}
							onClick={() => changeTimeZone(tz)}
							className={`
                fade-in-up
                w-full
                text-left
                p-4
                rounded-2xl
                backdrop-blur-md
                border
                shadow-sm
                font-medium
                transition-all duration-200

                ${
									tz === isNowTimeZone
										? `
                      border-blue-400
                      bg-blue-400/10
                      shadow-md
                    `
										: `
                      border-white/20
                      bg-white/10
                      hover:-translate-y-1
                      hover:shadow-lg
                      hover:bg-white/20
                    `
								}
              `}
						>
							<span
								className="
                  text-gray-800
                  break-all
                "
							>
								{tz}
							</span>
						</button>
					))
				) : (
					/* 見つからない時 */
					<div className="flex justify-center py-10">
						<p
							className="
              text-gray-500
              font-semibold
              text-lg
            "
						>
							No results found.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
