import Image from "next/image";

interface Props {
	navigatorPermission: boolean;
	isDarkMode: boolean;
	temperature: number | null;
	temperatureUnits: string;
	wheatherIcon: string;
	humidity: number | null;
}

export default function NavigatorPermisson({
	navigatorPermission,
	isDarkMode,
	temperature,
	temperatureUnits,
	wheatherIcon,
	humidity,
}: Props) {
	return (
		<div>
			{navigatorPermission && (
				<>
					{temperature !== null && humidity !== null ? (
						<div
							className={`flex gap-1 ${isDarkMode ? "text-gray-700" : "text-white"} font-semibold`}
						>
							<div className="flex items-center gap-2 text-sm transition-transform hover:translate-y-1">
								<div>
									{temperature.toFixed(0)}
									{temperatureUnits === "imperial"
										? "°F"
										: temperatureUnits === "metric"
											? "°C"
											: " K"}{" "}
									/ {humidity}%
								</div>
							</div>
							<Image
								className="transition-transform hover:translate-y-1"
								src={`https://openweathermap.org/img/wn/${wheatherIcon}@2x.png`}
								alt="weather icon"
								height={30}
								width={30}
							/>
						</div>
					) : (
						<div
							className={`${isDarkMode ? "text-gray-700" : "text-white"} text-sm`}
						>
							Loading weather...
						</div>
					)}
				</>
			)}
		</div>
	);
}
