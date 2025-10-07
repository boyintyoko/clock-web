"use client";

import { useEffect, useState } from "react";
import { useBackground } from "./context/backgroundContext";
import ElectronicClock from "./components/electronicClock";
import Loading from "./components/loading/loading";
import styled from "styled-components";
import colors from "@/data/colorData";
import colorsRGB from "@/data/colorRGBData";
import Search from "./components/searchComponents/search";
import Clock from "./components/clock";
import { useTimeZone } from "./context/timeZoneContext";
import HeaderMain from "./components/header/main";
import VersionFunc from "@/lib/versionFunc";
import axios from "axios";
import UrlItem from "./types/UrlItems";
import Modals from "./components/modalComnponents/modals";
import ModalButtons from "./components/modalComnponents/modalButtons";

interface MainSelectionProps {
	$background: string;
}

const MainSelection = styled.div<MainSelectionProps>`
  ::selection {
   background: ${(props) =>
			colors.includes(props.$background)
				? "#fff"
				: colorsRGB[props.$background.replace(".png", "")]};
    color: ${(props) =>
			colors.includes(props.$background.replace(".png", "")) ? "#fff" : "#000"};
  }
`;

export default function Home() {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
	const [isGoodsOpen, setIsGoodsOpen] = useState<boolean>(false);
	const [isTimeZoneOpen, setIsTimeZoneOpen] = useState<boolean>(false);
	const [isHistoriesOpen, setIsHistoriesOpen] = useState<boolean>(false);
	const { background } = useBackground();
	const { isNowTimeZone } = useTimeZone();
	const [temperatureUnits, setTempratureUnits] = useState<string>("F");
	const [isLinkSettingOpen, setIsLinkSettingOpen] = useState<boolean>(false);
	const [urls, setUrls] = useState<UrlItem[]>([]);

	useEffect(() => {
		VersionFunc();
	}, []);

	useEffect(() => {
		const isDarkMode = localStorage.getItem("isDarkMode");
		if (!(isDarkMode === "true" || isDarkMode === "false")) {
			localStorage.setItem("isDarkMode", "false");
			setIsDarkMode(false);
			return;
		}
		if (!isDarkMode) return;
		setIsDarkMode(JSON.parse(isDarkMode));
	}, [isDarkMode]);

	const checkImage = (userBackgroundImage: string) => {
		if (!userBackgroundImage) {
			return "url(https://boyintyoko.github.io/clock-web/assets/initialValuePhoto.avif)";
		}

		if (userBackgroundImage.startsWith("https")) {
			const checkUrl = async () => {
				try {
					const res = await axios.get(userBackgroundImage);
					console.log(res);
					if (res.status === 200) return `url(${userBackgroundImage})`;
					if (res.status === 500)
						return "url(https://boyintyoko.github.io/clock-web/assets/initialValuePhoto.avif)";
				} catch (error) {
					console.error("Error fetching URL:", error);
				}
			};

			checkUrl();
			return `url(${userBackgroundImage})`;
		}

		if (colors.includes(userBackgroundImage) + ".png") {
			return `url(https://boyintyoko.github.io/clock-web/icons/colors/${userBackgroundImage}.png)`;
		} else {
			return "url(https://boyintyoko.github.io/clock-web/assets/initialValuePhoto.avif)";
		}
	};

	useEffect(() => {
		const hasVisited = localStorage.getItem("hasVisited");

		if (!hasVisited) {
			localStorage.setItem("hasVisited", JSON.stringify(true));
		}
	}, []);

	return (
		<MainSelection $background={background}>
			<div
				className="flex flex-col justify-center items-center h-screen w-full bg-center bg-no-repeat bg-cover"
				style={{
					backgroundImage: checkImage(background),
				}}
			>
				<HeaderMain
					isDarkMode={isDarkMode}
					isNowTimeZone={isNowTimeZone}
					setIsDarkMode={setIsDarkMode}
					temperatureUnits={temperatureUnits}
					setTempratureUnits={setTempratureUnits}
				/>

				<Loading />
				<ElectronicClock isDarkMode={isDarkMode} />
				<Clock isDarkMode={isDarkMode} />
				<div>
					<ModalButtons
						isDarkMode={isDarkMode}
						isSettingOpen={isSettingOpen}
						setIsSettingOpen={setIsSettingOpen}
						isTimeZoneOpen={isTimeZoneOpen}
						setIsTimeZoneOpen={setIsTimeZoneOpen}
						isGoodsOpen={isGoodsOpen}
						setIsGoodsOpen={setIsGoodsOpen}
					/>
					<Search
						isDarkMode={isDarkMode}
						isHistoriesOpen={isHistoriesOpen}
						setIsHistoriesOpen={setIsHistoriesOpen}
						setIsLinkSettingOpen={setIsLinkSettingOpen}
						isLinkSettingOpen={isLinkSettingOpen}
						urls={urls}
						setUrls={setUrls}
					/>
				</div>
			</div>
			<Modals
				isSettingOpen={isSettingOpen}
				setIsSettingOpen={setIsSettingOpen}
				temperatureUnits={temperatureUnits}
				setTemperatureUnits={setTempratureUnits}
				isTimeZoneOpen={isTimeZoneOpen}
				setIsTimeZoneOpen={setIsTimeZoneOpen}
				isGoodsOpen={isGoodsOpen}
				setIsGoodsOpen={setIsGoodsOpen}
				isLinkSettingOpen={isLinkSettingOpen}
				setIsLinkSettingOpen={setIsLinkSettingOpen}
				urls={urls}
				setUrls={setUrls}
			/>
		</MainSelection>
	);
}
