import { useEffect, useState } from "react";

export default function LoadingSecondHand() {
	const [angle, setAngle] = useState(-90);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setAngle(270);
		}, 0);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			className="absolute left-1/2 w-44 bg-black"
			style={{
				height: "2px",
				borderRadius: "9999px",
				transformOrigin: "0% 50%",
				boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.4)",
				transition: "transform 1s ease-in-out",
				transform: `rotate(${angle}deg)`,
			}}
		></div>
	);
}
