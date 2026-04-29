"use client";

import ChangeImageButton from "@@/components/buttons/changeImageButton";
import LogoutButton from "@@/components/buttons/logoutButton";
import BackgroundDesc from "@@/components/header/backgroundDesc";
import NavigatorPermisson from "@@/components/header/navigatorPermisson";
import NowTimeZone from "@@/components/header/nowTimeZone";
import ToggleSwitch from "@@/components/header/toggleSwitch";
import Modal from "@@/components/modal/modal";
import ModalButton from "@@/components/modalComnponents/modalButton";
import GoodsContent from "@@/components/modalComnponents/modalContents/goodsContent";
import LapsContent from "@@/components/modalComnponents/modalContents/lapsContent";
import LinkSettingContent from "@@/components/modalComnponents/modalContents/linkSettingContent";
import SerachHistroyContent from "@@/components/modalComnponents/modalContents/serachHistoryContent";
import SettingContent from "@@/components/modalComnponents/modalContents/settingContent";
import TimeZoneContent from "@@/components/modalComnponents/modalContents/timeZoneContent";
import History from "@@/components/searchComponents/historyComponents/history";
import { useBackground } from "@@/context/backgroundContext";
import styles from "@@/css/inputLabel.module.css";
import type HistoryType from "@@/types/HistoryType";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import urlsData from "@/data/urlData";
import { supabase } from "@/lib/supabase";
import packageJson from "@/package.json";

