"use client";

import type React from "react";
import { useEffect } from "react";
import { useLanguage } from "@/app/context/languageContext";
import { useTime } from "@/app/context/timeContext";
import { supabase } from "@/lib/supabase";

type Props = {
	setIsSettingOpen: (isOpen: boolean) => void;
	temperatureUnits: string;
	setTemperatureUnits: (temperatureUnits: string) => void;
};

export default function SettingContent({
	setIsSettingOpen,
	temperatureUnits,
	setTemperatureUnits,
}: Props) {
	const { setIsNowLanguage, isNowLanguage } = useLanguage();
	const { setIsNowTime, isNowTime } = useTime();

	const handleLanguageChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const selectedLanguage = e.target.value;

		setIsNowLanguage(selectedLanguage);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { error } = await supabase.from("settings").upsert(
			{
				user_id: user.id,
				language: selectedLanguage,
			},
			{
				onConflict: "user_id",
			},
		);

		if (error) console.error("language error:", error);
	};

	const handleFormatChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const selectedFormat = Number(e.target.value);

		setIsNowTime(selectedFormat);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { error } = await supabase.from("settings").upsert(
			{
				user_id: user.id,
				time_format: selectedFormat,
			},
			{
				onConflict: "user_id",
			},
		);

		if (error) console.error("time error:", error);
	};

	const handleTemperatureChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = e.target.value;

		setTemperatureUnits(value);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { error } = await supabase.from("settings").upsert(
			{
				user_id: user.id,
				temperature_unit: value,
			},
			{
				onConflict: "user_id",
			},
		);

		if (error) console.error("temperature error:", error);
	};

	// 🔥 初回ロード（Supabase → state）
	useEffect(() => {
		const fetchSettings = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("settings")
				.select("*")
				.eq("user_id", user.id)
				.maybeSingle();

			if (error) {
				console.error("fetch error:", error);
				return;
			}

			if (data) {
				setIsNowLanguage(data.language ?? "en");

				setIsNowTime(data.time_format ?? 24);

				setTemperatureUnits(data.temperature_unit ?? "metric");
			} else {
				// 🔥 初回ユーザー用（ここ超重要）
				await supabase.from("settings").insert({
					user_id: user.id,
				});
			}
		};

		fetchSettings();
	}, []);

	const clearMemories = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { error: settingsError } = await supabase.from("settings").upsert(
			{
				user_id: user.id,
				language: "en",
				time_format: 24,
				temperature_unit: "metric",
			},
			{
				onConflict: "user_id",
			},
		);

		if (settingsError) {
			console.error("settings reset error:", settingsError);
			return;
		}
		const { error: goodsError } = await supabase
			.from("goods")
			.delete()
			.eq("user_id", user.id);

		if (goodsError) {
			console.error("goods delete error:", goodsError);
			return;
		}

		setIsSettingOpen(false);

		setIsNowLanguage("en");
		setIsNowTime(24);
		setTemperatureUnits("metric");

		window.location.reload();
	};
	return (
		<div className="space-y-6 fade-in-up">
			<div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
				<label className="block font-semibold text-lg mb-3">
					{isNowLanguage === "en"
						? "Additional plans"
						: isNowLanguage === "it"
							? "Piani aggiuntivi"
							: "追加プラン"}
				</label>

				<div className="flex gap-3 w-full justify-center">
					<button
						className="
      flex-1 h-14
      bg-gray-800/80
      backdrop-blur-md
      border border-white/10
      rounded-xl

      flex flex-col items-center justify-center

      hover:bg-gray-700/80
      hover:border-white/20
      hover:scale-[1.02]

      transition-all duration-200
      active:scale-[0.98]
    "
					>
						<span className="text-lg font-semibold text-white">Premium</span>
					</button>

					<button
						className="
      flex-1 h-14
      bg-gradient-to-br
      from-indigo-500
      to-purple-600

      border border-white/20
      rounded-xl

      flex flex-col items-center justify-center

      hover:scale-[1.02]
      hover:brightness-110

      transition-all duration-200
      active:scale-[0.98]

      shadow-lg shadow-purple-500/20
    "
					>
						<span className="text-lg font-bold text-white">Premium+</span>
					</button>
				</div>
			</div>

			<div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
				<label className="block font-semibold text-lg mb-3">
					{isNowLanguage === "en"
						? "Time format"
						: isNowLanguage === "it"
							? "Formato dell'orologio"
							: "時間形式"}
				</label>

				<select
					onChange={handleFormatChange}
					value={isNowTime}
					className="w-full rounded-xl border border-gray-400/40 bg-white/20 p-2"
				>
					<option value="24">24-hour format</option>

					<option value="12">12-hour format (AM/PM)</option>
				</select>
			</div>

			<div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
				<label className="block font-semibold text-lg mb-3">Language</label>

				<select
					value={isNowLanguage}
					onChange={handleLanguageChange}
					className="w-full rounded-xl border border-gray-400/40 bg-white/20 p-2"
				>
					<option value="en">English</option>

					<option value="it">Italian</option>

					<option value="ja">日本語</option>
				</select>
			</div>

			<div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
				<label className="block font-semibold text-lg mb-3">
					Temperature units
				</label>

				<select
					value={temperatureUnits}
					onChange={handleTemperatureChange}
					className="w-full rounded-xl border border-gray-400/40 bg-white/20 p-2"
				>
					<option value="kelvin">K</option>

					<option value="imperial">°F</option>

					<option value="metric">°C</option>
				</select>
			</div>

			<div className="pt-2">
				<button
					onClick={clearMemories}
					className="w-full rounded-xl border border-red-400 text-red-400 p-3 font-semibold hover:bg-red-400 hover:text-white"
				>
					Clear memories
				</button>
			</div>
		</div>
	);
}
