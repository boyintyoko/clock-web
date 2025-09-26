"use client";
import { useEffect, useState } from "react";
import { useTimeZone } from "../context/timeZoneContext";

interface isDarkModeType {
	isDarkMode: boolean;
}

export default function HourHand({ isDarkMode }: isDarkModeType) {
	const [hourAngle, setHourAngle] = useState<number>(0);
	const { isNowTimeZone } = useTimeZone();

	useEffect(() => {
		if (!isNowTimeZone) return;

		const formatter = new Intl.DateTimeFormat("ja-JP", {
			timeZone: isNowTimeZone,
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});

		const updateHourAngle = () => {
			const parts = formatter.formatToParts(new Date());
			const hourStr = parts.find((p) => p.type === "hour")?.value ?? "0";
			const minuteStr = parts.find((p) => p.type === "minute")?.value ?? "0";

			const hours = parseInt(hourStr, 10);
			const minutes = parseInt(minuteStr, 10);

			const angle = (360 + (hours % 12) * 30 + minutes * 0.5 - 90) % 360;
			setHourAngle(angle);
		};

		updateHourAngle();
		const intervalId = setInterval(updateHourAngle, 60000);

		return () => clearInterval(intervalId);
	}, [isNowTimeZone]);

	return (
		<div
			className={`absolute left-1/2 transition-all ${
				isDarkMode ? "bg-black" : "bg-white"
			} w-20`}
			style={{
				height: "4px",
				borderRadius: "9999px",
				transformOrigin: "0% 50%",
				transform: `rotate(${hourAngle}deg)`,
				boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.4)",
				transition: "transform 0.2s linear",
			}}
		></div>
	);
}
