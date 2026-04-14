"use client";

import { useEffect, useRef, useState } from "react";
import SecondHand from "./secondHand";
import MinuteHand from "./minuteHand";
import HourHand from "./hourHand";

interface Props {
	isDarkMode: boolean;
}

export default function ClockApp({ isDarkMode }: Props) {
	const [mode, setMode] = useState<"clock" | "stopwatch">("clock");
	const [time, setTime] = useState(0);
	const [isStart, setIsStart] = useState(false);
	const [running, setRunning] = useState(false);
	const [laps, setLaps] = useState<number[]>([]);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clearTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	useEffect(() => {
		clearTimer();

		if (mode === "stopwatch" && running) {
			intervalRef.current = setInterval(() => {
				setTime((t) => t + 10);
			}, 10);
		}

		return clearTimer;
	}, [mode, running]);

	useEffect(() => {
		const savedTime = localStorage.getItem("stopwatch-time");
		const savedLaps = localStorage.getItem("stopwatch-laps");

		if (savedTime) {
			setTime(Number(savedTime));
		}

		if (savedLaps) {
			setLaps(JSON.parse(savedLaps));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("stopwatch-time", String(time));
	}, [time]);

	useEffect(() => {
		localStorage.setItem("stopwatch-laps", JSON.stringify(laps));
	}, [laps]);

	const handleSwap = () => {
		setMode((prev) => (prev === "clock" ? "stopwatch" : "clock"));
	};

	const format = (ms: number) => {
		const m = Math.floor(ms / 60000);
		const s = Math.floor((ms % 60000) / 1000);
		const cs = Math.floor((ms % 1000) / 10);

		return `${String(m).padStart(2, "0")}:${String(s).padStart(
			2,
			"0",
		)}:${String(cs).padStart(2, "0")}`;
	};

	return (
		<div className="flex items-center justify-center text-white [perspective:1000px]">
			<button
				onClick={handleSwap}
				className="absolute top-2 right-2 z-50 bg-white/10 px-3 py-2 rounded"
			>
				⇄
			</button>

			<div
				className={`relative w-[90vw] max-w-[400px] aspect-square transition-transform duration-700 [transform-style:preserve-3d] border-white/20 shadow-2xl rounded-full
        ${mode === "stopwatch" ? "rotate-y-180" : ""}
        `}
			>
				<div
					className={`absolute inset-0 flex justify-center items-center rounded-full border-[5px]
          ${
						isDarkMode
							? "border-black/40 bg-black/20"
							: "border-white/80 bg-white/15"
					}
          shadow-xl backdrop-blur-sm backface-hidden
        `}
				>
					{[...Array(12)].map((_, index) => {
						const number = (index + 12) % 12 || 12;
						const rotation = index * 30;

						return (
							<div
								key={index}
								className={`absolute w-10 h-10 flex items-center justify-center font-black text-xl ${
									isDarkMode ? "text-black" : "text-white"
								}`}
								style={{
									transform: `rotate(${rotation}deg) translate(0, -140px) rotate(-${rotation}deg)`,
								}}
							>
								{number}
							</div>
						);
					})}

					<div
						className={`h-5 w-5 rounded-full z-10 ${
							isDarkMode ? "bg-black" : "bg-white"
						}`}
					/>

					<SecondHand isDarkMode={isDarkMode} />
					<MinuteHand isDarkMode={isDarkMode} />
					<HourHand isDarkMode={isDarkMode} />
				</div>

				<div
					className="absolute inset-0 flex flex-col items-center justify-center rounded-full
          rotate-y-180 backface-hidden
          bg-white/5 backdrop-blur-xl
          border border-white/20 shadow-2xl
          px-8"
				>
					<div
						className="text-5xl font-mono tracking-widest mb-6
            text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
					>
						{format(time)}
					</div>

					<div className="flex gap-4">
						<button
							onClick={() => {
								setRunning(!running);
								setIsStart(!isStart);
							}}
							className="px-5 py-2 rounded-full
              bg-emerald-400/20 text-emerald-200
              border border-emerald-400/40
              backdrop-blur-md
              transition-all duration-200
              hover:bg-emerald-400/30 hover:scale-105 active:scale-95"
						>
							{isStart ? "Stop" : "Start"}
						</button>

						<button
							onClick={() => {
								if (running) return;
								setLaps((prev) => [...prev, time]);
							}}
							className="px-5 py-2 rounded-full
              bg-yellow-400/20 text-yellow-200
              border border-yellow-400/40
              backdrop-blur-md
              transition-all duration-200
              hover:bg-yellow-400/30 hover:scale-105 active:scale-95"
						>
							Lap
						</button>

						<button
							onClick={() => {
								setTime(0);
								setRunning(false);
								setIsStart(false);
								clearTimer();
							}}
							className="px-5 py-2 rounded-full
              bg-red-400/20 text-red-200
              border border-red-400/40
              backdrop-blur-md
              transition-all duration-200
              hover:bg-red-400/30 hover:scale-105 active:scale-95"
						>
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
