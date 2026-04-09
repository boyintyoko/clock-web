"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import ToggleSwitch from "./toggleSwitch";
import BackgroundDesc from "./backgroundDesc";
import NavigatorPermisson from "./navigatorPermisson";
import NowTimeZone from "./nowTimeZone";
import ChangeImageButton from "../changeImageButton";
import { useBackground } from "../../context/backgroundContext";
import styles from "../../css/inputLabel.module.css";
import HistoryType from "@/app/types/HistoryType";
import Image from "next/image";
import Modal from "../modal/modal";
import SettingContent from "../modalComnponents/modalContents/settingContent";
import TimeZoneContent from "../modalComnponents/modalContents/timeZoneContent";
import GoodsContent from "../modalComnponents/modalContents/goodsContent";
import ModalButton from "../modalComnponents/modalButton";
import Link from "next/link";
import urlsData from "@/data/urlData";
import History from "../searchComponents/historyComponents/history";
import LinkSettingContent from "../modalComnponents/modalContents/linkSettingContent";
import SerachHistroyContent from "../modalComnponents/modalContents/serachHistoryContent";

interface Props {
	isDarkMode: boolean;
	isNowTimeZone: string;
	temperatureUnits: string;
	setIsDarkMode: (isDarkMode: boolean) => void;
	setTempratureUnits: (temperatureUnits: string) => void;
	setHistories: React.Dispatch<React.SetStateAction<HistoryType[]>>;
	histories: HistoryType[];
}

