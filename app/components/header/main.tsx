import axios from "axios";
import { useEffect, useState } from "react";
import ToggleSwitch from "./toggleSwitch";
import BackgroundDesc from "./backgroundDesc";
import NavigatorPermisson from "./navigatorPermisson";
import NowTimeZone from "./nowTimeZone";
import ChangeImageButton from "../changeImageButton";

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

						console.log(res);

						const temp = res.data.temp;
						const hum = res.data.hum;
						const wheatherIcon = res.data.weatherIcon;

						setTemperature(temp);
						setHumidity(hum);
						setWheatherIcon(wheatherIcon);
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

			<div className="flex flex-row-reverse gap-6 items-center absolute top-2 right-2 z-10">
				<ToggleSwitch
					handleSwitchChange={handleSwitchChange}
					isDarkMode={isDarkMode}
				/>
				<BackgroundDesc isDarkMode={isDarkMode} />
				<NavigatorPermisson
					isDarkMode={isDarkMode}
					navigatorPermission={navigatorPermission}
					temperature={temperature}
					temperatureUnits={temperatureUnits}
					wheatherIcon={wheatherIcon}
					humidity={humidity}
				/>
				<NowTimeZone isDarkMode={isDarkMode} isNowTimeZone={isNowTimeZone} />
			</div>
		</div>
	);
}
