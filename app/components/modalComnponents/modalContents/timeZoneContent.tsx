"use client";

import { useEffect, useState } from "react";
import { useTimeZone } from "@@/context/timeZoneContext";
import { supabase } from "@/lib/supabase";

export default function TimeZoneContent() {
	const [supportTimeZone, setSupportTimeZone] = useState<string[]>([]);

	const [search, setSearch] = useState("");

	const { isNowTimeZone, setIsNowTimeZone } = useTimeZone();

	useEffect(() => {
		const timeZones = Intl.supportedValuesOf("timeZone");

		setSupportTimeZone(timeZones);
	}, []);

	useEffect(() => {
		const fetchTimeZone = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					setIsNowTimeZone("Europe/London");

					return;
				}

				const { data, error } = await supabase
					.from("settings")
					.select("timezone")
					.eq("user_id", user.id)
					.maybeSingle();

				if (error) {
					console.error("timezone取得失敗:", error);

					return;
				}

				if (data?.timezone) {
					setIsNowTimeZone(data.timezone);

					console.log("timezone取得成功:", data.timezone);
				} else {
					setIsNowTimeZone("Asia/Tokyo");
				}
			} catch (err) {
				console.error("timezone fetch error:", err);
			}
		};

		fetchTimeZone();
	}, []);

	const changeTimeZone = async (tz: string) => {
		if (tz === isNowTimeZone) return;

		try {
			setIsNowTimeZone(tz);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { error } = await supabase.from("settings").upsert(
				{
					user_id: user.id,
					timezone: tz,
				},
				{
					onConflict: "user_id",
				},
			);

			if (error) {
				console.error("timezone保存失敗:", error);
			} else {
				console.log("timezone保存成功");
			}

			/* リロード */

			window.location.reload();
		} catch (err) {
			console.error("timezone change error:", err);
		}
	};

	/* ---------------- filter ---------------- */

	const filteredTimeZones = supportTimeZone.filter((tz) =>
		tz.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="fade-in-up max-w-xl mx-auto space-y-4">
			{/* search */}

			<div
				className="
					p-3
					rounded-2xl
					bg-white/10
					backdrop-blur-md
					border border-white/20
					shadow-md
					sticky top-0
					z-10
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

			{/* list */}

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
