"use client";

import { useEffect, useRef, useCallback, useState } from "react";
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
	// プランがfreeなら何も表示しない
	if (plan === "free") return null;

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

	// ======================
	// 安全な座標を計算する関数 (はみ出し防止)
	// ======================
	const getClampedPosition = useCallback((x: number, y: number) => {
		if (!cardRef.current) return { x, y };

		const rect = cardRef.current.getBoundingClientRect();
		// 画面中央からの可動限界距離を計算 (画面がカードより小さい場合は0にする)
		const limitX = Math.max(0, (window.innerWidth - rect.width) / 2);
		const limitY = Math.max(0, (window.innerHeight - rect.height) / 2);

		return {
			x: Math.max(-limitX, Math.min(x, limitX)),
			y: Math.max(-limitY, Math.min(y, limitY)),
		};
	}, []);

	// ======================
	// 状態保存
	// ======================
	const saveState = useCallback(
		(
			newPos: { x: number; y: number },
			lockedValue: boolean,
			currentUserId: string | null,
		) => {
			if (!currentUserId) return;

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
		},
		[],
	);

	// ======================
	// 初期ロード
	// ======================
	useEffect(() => {
		const init = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				setUserId(user.id);
				const { data: stateData } = await supabase
					.from("sun_widget_state")
					.select("*")
					.eq("user_id", user.id)
					.single();

				if (stateData) {
					// 保存された位置を読み込んだ後、現在の画面サイズに合わせて補正
					const initialPos = getClampedPosition(stateData.x, stateData.y);
					setPos(initialPos);
					setLocked(stateData.locked);
				}
			}

			try {
				const position = await new Promise<GeolocationPosition>(
					(resolve, reject) =>
						navigator.geolocation.getCurrentPosition(resolve, reject),
				);
				const res = await axios.get("https://api.sunrise-sunset.org/json", {
					params: {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
						formatted: 0,
					},
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
	}, [getClampedPosition]);

	// ======================
	// ドラッグ処理 & リサイズ監視
	// ======================
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!dragging.current || locked) return;

			const newX = e.clientX - offset.current.x;
			const newY = e.clientY - offset.current.y;

			const clamped = getClampedPosition(newX, newY);
			setPos(clamped);
			saveState(clamped, locked, userId);
		};

		const handleMouseUp = () => {
			dragging.current = false;
		};

		const handleResize = () => {
			setPos((prev) => {
				const clamped = getClampedPosition(prev.x, prev.y);
				// リサイズではみ出た場合は保存もし直す
				if (clamped.x !== prev.x || clamped.y !== prev.y) {
					saveState(clamped, locked, userId);
				}
				return clamped;
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("resize", handleResize);
		};
	}, [locked, userId, getClampedPosition, saveState]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (locked) return;
		dragging.current = true;
		offset.current = {
			x: e.clientX - pos.x,
			y: e.clientY - pos.y,
		};
	};

	if (loading) return null; // または読み込み中UI
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
