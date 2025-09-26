"use client";

interface isDarkModeType {
	isDarkMode: boolean;
}

import { useEffect, useState } from "react";
import ChangeImageSide from "./sideComponent/changeImageSide";
import Mask from "./sideComponent/mask";

export default function ChangeImageButton({ isDarkMode }: isDarkModeType) {
	const [isChange, setIsChange] = useState<boolean>(false);

	const openClickHandle = () => {
		setIsChange(!isChange);
		localStorage.setItem("isSideBarChang", JSON.stringify(!isChange));
	};

	useEffect(() => {
		const isSideBarChange = localStorage.getItem("isSideBarChang");
		if (!isSideBarChange) return;
		setIsChange(JSON.parse(isSideBarChange));
	}, []);

	return (
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
				<div className={`flex ${isChange && "-rotate-45"}`}>
					<div
						style={{ height: "2px" }}
						className={`w-5 transition-all ${isDarkMode ? "bg-black" : "bg-white"}`}
					></div>
					<div
						style={{ height: "2px" }}
						className={`w-3 transition-all ${isChange ? (isDarkMode ? "bg-black" : "bg-white") : "bg-opacity-0"}`}
					></div>
				</div>
			</button>
			<Mask isChange={isChange} setIsChange={setIsChange} />
			<ChangeImageSide isChange={isChange} setIsChange={setIsChange} />
		</div>
	);
}
