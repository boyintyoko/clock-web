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
	const [version, setVersion] = useState<string>("");

	useEffect(() => {
		const version = localStorage.getItem("APP_VERSION");
		if (!version) return;
		setVersion(version);
	}, []);

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
		<div className="space-y-6">
			<div>
				<label className="block font-bold text-lg mb-2 transition-all hover:translate-y-1">
					{isNowLanguage === "en"
						? "Time format"
						: isNowLanguage === "it"
							? "Formato dell'orologio"
							: "時間形式"}
				</label>
				<select
					onChange={handleFormatChange}
					value={isNowTime}
					className="block w-full border rounded-lg p-2 transition-all hover:translate-y-1"
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

			<div>
				<label className="block font-bold text-lg mb-2 transition-all hover:translate-y-1">
					{isNowLanguage === "en"
						? "Language"
						: isNowLanguage === "it"
							? "Lingua"
							: "言語"}
				</label>
				<select
					value={isNowLanguage}
					onChange={handleLanguageChange}
					className="block w-full border rounded-lg p-2 transition-all hover:translate-y-1"
				>
					<option value="en">English</option>
					<option value="it">Italian</option>
					<option value="ja">日本語</option>
				</select>
			</div>

			{isLocation && (
				<div>
					<label className="block font-bold text-lg mb-2 transition-all hover:translate-y-1">
						{isNowLanguage === "en"
							? "Temperature units"
							: isNowLanguage === "it"
								? "Unità di temperatura"
								: "温度の単位"}
					</label>
					<select
						value={temperatureUnits}
						onChange={handleTemperatureChange}
						className="block w-full border rounded-lg p-2 transition-all hover:translate-y-1"
					>
						<option value="kelvin">K</option>
						<option value="imperial">°F</option>
						<option value="metric">°C</option>
					</select>
				</div>
			)}

			<div>
				<button
					onClick={clearMemories}
					className="border-red-500 border p-3 rounded-full text-red-500 transition-all hover:translate-y-1"
				>
					Clear memories
				</button>
			</div>

			<div className="fixed bottom-3 right-2 -translate-x-1/2">
				<p className="font-bold">Version: {version}</p>
			</div>
		</div>
	);
}
