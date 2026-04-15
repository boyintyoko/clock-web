"use client";

import { useEffect, useState } from "react";
import { useBackground } from "./context/backgroundContext";
import ElectronicClock from "./components/electronicClock";
import Loading from "./components/loading/loading";
import styled from "styled-components";
import colors from "@/data/colorData";
import colorsRGB from "@/data/colorRGBData";
import Clock from "./components/clock";
import { useTimeZone } from "./context/timeZoneContext";
import VersionFunc from "@/lib/versionFunc";
import HistoryType from "@/app/types/HistoryType";
import HeaderMain from "./components/header/main";
import ModalButton from "./components/modalComnponents/modalButton";
import Search from "./components/searchComponents/search";
import Modal from "./components/modal/modal";
import SettingContent from "./components/modalComnponents/modalContents/settingContent";
import TimeZoneContent from "./components/modalComnponents/modalContents/timeZoneContent";
import GoodsContent from "./components/modalComnponents/modalContents/goodsContent";
import LinkSettingContent from "./components/modalComnponents/modalContents/linkSettingContent";
import LapsContent from "./components/modalComnponents/modalContents/lapsContent";
import AuthGuard from "./components/AuthGuard";
import { supabase } from "@/lib/supabase";

interface MainSelectionProps {
	$background: string;
}

interface UrlItem {
	link: string;
	url: string;
	alt: string;
	id: number;
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
	const [isLapsOpen, setIsLapsOpen] = useState<boolean>(false);
	const [isGoodsOpen, setIsGoodsOpen] = useState<boolean>(false);
	const [isTimeZoneOpen, setIsTimeZoneOpen] = useState<boolean>(false);
	const [isHistoriesOpen, setIsHistoriesOpen] = useState<boolean>(false);
	const { background } = useBackground();
	const { isNowTimeZone } = useTimeZone();
	const [temperatureUnits, setTempratureUnits] = useState<string>("F");
	const [isLinkSettingOpen, setIsLinkSettingOpen] = useState<boolean>(false);
	const [urls, setUrls] = useState<UrlItem[]>([]);
	const [isSearch, setIsSearch] = useState<boolean>(false);
	const [histories, setHistories] = useState<HistoryType[]>([]);

	useEffect(() => {
		VersionFunc();
	}, []);

	useEffect(() => {
		const saved = localStorage.getItem("isDarkMode");

		if (!(saved === "true" || saved === "false")) {
			localStorage.setItem("isDarkMode", "false");
			setIsDarkMode(false);
			return;
		}

		if (!saved) return;

		setIsDarkMode(JSON.parse(saved));
	}, []);

	const changeDarkMode = async (value: boolean) => {
		localStorage.setItem("isDarkMode", JSON.stringify(value));
		setIsDarkMode(value);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { error } = await supabase.from("settings").upsert(
			{
				user_id: user.id,
				dark_mode: value,
			},
			{
				onConflict: "user_id",
			},
		);

		if (error) {
			console.error("ダークモード保存失敗:", error);
		} else {
			console.log("ダークモード保存成功");
		}
	};

	const checkImage = (userBackgroundImage: string) => {
		const defaultImage =
			"url(https://boyintyoko.github.io/clock-web/assets/initialValuePhoto.avif)";

		if (!userBackgroundImage) {
			return defaultImage;
		}

		if (userBackgroundImage.startsWith("hsl")) {
			return undefined;
		}

		if (userBackgroundImage.startsWith("https")) {
			return `url(${userBackgroundImage})`;
		}

		const nameWithoutExt = userBackgroundImage.replace(".png", "");

		if (colors.includes(nameWithoutExt)) {
			return `url(https://github.com/boyintyoko/boyintyoko.github.io/blob/main/clock-web/icons/colors/${userBackgroundImage}?raw=true)`;
		}

		return defaultImage;
	};

	useEffect(() => {
		const hasVisited = localStorage.getItem("hasVisited");

		if (!hasVisited) {
			localStorage.setItem("hasVisited", JSON.stringify(true));
		}
	}, []);

	useEffect(() => {
		const loadDarkMode = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session?.user) return;

			const { data, error } = await supabase
				.from("settings")
				.select("dark_mode")
				.eq("user_id", session.user.id)
				.single();

			if (!error && data) {
				setIsDarkMode(data.dark_mode ?? false);

				localStorage.setItem(
					"isDarkMode",
					JSON.stringify(data.dark_mode ?? false),
				);

				console.log("Supabaseからdark_mode取得成功");
			}
		};

