"use client";
import { useEffect, useState } from "react";
import LoadingSecondHand from "./loadingSecondHand";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function Loading() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const isFirstVisit = localStorage.getItem("hasVisited") !== "true";

		setTimeout(() => {
			setIsLoading(true);

			if (isFirstVisit) {
				const driverObj = driver({
					showProgress: true,
					steps: [
						{
							element: "#toggleMode",
							popover: {
								title: "Theme Switching",
								description:
									"You can change the theme of your website with a toggle.",
								side: "left",
								align: "start",
							},
						},
						{
							element: "#changeImageButton",
							popover: {
								title: "Image Change Button",
								description:
									"This button lets you change the background image.",
								side: "left",
								align: "start",
							},
						},
						{
							element: "#electronicClock",
							popover: {
								title: "Digital Clock",
								description: "Displays the current date and time.",
								side: "left",
								align: "start",
							},
						},
						{
							element: "#clock",
							popover: {
								title: "Analog Clock",
								description: "Check the current time in analog format.",
								side: "left",
								align: "start",
							},
						},
						{
							element: "#inputSearch",
							popover: {
								title: "Search",
								description: "You can search using this input.",
								side: "left",
								align: "start",
							},
						},
					],
				});

				driverObj.drive();
				localStorage.setItem("hasVisited", "true");
			}
		}, 1500);
	}, []);

	return (
		<div
			style={{ zIndex: "500" }}
			className={`flex justify-center items-center transition-all bg-center bg-cover ${
				isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
			} absolute h-screen w-screen bg-white z-50`}
		>
			<div
				className={`relative flex justify-center items-center h-96 w-96 rounded-full border-8
        shadow-2xl transition-all top-0 hover:top-1 bg-white bg-opacity-25 backdrop-blur-md hover:backdrop-blur-0`}
			>
				{[...Array(12)].map((_, index) => {
					const number = (index + 12) % 12 || 12;
					const rotation = index * 30;
					return (
						<div
							key={index}
							className={`absolute flex justify-center items-center w-10 h-10 font-black text-xl`}
							style={{
								transform: `rotate(${rotation}deg) translate(0, -140px) rotate(-${rotation}deg)`,
							}}
						>
							{number}
						</div>
					);
				})}
				<div className="h-5 w-5 bg-black rounded-full"></div>
				<LoadingSecondHand />
			</div>
		</div>
	);
}
