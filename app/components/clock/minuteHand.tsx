"use client";
import { useTimeZone } from "@@/context/timeZoneContext";
import { useEffect, useState } from "react";

type Props = {
	isDarkMode: boolean;
};

export default function MinuteHand({ isDarkMode }: Props) {
	const [minuteAngle, setMinuteAngle] = useState<number>(0);
	const { isNowTimeZone } = useTimeZone();

	useEffect(() => {
		if (!isNowTimeZone) return;

		const formatter = new Intl.DateTimeFormat("ja-JP", {
			timeZone: isNowTimeZone,
			minute: "2-digit",
		});

		const getMinutes = () => {
			const parts = formatter.formatToParts(new Date());

			const minuteStr = parts.find((p) => p.type === "minute")?.value ?? "0";

			const minutes = parseInt(minuteStr, 10);

			setMinuteAngle((360 + minutes * 6 - 90) % 360);
		};

		getMinutes();

		const intervalId = setInterval(getMinutes, 1000);

		return () => clearInterval(intervalId);
	}, [isNowTimeZone]);

	return (
		<div
			className={`
        absolute
        top-1/2
        left-1/2
        h-[3px]
        w-[35%]
        transition-all
        ${isDarkMode ? "bg-black" : "bg-white"}
      `}
			style={{
				borderRadius: "9999px",
				transformOrigin: "0% 50%",
				transform: `
          translate(0%, -50%)
          rotate(${minuteAngle}deg)
        `,
				boxShadow: "0px 0px 4px rgba(0,0,0,0.4)",
				transition: "transform 0.2s linear",
			}}
		/>
	);
}
