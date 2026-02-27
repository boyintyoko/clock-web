"use client";

import { useEffect, useRef, useState } from "react";
import SecondHand from "./secondHand";
import MinuteHand from "./minuteHand";
import HourHand from "./hourHand";

interface Props {
	isDarkMode: boolean;
}

export default function Clock({ isDarkMode }: Props) {
	const clockRef = useRef<HTMLDivElement>(null);
	const [radius, setRadius] = useState(0);

	// 時計サイズから半径を計算
	useEffect(() => {
		const updateRadius = () => {
			if (clockRef.current) {
				const size = clockRef.current.clientWidth;
				setRadius(size / 2 - 30); // 数字を内側に少し寄せる
			}
		};

		updateRadius();
		window.addEventListener("resize", updateRadius);
		return () => window.removeEventListener("resize", updateRadius);
	}, []);

	return (
		<div
			ref={clockRef}
			className={`
				relative
				w-[90vw] max-w-[400px]
				aspect-square
				flex items-center justify-center
				rounded-full border-8
				${isDarkMode ? "border-black" : "border-white"}
				shadow-2xl
				bg-white/25 backdrop-blur-md
			`}
		>
			{/* 数字 */}
			{[...Array(12)].map((_, index) => {
				const number = (index + 12) % 12 || 12;
				const rotation = index * 30;

				return (
					<div
						key={index}
						className={`
							absolute
							top-1/2 left-1/2
							w-8 h-8
							flex items-center justify-center
							font-bold text-lg
							${isDarkMode ? "text-black" : "text-white"}
						`}
						style={{
							transform: `
								translate(-50%, -50%)
								rotate(${rotation}deg)
								translateY(-${radius}px)
								rotate(-${rotation}deg)
							`,
						}}
					>
						{number}
					</div>
				);
			})}

			{/* 中心の点 */}
			<div
				className={`absolute h-4 w-4 rounded-full z-10 ${
					isDarkMode ? "bg-black" : "bg-white"
				}`}
			/>

			{/* 針 */}
			<SecondHand isDarkMode={isDarkMode} />
			<MinuteHand isDarkMode={isDarkMode} />
			<HourHand isDarkMode={isDarkMode} />
		</div>
	);
}
