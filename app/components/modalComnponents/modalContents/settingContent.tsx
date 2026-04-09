"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/languageContext";
import { useTime } from "@/app/context/timeContext";

interface SettingType {
	isSettingOpen: boolean;
	setIsSettingOpen: (isOpen: boolean) => void;
	temperatureUnits: string;
	setTemperatureUnits: (temperatureUnits: string) => void;
}

export default function SettingContent({
	isSettingOpen,
	setIsSettingOpen,
	temperatureUnits,
	setTemperatureUnits,
}: SettingType) {
	const { setIsNowLanguage, isNowLanguage } = useLanguage();
	const { setIsNowTime, isNowTime } = useTime();
	const [isLocation, setIsLocation] = useState<boolean>(false);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				() => {
					setIsLocation(true);
				},
				() => {
					setIsLocation(false);
				},
			);
		} else {
			setIsLocation(false);
		}
	}, []);

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedLanguage = e.target.value;
		setIsNowLanguage(selectedLanguage);
		localStorage.setItem("language", selectedLanguage);
	};

	const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedFormat = e.target.value;
		setIsNowTime(Number(selectedFormat));
		localStorage.setItem("time", selectedFormat);
	};

	const handleTemperatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTemperatureUnits(e.target.value);
		localStorage.setItem("temperatureUnits", e.target.value);
	};

	useEffect(() => {
		const time = localStorage.getItem("time");
		const language = localStorage.getItem("language");
		const tempUnit = localStorage.getItem("temperatureUnits");

		if (time) setIsNowTime(Number(time));
		if (language) setIsNowLanguage(language);
		if (!language) setIsNowLanguage("en");
		if (tempUnit) setTemperatureUnits(tempUnit);
	}, [setIsNowLanguage, setIsNowTime, setTemperatureUnits]);

	const clearMemories = () => {
		localStorage.clear();
		setIsSettingOpen(!isSettingOpen);
		window.location.reload();
	};

	return (
		<div className="space-y-6 fade-in-up">
			{/* Time format */}
			<div
				className="
      fade-in-up
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
					className="
          w-full
          rounded-xl
          border border-gray-400/40
          bg-white/20
          backdrop-blur
          p-2
          outline-none
          transition-all duration-200
          hover:bg-white/30
        "
				>
					<option value="24">
						{isNowLanguage === "en"
							? "24-hour format"
							: isNowLanguage === "it"
								? "Formato 24 ore"
								: "24時間形式"}
					</option>

					<option value="12">
						{isNowLanguage === "en"
							? "12-hour format (AM/PM)"
							: isNowLanguage === "it"
								? "Formato 12 ore (AM/PM)"
								: "12時間形式 (AM/PM)"}
					</option>
				</select>
			</div>

			{/* Language */}
			<div
				className="
      fade-in-up
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
				<label className="block font-semibold text-lg mb-3">
					{isNowLanguage === "en"
						? "Language"
						: isNowLanguage === "it"
							? "Lingua"
							: "言語"}
				</label>

				<select
					value={isNowLanguage}
					onChange={handleLanguageChange}
					className="
          w-full
          rounded-xl
          border border-gray-400/40
          bg-white/20
          backdrop-blur
          p-2
          outline-none
          transition-all duration-200
          hover:bg-white/30
        "
				>
					<option value="en">English</option>
					<option value="it">Italian</option>
					<option value="ja">日本語</option>
				</select>
			</div>

			{/* Temperature */}
			{isLocation && (
				<div
					className="
        fade-in-up
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
					<label className="block font-semibold text-lg mb-3">
						{isNowLanguage === "en"
							? "Temperature units"
							: isNowLanguage === "it"
								? "Unità di temperatura"
								: "温度の単位"}
					</label>

					<select
						value={temperatureUnits}
						onChange={handleTemperatureChange}
						className="
            w-full
            rounded-xl
            border border-gray-400/40
            bg-white/20
            backdrop-blur
            p-2
            outline-none
            transition-all duration-200
            hover:bg-white/30
          "
					>
						<option value="kelvin">K</option>
						<option value="imperial">°F</option>
						<option value="metric">°C</option>
					</select>
				</div>
			)}

			{/* Clear button */}
			<div className="fade-in-up pt-2">
				<button
					onClick={clearMemories}
					className="
          w-full
          rounded-xl
          border border-red-400
          text-red-400
          p-3
          font-semibold
          transition-all duration-200
          hover:bg-red-400
          hover:text-white
          hover:-translate-y-1
          active:scale-95
        "
				>
					Clear memories
				</button>
			</div>
		</div>
	);
}
