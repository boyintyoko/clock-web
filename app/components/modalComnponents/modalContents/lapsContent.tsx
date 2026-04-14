"use client";

import { useEffect, useState } from "react";

export default function LapsContent() {
	const [laps, setLaps] = useState<number[]>([]);

	useEffect(() => {
		const saved = localStorage.getItem("stopwatch-laps");

		if (saved) {
			setLaps(JSON.parse(saved));
		}
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

	const clearLaps = () => {
		setLaps([]);
		localStorage.removeItem("stopwatch-laps");
	};

	return (
		<div className="flex flex-col h-full w-full text-black">
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Laps ({laps.length})</h2>

				<button
					onClick={clearLaps}
					className="px-3 py-1 rounded-lg
          bg-red-100
          text-red-600
          border border-red-300
          hover:bg-red-200
          transition text-sm font-medium"
				>
					Clear
				</button>
			</div>

			{/* List */}
			<div
				className="flex flex-col gap-2
        overflow-y-auto
        max-h-[420px]
        pr-1"
			>
				{laps.length === 0 && (
					<div className="text-black/50 text-center mt-12">No laps yet</div>
				)}

				{laps.map((lap, index) => {
					const diff = getDiff(lap, index);

					return (
						<div
							key={index}
							className="flex items-center
              justify-between
              px-4 py-3
              rounded-xl

              bg-white/70
              backdrop-blur-md

              border border-black/10
              shadow-sm

              hover:shadow-md
              transition"
						>
							{/* Lap number */}
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

							{/* Diff */}
							<span
								className="
                font-mono
                text-sm
                text-black/60
                "
							>
								+{format(diff)}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