		loadDarkMode();
	}, []);

	return (
		<AuthGuard>
			<MainSelection $background={background}>
				<div
					className="flex flex-col justify-center items-center min-h-[100dvh] w-full"
					style={{
						backgroundImage: checkImage(background),

						backgroundColor:
							background.startsWith("hsl") ||
							background.startsWith("rgb") ||
							background.startsWith("#")
								? background
								: undefined,

						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
					}}
				>
					<HeaderMain
						isDarkMode={isDarkMode}
						isNowTimeZone={isNowTimeZone}
						setIsDarkMode={changeDarkMode}
						temperatureUnits={temperatureUnits}
						setTempratureUnits={setTempratureUnits}
						setHistories={setHistories}
						histories={histories}
					/>

					<Loading />
					<ElectronicClock isDarkMode={isDarkMode} />
					<Clock isDarkMode={isDarkMode} />
				</div>
				<div className="absolute bottom-4 right-4 flex space-x-4 z-10 max-lg:hidden">
					<ModalButton
						isOpen={isGoodsOpen}
						setIsOpen={setIsGoodsOpen}
						isDarkMode={isDarkMode}
						blackImageUrl="https://boyintyoko.github.io/clock-web/icons/heartIcons/heartBlack.svg"
						whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/heartIcons/heartWhite.svg"
					/>

					<ModalButton
						isOpen={isSettingOpen}
						setIsOpen={setIsSettingOpen}
						isDarkMode={isDarkMode}
						blackImageUrl="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingBlack.svg"
						whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingWhite.svg"
					/>

					<ModalButton
						isOpen={isTimeZoneOpen}
						setIsOpen={setIsTimeZoneOpen}
						isDarkMode={isDarkMode}
						blackImageUrl="https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneBlack.svg"
						whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneWhite.svg"
					/>

					<ModalButton
						isOpen={isLapsOpen}
						setIsOpen={setIsLapsOpen}
						isDarkMode={isDarkMode}
						blackImageUrl="https://raw.githubusercontent.com/boyintyoko/boyintyoko.github.io/1d309029b0cdbcc1fac719489923a8570a038ad0/clock-web/icons/lapsIcons/lapsBlack.svg"
						whiteImageUrl="https://raw.githubusercontent.com/boyintyoko/boyintyoko.github.io/1d309029b0cdbcc1fac719489923a8570a038ad0/clock-web/icons/lapsIcons/lapsWhite.svg"
					/>
				</div>

				<div className="max-lg:hidden">
					<Search
						isDarkMode={isDarkMode}
						isHistoriesOpen={isHistoriesOpen}
						setIsHistoriesOpen={setIsHistoriesOpen}
						setIsLinkSettingOpen={setIsLinkSettingOpen}
						isLinkSettingOpen={isLinkSettingOpen}
						urls={urls}
						setUrls={setUrls}
						isSearch={isSearch}
						setIsSearch={setIsSearch}
						histories={histories}
						setHistories={setHistories}
					/>
				</div>

				<Modal isOpen={isGoodsOpen} setIsOpen={setIsGoodsOpen} title="Goods">
					<GoodsContent isGoodsOpen={isGoodsOpen} />
				</Modal>

				<Modal
					isOpen={isSettingOpen}
					setIsOpen={setIsSettingOpen}
					title="Setting"
				>
					<SettingContent
						temperatureUnits={temperatureUnits}
						setTemperatureUnits={setTempratureUnits}
						isSettingOpen={isSettingOpen}
						setIsSettingOpen={setIsSettingOpen}
					/>
				</Modal>

				<Modal
					isOpen={isTimeZoneOpen}
					setIsOpen={setIsTimeZoneOpen}
					title="Time Zone"
				>
					<TimeZoneContent />
				</Modal>

				<Modal
					isOpen={isLinkSettingOpen}
					setIsOpen={setIsLinkSettingOpen}
					title="Link setting"
				>
					<LinkSettingContent urls={urls} setUrls={setUrls} />
				</Modal>

				<Modal isOpen={isLapsOpen} setIsOpen={setIsLapsOpen} title="Laps">
					<LapsContent />
				</Modal>
			</MainSelection>
		</AuthGuard>
	);
}
