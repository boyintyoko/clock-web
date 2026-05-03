"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";

type SunData = {
	sunrise: string;
	sunset: string;
};

type Props = {
	plan: "free" | "premium" | "premium_plus";
};

export default function SunMain({ plan }: Props) {
	if (plan === "free") return;

	const [sun, setSun] = useState<SunData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [locked, setLocked] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);

	const dragging = useRef(false);
	const offset = useRef({ x: 0, y: 0 });
	const cardRef = useRef<HTMLDivElement>(null);
	const saveTimer = useRef<NodeJS.Timeout | null>(null);

	const saveState = (
		newPos: { x: number; y: number },
		lockedValue: boolean,
		currentUserId: string | null,
	) => {
		if (!currentUserId) return; // ユーザーIDがないなら保存しない

		if (saveTimer.current) clearTimeout(saveTimer.current);

		saveTimer.current = setTimeout(async () => {
			try {
				await supabase.from("sun_widget_state").upsert({
					user_id: currentUserId,
					x: newPos.x,
					y: newPos.y,
					locked: lockedValue,
					updated_at: new Date().toISOString(),
				});
			} catch (e) {
				console.error("Save failed", e);
			}
		}, 500);
	};

	useEffect(() => {
		const init = async () => {
			// 1. ログインユーザーの取得
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				setUserId(user.id);

				// 2. そのユーザーの設定をロード
				const { data: stateData } = await supabase
					.from("sun_widget_state")
					.select("*")
					.eq("user_id", user.id) // user_id で検索
					.single();

				if (stateData) {
					setPos({ x: stateData.x, y: stateData.y });
					setLocked(stateData.locked);
				}
			}

			// 3. APIで日の出・日の入り取得
			try {
				const position = await new Promise<GeolocationPosition>(
					(resolve, reject) =>
						navigator.geolocation.getCurrentPosition(resolve, reject),
				);
				const { latitude, longitude } = position.coords;
				const res = await axios.get("https://api.sunrise-sunset.org/json", {
					params: { lat: latitude, lng: longitude, formatted: 0 },
				});
				setSun({
					sunrise: res.data.results.sunrise,
					sunset: res.data.results.sunset,
				});
			} catch (err) {
				setError("データ取得失敗");
			} finally {
				setLoading(false);
			}
		};
		init();
	}, []);

	// ======================
	// ドラッグ処理
	// ======================
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!dragging.current || locked || !cardRef.current) return;

			const rect = cardRef.current.getBoundingClientRect();
			const limitX = (window.innerWidth - rect.width) / 2;
			const limitY = (window.innerHeight - rect.height) / 2;

			const newX = Math.max(
				-limitX,
				Math.min(e.clientX - offset.current.x, limitX),
			);
			const newY = Math.max(
				-limitY,
				Math.min(e.clientY - offset.current.y, limitY),
			);

			const newPos = { x: newX, y: newY };
			setPos(newPos);
			saveState(newPos, locked, userId); // userId を渡す
		};

		const handleMouseUp = () => {
			dragging.current = false;
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [locked, userId]); // userId も依存に含める

	const handleMouseDown = (e: React.MouseEvent) => {
		if (locked) return;
		dragging.current = true;
		offset.current = {
			x: e.clientX - pos.x,
			y: e.clientY - pos.y,
		};
	};

	// UIは変わらないので省略（前回のものを使用）
	if (loading)
		return (
			<div className="absolute inset-0 flex items-center justify-center z-50">
				<div className="px-6 py-3 rounded-xl bg-black/40 backdrop-blur-md text-white">
					📍 Loading...
				</div>
			</div>
		);
	if (error || !sun) return null;

	return (
		<div
			ref={cardRef}
			style={{
				transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
			}}
			className="absolute top-1/2 left-1/2 z-50 select-none"
		>
			<div className="w-[280px] rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl px-6 pb-6 text-white border border-white/20">
				<div className="flex items-center justify-between py-4">
					<button
						onClick={(e) => {
							e.stopPropagation();
							const nextLocked = !locked;
							setLocked(nextLocked);
							saveState(pos, nextLocked, userId);
						}}
						className={`text-[10px] px-3 py-1 rounded-md border transition-all ${
							locked
								? "bg-white/20 border-white/40"
								: "bg-black/20 border-white/10 text-white/50"
						}`}
					>
						{locked ? "📌 Fixed" : "🔓 Move"}
					</button>

					<div
						onMouseDown={handleMouseDown}
						className={`flex-1 flex justify-center py-2 ${
							locked
								? "cursor-default opacity-20"
								: "cursor-grab active:cursor-grabbing"
						}`}
					>
						<span className="block h-[4px] w-10 bg-white/40 rounded-full"></span>
					</div>
					<div className="w-[50px]" />
				</div>

				<h2 className="text-lg font-semibold mb-4 text-center">🌤 Sun Info</h2>
				<div className="flex flex-col gap-3">
					<SunRow label="🌅 Sunrise" time={sun.sunrise} />
					<SunRow label="🌇 Sunset" time={sun.sunset} />
				</div>
			</div>
		</div>
	);
}

function SunRow({ label, time }: { label: string; time: string }) {
	const date = new Date(time);
	const formatted = date.toLocaleTimeString("ja-JP", {
		hour: "2-digit",
		minute: "2-digit",
	});
	return (
		<div className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-xl">
			<span className="text-sm opacity-80">{label}</span>
			<span className="font-mono">{formatted}</span>
		</div>
	);
}
