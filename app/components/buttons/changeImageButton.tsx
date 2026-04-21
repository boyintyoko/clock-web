"use client";

import { useEffect, useState } from "react";
import ChangeImageSide from "@@/components/sideComponent/changeImageSide";
import Mask from "@@/components/sideComponent/mask";
import { useMediaQuery } from "react-responsive";

type Props = {
	isDarkMode: boolean;
};

export default function ChangeImageButton({ isDarkMode }: Props) {
	const [isChange, setIsChange] = useState(false);

	const [isVisible, setIsVisible] = useState(true);

	const isMobile = useMediaQuery({
		query: "(max-width: 440px)",
	});

	const openClickHandle = () => {
		const next = !isChange;

		setIsChange(next);

		localStorage.setItem("isSideBarChang", JSON.stringify(next));

		if (isMobile && next) {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		const saved = localStorage.getItem("isSideBarChang");

		if (!saved) return;

		setIsChange(JSON.parse(saved));
	}, []);

	return (
		<div>
			{isVisible && (
				<div>
					<button
						id="changeImageButton"
						onClick={openClickHandle}
						className={`flex flex-col items-center justify-center ${
							!isChange ? "gap-2" : "gap-0 z-50"
						} absolute top-1 left-1 h-12 w-12 bg-white hover:top-2 bg-opacity-45 shadow-lg transition-all`}
					>
						<span
							style={{ height: "2px" }}
							className={`w-8 transition-all ${
								isChange ? "absolute rotate-45" : ""
							} ${isDarkMode ? "bg-black" : "bg-white"}`}
						></span>

						<div className={`flex ${isChange ? "-rotate-45" : ""}`}>
							<div
								style={{ height: "2px" }}
								className={`w-5 transition-all ${
									isDarkMode ? "bg-black" : "bg-white"
								}`}
							></div>

							<div
								style={{ height: "2px" }}
								className={`w-3 transition-all ${
									isChange
										? isDarkMode
											? "bg-black"
											: "bg-white"
										: "bg-opacity-0"
								}`}
							></div>
						</div>
					</button>
				</div>
			)}

			<Mask
				isChange={isChange}
				setIsChange={setIsChange}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
			/>

			<ChangeImageSide
				isChange={isChange}
				setIsChange={setIsChange}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
			/>
		</div>
	);
}
