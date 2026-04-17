import { useEffect, useState } from "react";

export default function LoadingSecondHand() {
	const [angle, setAngle] = useState(-90);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setAngle(270);
		}, 50);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			className="
			absolute
			left-1/2
			top-1/2

			w-[160px]
			h-[2px]

			rounded-full

			bg-gradient-to-r
			from-white
			to-white/20

			shadow-[0_0_8px_rgba(255,255,255,0.8)]

			transition-transform
			duration-[1400ms]
			ease-in-out
			"
			style={{
				transformOrigin: "0% 50%",
				transform: `rotate(${angle}deg)`,
			}}
		/>
	);
}