export default function HeaderMain({
	isDarkMode,
	isNowTimeZone,
	temperatureUnits,
	setIsDarkMode,
	setTempratureUnits,
	histories,
	setHistories,
}: Props) {
	const [temperature, setTemperature] = useState<number | null>(null);

	const [humidity, setHumidity] = useState<number | null>(null);

	const [wheatherIcon, setWheatherIcon] = useState<string>("");

	const [navigatorPermission, setNavigatorPermission] =
		useState<boolean>(false);

	const [searchText, setSearchText] = useState<string>("");

	const [isGoodsOpen, setIsGoodsOpen] = useState(false);

	const [isSettingOpen, setIsSettingOpen] = useState(false);

	const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);

	const [menuOpen, setMenuOpen] = useState(false);

	const [urls, setUrls] = useState(urlsData);

	const [isHistoriesOpen, setIsHistoriesOpen] = useState(false);

	const [isLinkSettingOpen, setIsLinkSettingOpen] = useState(false);

	const { background } = useBackground();

	const handleSwitchChange = () => {
		setIsDarkMode(!isDarkMode);

		localStorage.setItem("isDarkMode", !isDarkMode ? "true" : "false");
	};

	const searchHandler = (
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
	): void => {
		e.preventDefault();

		if (searchText.trim().length > 0) {
			window.open(`https://www.google.com/search?q=${searchText}`);

			const newId =
				histories.length > 0 ? Math.max(...histories.map((h) => h.id)) + 1 : 0;

			const newHistory: HistoryType = {
				content: searchText,
				id: newId,
				create_minutes: new Date().getMinutes(),
				create_hours: new Date().getHours(),
			};

			const updatedHistory = [...histories, newHistory];

			setHistories(updatedHistory);
			localStorage.setItem("history", JSON.stringify(updatedHistory));

			setSearchText("");
		}
	};

	useEffect(() => {
		const getWeather = async () => {
			try {
				navigator.geolocation.getCurrentPosition(async (position) => {
					setNavigatorPermission(true);

					const lat = position.coords.latitude;

					const lon = position.coords.longitude;

					const res = await axios.get(
						`/api/weather?lat=${lat}&lon=${lon}&units=${temperatureUnits}`,
					);

					setTemperature(res.data.temp);
					setHumidity(res.data.hum);
					setWheatherIcon(res.data.weatherIcon);
				});
			} catch (error) {
				console.error(error);
			}
		};

		getWeather();
	}, [temperatureUnits]);

	return (
		<div>
			<ChangeImageButton isDarkMode={isDarkMode} />

			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className="
          lg:hidden
          fixed right-2 bottom-2
          hover:bottom-1
          transition-all
          h-14 w-14
          rounded-full
          bg-white/70
          backdrop-blur-md
          shadow-lg
          z-50
          flex flex-col items-center justify-center gap-[5px]
        "
			>
				<span
					className={`block h-[2px] w-5 ${isDarkMode ? "bg-black" : "bg-white"} `}
				></span>
				<span
					className={`block h-[2px] w-5 ${isDarkMode ? "bg-black" : "bg-white"} `}
				></span>
				<span
					className={`block h-[2px] w-5 ${isDarkMode ? "bg-black" : "bg-white"} `}
				></span>
			</button>

			{menuOpen && (
				<div
					className="
            fixed inset-0
            bg-black/40
            z-40
          "
					onClick={() => setMenuOpen(false)}
				/>
			)}

			{/* モバイルメニュー */}

			<div
				className={`
          lg:hidden
          fixed top-0 right-0
          h-full
          flex flex-col
          justify-between
          p-6
          backdrop-blur-md
          ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
          shadow-2xl
          transform transition-transform
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
          z-50
        `}
			>
				<div className="flex flex-col gap-6 mt-5">
					<div
						className={`flex items-center
  h-14 md:h-16
  bg-white bg-opacity-50
  rounded-full shadow-lg
w-56
  hover:ring-blue-500 ring-4
  transition-all hover:shadow-2xl hover:translate-y-2`}
						id="inputSearch"
					>
						<div className={`${styles.input} relative flex-1 h-full`}>
							<form onSubmit={(e) => searchHandler(e)}>
								<input
									type="text"
									placeholder=" "
									value={searchText}
									onChange={(e) => setSearchText(e.target.value)}
									className="
          peer
          h-16 w-full
          pl-4 pr-8
          rounded-l-full
          text-gray-700
          bg-transparent
          placeholder-transparent
          focus:outline-none
          font-bold
        "
								/>

								<p
									className="
          absolute left-4 top-1/2
          -translate-y-1/2
          text-gray-500
          transition-all duration-200
          peer-focus:-top-5
            pointer-events-none
          peer-focus:text-blue-500
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-500
          font-bold
        "
								>
									Search...
								</p>
							</form>
						</div>

						<button
							className="
      flex justify-center items-center
      bg-blue-500
      h-full
      w-12 md:w-16
      rounded-r-full
      hover:bg-blue-600
    "
							onClick={searchHandler}
						>
							<Image
								src={
									isDarkMode
										? "https://boyintyoko.github.io/clock-web/icons/searchIcons/blackSeacrh.png"
										: "https://boyintyoko.github.io/clock-web/icons/searchIcons/whiteSearch.png"
								}
								alt="search icon"
								height={28}
								width={28}
								loading="lazy"
							/>
						</button>
					</div>

					<div>
						<div
							className={`flex items-center gap-2 relative
    h-16 w-52 transition-all`}
						>
							<button
								onClick={() => setIsLinkSettingOpen(!isLinkSettingOpen)}
								className="absolute -top-1 -right-4"
							>
								<Image
									src="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingWhite.svg"
									alt="Setting Icon"
									height={20}
									width={20}
									loading="lazy"
									className={isDarkMode ? "" : "invert"}
								/>
							</button>

							{urls.map((url, id) => (
								<Link
									key={id}
									href={url.url}
									rel="noopener noreferrer"
									target="_blank"
									className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
								>
									<Image
										src={url.link}
										alt={url.alt}
										height={20}
										width={20}
										loading="lazy"
										className={isDarkMode ? "" : "invert"}
									/>
								</Link>
							))}
							<History
								isDarkMode={isDarkMode}
								isHistoriesOpen={isHistoriesOpen}
								setIsHistoriesOpen={setIsHistoriesOpen}
								isSideBar={true}
							/>
						</div>
					</div>

					<div className="flex justify-between">
						<ToggleSwitch
							handleSwitchChange={handleSwitchChange}
							isDarkMode={isDarkMode}
						/>

						<NavigatorPermisson
							isDarkMode={isDarkMode}
							navigatorPermission={navigatorPermission}
							temperature={temperature}
							temperatureUnits={temperatureUnits}
							wheatherIcon={wheatherIcon}
							humidity={humidity}
						/>
					</div>

					{!background.endsWith(".png") && (
						<BackgroundDesc isDarkMode={isDarkMode} />
					)}

					<NowTimeZone isDarkMode={isDarkMode} isNowTimeZone={isNowTimeZone} />

					<div className="flex gap-2">
						<ModalButton
							isOpen={isGoodsOpen}
							setIsOpen={setIsGoodsOpen}
							isDarkMode={isDarkMode}
							whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/heartIcons/heartBlack.svg"
							blackImageUrl="https://boyintyoko.github.io/clock-web/icons/heartIcons/heartWhite.svg"
						/>

						<ModalButton
							isOpen={isSettingOpen}
							setIsOpen={setIsSettingOpen}
							isDarkMode={isDarkMode}
							whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingBlack.svg"
							blackImageUrl="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingWhite.svg"
						/>

						<ModalButton
							isOpen={isTimeZoneOpen}
							setIsOpen={setIsTimeZoneOpen}
							isDarkMode={isDarkMode}
							whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneBlack.svg"
							blackImageUrl="https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneWhite.svg"
						/>
					</div>

					<p
						className={`absolute bottom-1 text-center text-xs font-semibold ${isDarkMode ? "text-white" : "text-gray-700"} py-2`}
					>
						{" "}
						© {new Date().getFullYear()} Taiga Ito. All rights reserved.{" "}
					</p>
				</div>
			</div>

			<div
				className={`
          max-lg:hidden
          flex flex-row-reverse gap-5 items-center
          absolute top-2 right-2 z-10
          ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}
          bg-opacity-50
          rounded-md
          p-1
        `}
			>
				<ToggleSwitch
					handleSwitchChange={handleSwitchChange}
					isDarkMode={isDarkMode}
				/>

				{!background.endsWith(".png") && (
					<>
						<BackgroundDesc isDarkMode={isDarkMode} />

						<NavigatorPermisson
							isDarkMode={isDarkMode}
							navigatorPermission={navigatorPermission}
							temperature={temperature}
							temperatureUnits={temperatureUnits}
							wheatherIcon={wheatherIcon}
							humidity={humidity}
						/>
					</>
				)}

				<NowTimeZone isDarkMode={isDarkMode} isNowTimeZone={isNowTimeZone} />

				<p
					className={`text-center ${isDarkMode ? "text-white" : "text-gray-700"} text-xs font-semibold py-2`}
				>
					{" "}
					© {new Date().getFullYear()} Taiga Ito. All rights reserved.{" "}
				</p>
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

			<Modal
				title="History"
				isOpen={isHistoriesOpen}
				setIsOpen={setIsHistoriesOpen}
			>
				<SerachHistroyContent
					histories={histories}
					setHistories={setHistories}
				/>
			</Modal>
		</div>
	);
}
