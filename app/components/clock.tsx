import SecondHand from "./secondHand";
import MinuteHand from "./minuteHand";
import HourHand from "./hourHand";

interface Props {
	isDarkMode: boolean;
}

export default function Clock({ isDarkMode }: Props) {
	return (
		<div
			id="clock"
			className={`
        relative
        flex justify-center items-center
        w-[90vw] max-w-[400px]
        aspect-square
        rounded-full
        border-[8px]
        ${isDarkMode ? "border-black" : "border-white"}
        shadow-2xl
        transition-all
        hover:translate-y-1
        bg-white/25
        backdrop-blur-md
        hover:backdrop-blur-0`}
		>
			{[...Array(12)].map((_, index) => {
				const number = (index + 12) % 12 || 12;
				const rotation = index * 30;
				return (
					<div
						key={index}
						className={`absolute transition-all flex justify-center items-center w-10 h-10 font-black text-xl ${
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
				className={`dot h-5 w-5 rounded-full transition-all z-10 ${
					isDarkMode ? "bg-black" : "bg-white"
				}`}
				style={{
					boxShadow: `0px 0px 4px ${isDarkMode ? "#000" : "#fff"}`,
				}}
			></div>
			<SecondHand isDarkMode={isDarkMode} />
			<MinuteHand isDarkMode={isDarkMode} />
			<HourHand isDarkMode={isDarkMode} />
		</div>
	);
}
