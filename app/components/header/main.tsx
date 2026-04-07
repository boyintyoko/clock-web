import axios from "axios";
import { useEffect, useState } from "react";
import ToggleSwitch from "./toggleSwitch";
import BackgroundDesc from "./backgroundDesc";
import NavigatorPermisson from "./navigatorPermisson";
import NowTimeZone from "./nowTimeZone";
import ChangeImageButton from "../changeImageButton";
import { useBackground } from "../../context/backgroundContext";

interface Props {
	isDarkMode: boolean;
	isNowTimeZone: string;
	temperatureUnits: string;
	setIsDarkMode: (isDarkMode: boolean) => void;
	setTempratureUnits: (temperatureUnits: string) => void;
}

export default function HeaderMain({
	isDarkMode,
	isNowTimeZone,
	temperatureUnits,
	setIsDarkMode,
	setTempratureUnits,
}: Props) {
	const [temperature, setTemperature] = useState<number | null>(null);
	const [humidity, setHumidity] = useState<number | null>(null);
	const [wheatherIcon, setWheatherIcon] = useState<string>("");
	const [navigatorPermission, setNavigatorPermission] =
		useState<boolean>(false);

	const [menuOpen, setMenuOpen] = useState(false); // メニュー開閉状態

	const { background } = useBackground();

	const handleSwitchChange = () => {
		setIsDarkMode(!isDarkMode);
		localStorage.setItem("isDarkMode", !isDarkMode ? "true" : "false");
	};

	useEffect(() => {
		const localUnits = localStorage.getItem("temperatureUnits");
		if (!localUnits) {
			localStorage.setItem("temperatureUnits", "kelvin");
			return;
		}
		setTempratureUnits(localUnits);
	}, [setTempratureUnits]);

	useEffect(() => {
		const getIsNowWeather = async () => {
			if (!navigator.permissions) {
				setNavigatorPermission(false);
				return;
			}

			try {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						setNavigatorPermission(true);
						const lat = position.coords.latitude;
						const lon = position.coords.longitude;

						const res = await axios.get(
							`/api/weather?lat=${lat}&lon=${lon}&units=${temperatureUnits}`,
						);

						setTemperature(res.data.temp);
						setHumidity(res.data.hum);
						setWheatherIcon(res.data.weatherIcon);
					},
					(err) => console.log(err),
				);
			} catch (error) {
				console.error("天気取得エラー:", error);
			}
		};

		getIsNowWeather();
		const interval = setInterval(getIsNowWeather, 1000 * 60 * 15);
		return () => clearInterval(interval);
	}, [temperatureUnits]);

	return (
		<div>
			<ChangeImageButton isDarkMode={isDarkMode} />

			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className="
          lg:hidden
          fixed right-2 top-2
          flex flex-col items-center justify-center gap-[5px]
          h-14 w-14 rounded-full
          bg-white/70 backdrop-blur-md
          shadow-lg shadow-black/20
          border border-white/40
          transition-transform duration-300
        
        "
			>
				<span className="h-[2px] w-5 bg-black"></span>
				<span className="h-[2px] w-5 bg-black"></span>
				<span className="h-[2px] w-5 bg-black"></span>
			</button>

			{menuOpen && (
				<div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
					onClick={() => setMenuOpen(false)}
				/>
			)}

			<div
				className={`
    lg:hidden
    fixed top-0 right-0 h-full w-64
    flex flex-col justify-between
    p-6
    bg-opacity-95 backdrop-blur-md
    ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
    shadow-2xl rounded-l-2xl
    transform transition-transform duration-300 ease-in-out
    ${menuOpen ? "translate-x-0" : "translate-x-full"}
    z-50
  `}
			>
				<div className="flex flex-col gap-6">
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
						<div className="flex flex-col gap-4">
							<BackgroundDesc isDarkMode={isDarkMode} />
						</div>
					)}

					<NowTimeZone isDarkMode={isDarkMode} isNowTimeZone={isNowTimeZone} />
				</div>

				<p className="text-center text-xs font-semibold text-gray-400 py-2">
					© {new Date().getFullYear()} Taiga Ito. All rights reserved.
				</p>
			</div>

			<div
				className={`
          max-lg:hidden
          flex flex-row-reverse gap-5 items-center
          absolute top-2 right-2 z-10
          ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}
          bg-opacity-50 rounded-md p-1
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

				<p className="text-center text-xs font-bold py-2">
					© {new Date().getFullYear()} Taiga Ito. All rights reserved.
				</p>
			</div>
		</div>
	);
}
