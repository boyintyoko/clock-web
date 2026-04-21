"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LapsContent() {
	const [laps, setLaps] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loadLaps = async () => {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setLoading(false);
				return;
			}

			const { data, error } = await supabase
				.from("settings")
				.select("laps")
				.eq("user_id", user.id)
				.maybeSingle();

			if (error) {
				console.error(error);
				setLoading(false);
				return;
			}

			if (data?.laps) {
				setLaps(data.laps);
			}

			setLoading(false);
		};

		loadLaps();
	}, []);

	const format = (ms: number) => {
		const m = Math.floor(ms / 60000);
		const s = Math.floor((ms % 60000) / 1000);
		const cs = Math.floor((ms % 1000) / 10);

		return `${String(m).padStart(2, "0")}:${String(s).padStart(
			2,
			"0",
		)}:${String(cs).padStart(2, "0")}`;
	};

	const getDiff = (current: number, index: number) => {
		if (index === 0) return current;
		return current - laps[index - 1];
	};

	const clearLaps = async () => {
		setLaps([]);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		await supabase.from("settings").upsert(
			{
				user_id: user.id,
				laps: [],
			},
			{
				onConflict: "user_id",
			},
		);
	};
	if (loading) {
		return (
			<div className="flex flex-col h-full w-full items-center justify-center text-black py-10">
				<div className="w-10 h-10 border-4 border-black/20 border-t-black rounded-full animate-spin" />
				<p className="mt-3 text-black/60 font-medium">読み込み中...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full w-full text-black">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Laps ({laps.length})</h2>

				<button
					onClick={clearLaps}
					className="
            px-3 py-1 rounded-lg
            bg-red-100
            text-red-600
            border border-red-300
            hover:bg-red-200
            transition text-sm font-medium
          "
				>
					Clear
				</button>
			</div>

			<div
				className="
          flex flex-col gap-2
          overflow-y-auto
          max-h-[420px]
          pr-1
        "
			>
				{laps.length === 0 && (
					<div className="text-black/50 text-center mt-12">No laps yet</div>
				)}

				{laps.map((lap, index) => {
					const diff = getDiff(lap, index);

					return (
						<div
							key={index}
							className="
                flex items-center
                justify-between
                px-4 py-3
                rounded-xl
                bg-white/70
                backdrop-blur-md
                border border-black/10
                shadow-sm
                hover:shadow-md
                transition
              "
						>
							<div className="flex items-center gap-3">
								<div
									className="
                    w-8 h-8
                    flex items-center justify-center
                    rounded-full
                    bg-black/10
                    font-mono
                    text-sm
                    font-semibold
                  "
								>
									{index + 1}
								</div>

								<span className="font-mono text-base">{format(lap)}</span>
							</div>

							<span className="font-mono text-sm text-black/60">
								+{format(diff)}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
