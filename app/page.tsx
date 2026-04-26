"use client";

import AuthGuard from "@@/components/AuthGuard";
import Clock from "@@/components/clock/clock";
import ElectronicClock from "@@/components/clock/electronicClock";
import HeaderMain from "@@/components/header/main";
import Loading from "@@/components/loading/loading";
import Modal from "@@/components/modal/modal";
import ModalButton from "@@/components/modalComnponents/modalButton";
import GoodsContent from "@@/components/modalComnponents/modalContents/goodsContent";
import LapsContent from "@@/components/modalComnponents/modalContents/lapsContent";
import LinkSettingContent from "@@/components/modalComnponents/modalContents/linkSettingContent";
import SettingContent from "@@/components/modalComnponents/modalContents/settingContent";
import TimeZoneContent from "@@/components/modalComnponents/modalContents/timeZoneContent";
import Search from "@@/components/searchComponents/search";
import { useBackground } from "@@/context/backgroundContext";
import { useTimeZone } from "@@/context/timeZoneContext";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import type HistoryType from "@/app/types/HistoryType";
import colors from "@/data/colorData";
import colorsRGB from "@/data/colorRGBData";
import { supabase } from "@/lib/supabase";

type MainSelectionProps = {
	$background: string;
};

type UrlItem = {
	link: string;
	url: string;
	alt: string;
	id: number;
};

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
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isSettingOpen, setIsSettingOpen] = useState(false);
	const [isLapsOpen, setIsLapsOpen] = useState(false);
	const [isGoodsOpen, setIsGoodsOpen] = useState(false);
	const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);
	const [isHistoriesOpen, setIsHistoriesOpen] = useState(false);
	const { background } = useBackground();
	const { isNowTimeZone } = useTimeZone();
	const [temperatureUnits, setTempratureUnits] = useState("F");
	const [isLinkSettingOpen, setIsLinkSettingOpen] = useState(false);
	const [urls, setUrls] = useState<UrlItem[]>([]);
	const [isSearch, setIsSearch] = useState(false);
	const [histories, setHistories] = useState<HistoryType[]>([]);
	const [imageUrl, setImageUrl] = useState("");

	// ================= COOKIE =================
	const [cookieVisible, setCookieVisible] = useState(false);
	const [cookieConsent, setCookieConsent] = useState<
		"accepted" | "rejected" | null
	>(null);

	useEffect(() => {
		const saved = localStorage.getItem("cookie-consent");
		if (saved === "accepted" || saved === "rejected") {
			setCookieConsent(saved);
		} else {
			setCookieVisible(true);
		}
	}, []);

	const handleAccept = () => {
		localStorage.setItem("cookie-consent", "accepted");
		setCookieConsent("accepted");
		setCookieVisible(false);
	};

	const handleReject = () => {
		localStorage.setItem("cookie-consent", "rejected");
		setCookieConsent("rejected");
		setCookieVisible(false);
	};

	// ==========================================

	const changeDarkMode = async (value: boolean) => {
		setIsDarkMode(value);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		await supabase.from("settings").upsert(
			{
				user_id: user.id,
				dark_mode: value,
			},
			{ onConflict: "user_id" },
		);
	};

	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			setImageUrl(res.data.imageUrl);
		};
		getPhoto();
	}, []);

	const checkImage = (img: string) => {
		const defaultImage = `url(${imageUrl})`;

		if (!img) return defaultImage;
		if (img.startsWith("hsl")) return undefined;
		if (img.startsWith("https")) return `url(${img})`;

		const name = img.replace(".png", "");

		if (colors.includes(name)) {
			return `url(https://github.com/boyintyoko/boyintyoko.github.io/blob/main/clock-web/icons/colors/${img}?raw=true)`;
		}

		if (img === "Random") return `url(${imageUrl})`;

		return defaultImage;
	};

	const showCookie = cookieVisible && !cookieConsent;

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
					/>{" "}
					<ModalButton
						isOpen={isSettingOpen}
						setIsOpen={setIsSettingOpen}
						isDarkMode={isDarkMode}
						blackImageUrl="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingBlack.svg"
						whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingWhite.svg"
					/>{" "}
					<ModalButton
						isOpen={isTimeZoneOpen}
						setIsOpen={setIsTimeZoneOpen}
						isDarkMode={isDarkMode}
						blackImageUrl="https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneBlack.svg"
						whiteImageUrl="https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneWhite.svg"
					/>{" "}
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

				{showCookie && (
					<div
						className={`
      fixed bottom-6 left-10 z-50 w-[92%] max-w-md
      bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl
      rounded-2xl px-5 py-4 flex items-center justify-between gap-4

      transform transition-all duration-500 ease-in-out
      translate-x-0 opacity-100
    `}
					>
						<p className="text-sm text-gray-700">This website uses cookies.</p>

						<div className="flex gap-2">
							<button
								onClick={handleReject}
								className="px-3 py-2 text-sm text-gray-600 hover:text-black transition"
							>
								Reject
							</button>

							<button
								onClick={handleAccept}
								className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 transition"
							>
								Accept
							</button>
						</div>
					</div>
				)}
			</MainSelection>

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

			<Modal isOpen={isLapsOpen} setIsOpen={setIsLapsOpen} title="Laps">
				<LapsContent />
			</Modal>
		</AuthGuard>
	);
}
