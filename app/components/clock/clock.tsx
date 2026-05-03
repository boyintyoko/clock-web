"use client";

import HourHand from "@@/components/clock/hourHand";
import MinuteHand from "@@/components/clock/minuteHand";
import SecondHand from "@@/components/clock/secondHand";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
	isDarkMode: boolean;
};

export default function ClockApp({ isDarkMode }: Props) {
	const [mode, setMode] = useState<"clock" | "stopwatch">("clock");

	const [time, setTime] = useState(0);
	const [running, setRunning] = useState(false);
	const [laps, setLaps] = useState<number[]>([]);

	const [isTimer, setIsTimer] = useState(false);
	const [timerTime, setTimerTime] = useState(0);
	const [timerRunning, setTimerRunning] = useState(false);
	const [plan, setPlan] = useState<"free" | "premium" | "premium_plus" | null>(
		null,
	);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const endTimeRef = useRef<number | null>(null);

	useEffect(() => {
		const loadUserPlan = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data } = await supabase
				.from("profiles")
				.select("plan")
				.eq("id", user.id)
				.single();

			if (data) {
				setPlan(data.plan);
			}
		};

		loadUserPlan();
	}, []);

	const clearTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	useEffect(() => {
		const loadSettings = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data } = await supabase
				.from("settings")
				.select("*")
				.eq("user_id", user.id)
				.maybeSingle();

			if (data) {
				if (data.timer_time) setTime(data.timer_time);
				if (data.laps) setLaps(data.laps);
				if (data.is_front === false) setMode("stopwatch");
			}
		};

		loadSettings();
	}, []);

	useEffect(() => {
		if (isTimer) return;

		clearTimer();

		if (mode === "stopwatch" && running) {
			intervalRef.current = setInterval(() => {
				setTime((t) => t + 10);
			}, 10);
		}

		return clearTimer;
	}, [mode, running, isTimer]);

	useEffect(() => {
		if (!isTimer) return;

		if (timerRunning) {
			if (!endTimeRef.current) {
				endTimeRef.current = Date.now() + timerTime;
			}

			intervalRef.current = setInterval(() => {
				const now = Date.now();
				const remaining = endTimeRef.current! - now;

				if (remaining <= 0) {
					clearTimer();
					setTimerRunning(false);
					setTimerTime(0);
					endTimeRef.current = null;

					// 🔔 通知
					if (Notification.permission === "granted") {
						new Notification("タイマー終了", {
							body: "時間になりました",
						});
					}
				} else {
					setTimerTime(remaining);
				}
			}, 100);
		}

		return clearTimer;
	}, [isTimer, timerRunning]);

	const saveSetting = async (key: string, value: any) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		await supabase.from("settings").upsert(
			{
				user_id: user.id,
				[key]: value,
			},
			{ onConflict: "user_id" },
		);
	};

	useEffect(() => {
		if (!running) saveSetting("timer_time", time);
	}, [running]);

	useEffect(() => {
		saveSetting("laps", laps);
	}, [laps]);

	const handleSwap = () => {
		const newMode = mode === "clock" ? "stopwatch" : "clock";
		setMode(newMode);
		saveSetting("is_front", newMode === "clock");
	};

	const formatStopwatch = (ms: number) => {
		const m = Math.floor(ms / 60000);
		const s = Math.floor((ms % 60000) / 1000);
		const cs = Math.floor((ms % 1000) / 10);

		return `${String(m).padStart(2, "0")}:${String(s).padStart(
			2,
			"0",
		)}:${String(cs).padStart(2, "0")}`;
	};

	const formatTimer = (ms: number) => {
		const h = Math.floor(ms / 3600000);
		const m = Math.floor((ms % 3600000) / 60000);
		const s = Math.floor((ms % 60000) / 1000);

		return [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null, `${s}s`]
			.filter(Boolean)
			.join(" ");
	};

	return (
		<div className="flex items-center justify-center text-white [perspective:1000px]">
			<button
				onClick={handleSwap}
				className={`absolute top-2 right-2 z-50 bg-white/10 px-3 py-2 rounded ${
					isDarkMode ? "text-gray-700" : "text-white"
				}`}
			>
				⇄
			</button>

			<div
				className={`relative w-[90vw] max-w-[400px] aspect-square transition-transform duration-700 [transform-style:preserve-3d] border-white/20 shadow-2xl rounded-full
        ${mode === "stopwatch" ? "rotate-y-180" : ""}`}
			>
				{/* clock */}
				<div
					className={`absolute inset-0 flex justify-center items-center rounded-full border-[5px]
          ${
						isDarkMode
							? "border-black/40 bg-black/20"
							: "border-white/80 bg-white/15"
					}
          shadow-xl backdrop-blur-sm backface-hidden`}
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
					className={` ${isDarkMode ? "text-black" : "text-white"} absolute inset-0 flex flex-col items-center justify-center rounded-full rotate-y-180 backface-hidden bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl px-8`}
				>
					{plan !== "free" && (
						<>
							<button
								onClick={() => setIsTimer(!isTimer)}
								className="absolute top-0 left-0 h-12 w-12 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/90 active:scale-95 transition-all"
							>
								<div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
							</button>
						</>
					)}

					{isTimer ? (
						<>
							<div className="text-5xl font-mono mb-6">
								{formatTimer(timerTime)}
							</div>

							<div className="flex gap-2 mb-4">
								{[
									{ label: "30s", value: 30000 },
									{ label: "1m", value: 60000 },
									{ label: "5m", value: 300000 },
								].map((item) => (
									<button
										key={item.label}
										onClick={() => setTimerTime((t) => t + item.value)}
										className="px-3 py-1 rounded-full bg-blue-400/20 border border-blue-400/40"
									>
										+{item.label}
									</button>
								))}
							</div>

							<div className="flex gap-4">
								<button
									onClick={() => {
										if (timerRunning) {
											setTimerRunning(false);
											clearTimer();
											return;
										}

										setTimerRunning(true);
									}}
									className="px-5 py-2 rounded-full bg-emerald-400/20 border border-emerald-400/40"
								>
									{timerRunning ? "Stop" : "Start"}
								</button>

								<button
									onClick={() => {
										setTimerTime(0);
										setTimerRunning(false);
										clearTimer();
									}}
									className="px-5 py-2 rounded-full bg-red-400/20 border border-red-400/40"
								>
									Reset
								</button>
							</div>
						</>
					) : (
						<>
							<div className="text-5xl font-mono mb-6">
								{formatStopwatch(time)}
							</div>

							<div className="flex gap-4">
								<button
									onClick={() => setRunning(!running)}
									className="px-5 py-2 rounded-full bg-emerald-400/20 border border-emerald-400/40"
								>
									{running ? "Stop" : "Start"}
								</button>

								<button
									onClick={() => {
										if (running) return;
										setLaps((prev) => [...prev, time]);
									}}
									className="px-5 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/40"
								>
									Lap
								</button>

								<button
									onClick={() => {
										setTime(0);
										setRunning(false);
										setLaps([]);
										clearTimer();
									}}
									className="px-5 py-2 rounded-full bg-red-400/20 border border-red-400/40"
								>
									Reset
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
