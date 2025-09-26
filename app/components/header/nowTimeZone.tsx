interface Props {
	isDarkMode: boolean;
	isNowTimeZone: string;
}

export default function NowTimeZone({ isDarkMode, isNowTimeZone }: Props) {
	return (
		<p
			className={`text-sm font-semibold ${isDarkMode ? "text-gray-700" : "text-white"} whitespace-nowrap transition-transform hover:translate-y-1`}
		>
			{isNowTimeZone}
		</p>
	);
}