type Props = {
	isDarkMode: boolean;
	isNowTimeZone: string;
	temperatureUnits: string;
	setIsDarkMode: (isDarkMode: boolean) => void;
	setTempratureUnits: (temperatureUnits: string) => void;
	setHistories: React.Dispatch<React.SetStateAction<HistoryType[]>>;
	histories: HistoryType[];
};

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

	const [isLapsOpen, setIsLapsOpen] = useState(false);

	const { background } = useBackground();

	const handleSwitchChange = () => {
		setIsDarkMode(!isDarkMode);
	};

	const saveHistory = async (newHistory: HistoryType) => {
		const { data: userData } = await supabase.auth.getUser();

		console.log("user:", userData);

		if (!userData.user) {
			console.log("No user");
			return;
		}

		const userId = userData.user.id;

		const { data, error } = await supabase.from("histories").insert({
			user_id: userId,
			content: newHistory.content,
			create_minutes: newHistory.create_minutes,
			create_hours: newHistory.create_hours,
		});

		console.log("insert data:", data);
		console.log("insert error:", error);
	};

	const searchHandler = async (
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
	): Promise<void> => {
		e.preventDefault();

		if (searchText.trim().length > 0) {
			window.open(`https://www.google.com/search?q=${searchText}`);

			const newHistory: HistoryType = {
				id: crypto.randomUUID(),
				content: searchText,
				create_minutes: new Date().getMinutes(),
				create_hours: new Date().getHours(),
			};

			const updatedHistory = [...histories, newHistory];

			setHistories(updatedHistory);

			await saveHistory(newHistory);

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
			<div
				className={`
    lg:hidden
    fixed top-0 right-0
    h-full w-[320px]

    flex flex-col
    gap-5

    p-5

    ${isDarkMode ? "bg-gray-900/90 text-white" : "bg-white text-gray-900"}

    shadow-2xl
    transform transition-transform duration-300
    ${menuOpen ? "translate-x-0" : "translate-x-full"}

    z-50
  `}
			>
				{/* ================= Search ================= */}

				<div
					className={`
      flex items-center
      h-12
      px-3

      rounded-xl
      border

      ${
				isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
			}

      shadow-md
      focus-within:ring-2
      focus-within:ring-blue-500
    `}
				>
					<form
						onSubmit={(e) => searchHandler(e)}
						className="flex flex-1 items-center"
					>
						<input
							type="text"
							placeholder="Search..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							className="
          flex-1
          bg-transparent
          outline-none
          text-sm
          font-medium
          placeholder:text-gray-400
        "
						/>
					</form>

					<button
						onClick={searchHandler}
						className="
        flex items-center justify-center

        w-9 h-9
        rounded-xl

        bg-blue-500
        hover:bg-blue-600

        transition
      "
					>
						<Image
							src={
								!isDarkMode
									? "https://boyintyoko.github.io/clock-web/icons/searchIcons/blackSeacrh.png"
									: "https://boyintyoko.github.io/clock-web/icons/searchIcons/whiteSearch.png"
							}
							alt="search"
							width={18}
							height={18}
						/>
					</button>
				</div>

				<div
					className={`
      flex items-center gap-3
      p-3

      rounded-2xl
      border

      ${
				isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
			}

      shadow-md
    `}
				>
					{urls.map((url, id) => (
						<Link
							key={id}
							href={url.url}
							target="_blank"
							className="
          flex items-center justify-center

          w-10 h-10
          rounded-xl

          bg-blue-500
          hover:bg-blue-600

          transition
          hover:scale-105
        "
						>
							<Image
								src={url.link}
								alt={url.alt}
								width={18}
								height={18}
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

				<div
					className={`
      flex gap-3
      p-4

      rounded-2xl
      border

      ${
				isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
			}

      shadow-md
    `}
				>
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

				<div
					className={`p-4 flex flex-col justify-center items-start gap-2

                rounded-2xl
      border

      ${
				isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
			}

      shadow-md`}
				>
					{background === "Random" ? (
						<p
							className={`text-sm ${
								isDarkMode ? "text-white/70" : "text-gray-600"
							}`}
						>
							Random
						</p>
					) : !background.endsWith(".png") ? (
						<>
							<BackgroundDesc isDarkMode={isDarkMode} />
							<span className="block h-[1px] w-full bg-gray-200 rounded-full"></span>
						</>
					) : null}

					<NowTimeZone isDarkMode={isDarkMode} isNowTimeZone={isNowTimeZone} />
				</div>

				<div
					className={`
      grid grid-cols-4 gap-3
      p-3

      rounded-2xl
      border

      ${
				isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
			}

      shadow-md
    `}
				>
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

					<ModalButton
						isOpen={isLapsOpen}
						setIsOpen={setIsLapsOpen}
						isDarkMode={isDarkMode}
						whiteImageUrl="https://raw.githubusercontent.com/boyintyoko/boyintyoko.github.io/1d309029b0cdbcc1fac719489923a8570a038ad0/clock-web/icons/lapsIcons/lapsBlack.svg"
						blackImageUrl="https://raw.githubusercontent.com/boyintyoko/boyintyoko.github.io/1d309029b0cdbcc1fac719489923a8570a038ad0/clock-web/icons/lapsIcons/lapsWhite.svg"
					/>
				</div>

				<div>
					<LogoutButton isDarkMode={isDarkMode} />
				</div>

				<div className="mt-auto flex flex-col items-center gap-2">
					<div
						className={`
        px-4 py-2
        rounded-full
        text-xs

        border

        ${
					isDarkMode
						? "bg-white/10 border-white/20 text-white/80"
						: "bg-black/5 border-black/10 text-gray-700"
				}
      `}
					>
						© {new Date().getFullYear()} Taiga Ito
						<span className="ml-2 font-bold">v{packageJson.version}</span>
					</div>

					<div
						className={`
        flex items-center gap-2
        text-xs

        px-4 py-2
        rounded-full
        border

        ${
					isDarkMode
						? "bg-white/10 border-white/20 text-white/80"
						: "bg-black/5 border-black/10 text-gray-700"
				}
      `}
					>
						<Link href="/privacy">Privacy ↗</Link>

						<span>|</span>

						<Link href="/terms">Terms ↗</Link>

						<span>|</span>

						<Link href="/contact">Contact ↗</Link>
					</div>
				</div>
			</div>

			<div
				className={`
          max-lg:hidden
          flex flex-row-reverse gap-5 items-center
          absolute top-2 right-2 z-10 hover:top-3 transition-all
          ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}
          bg-opacity-50
          rounded-md
          p-2
        `}
			>
				<LogoutButton isDarkMode={isDarkMode} />
				<ToggleSwitch
					handleSwitchChange={handleSwitchChange}
					isDarkMode={isDarkMode}
				/>

				{background === "Random" ? (
					<p
						className={`font-bold text-sm ${
							!isDarkMode ? "text-gray-700" : "text-white"
						}`}
					>
						Random
					</p>
				) : !background.endsWith(".png") ? (
					<BackgroundDesc isDarkMode={isDarkMode} />
				) : null}

				{navigatorPermission && (
					<NavigatorPermisson
						isDarkMode={isDarkMode}
						navigatorPermission={navigatorPermission}
						temperature={temperature}
						temperatureUnits={temperatureUnits}
						wheatherIcon={wheatherIcon}
						humidity={humidity}
					/>
				)}

				<NowTimeZone isDarkMode={isDarkMode} isNowTimeZone={isNowTimeZone} />

				<div
					className={`
      px-3 py-1 rounded-full
      backdrop-blur-md
      border
      text-xs font-medium
      flex items-center gap-2
      ${
				isDarkMode
					? "bg-white/10 border-white/20 text-white/80"
					: "bg-black/5 border-black/10 text-gray-700"
			}
    `}
				>
					<span>© {new Date().getFullYear()} Taiga Ito</span>

					<span
						className={`
        px-2 py-[2px] rounded-full
        text-[10px] font-bold
        ${isDarkMode ? "bg-white/20 text-white" : "bg-black/10 text-gray-800"}
      `}
					>
						v{packageJson.version}
					</span>
				</div>

				<div
					className="
      max-w-[95vw]
      text-xs md:text-sm
      text-gray-300
      backdrop-blur-sm
      bg-black/20
      px-4 py-2
      rounded-xl
    "
				>
					<div
						className="
        flex flex-wrap
        xl:flex-nowrap
        justify-center
        items-center
        gap-x-4 gap-y-1
        text-center
      "
					>
						<Link
							href="/privacy"
							target="_blank"
							rel="noopener noreferrer"
							className="truncate max-w-[100px]"
						>
							Privacy Policy
						</Link>

						<span className="hidden xl:inline text-gray-500">|</span>

						<Link
							href="/terms"
							target="_blank"
							rel="noopener noreferrer"
							className="truncate max-w-[120px]"
						>
							Terms of Service
						</Link>

						<span className="hidden xl:inline text-gray-500">|</span>

						<Link
							href="/contact"
							target="_blank"
							rel="noopener noreferrer"
							className="truncate max-w-[80px]"
						>
							Contact
						</Link>
					</div>
				</div>
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

			<Modal isOpen={isLapsOpen} setIsOpen={setIsLapsOpen} title="Laps">
				<LapsContent />
			</Modal>
		</div>
	);
}
