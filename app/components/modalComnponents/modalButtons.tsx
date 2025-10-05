import ModalButton from "./modalButton";

interface Props {
	isGoodsOpen: boolean;
	setIsGoodsOpen: (isGoodsOpen: boolean) => void;
	isDarkMode: boolean;
	isSettingOpen: boolean;
	setIsSettingOpen: (isSettingOpen: boolean) => void;
	isTimeZoneOpen: boolean;
	setIsTimeZoneOpen: (isTimeZoneOpen: boolean) => void;
}

export default function ModalButtons({
	isGoodsOpen,
	setIsGoodsOpen,
	isSettingOpen,
	setIsSettingOpen,
	isTimeZoneOpen,
	setIsTimeZoneOpen,
	isDarkMode,
}: Props) {
	return (
		<div className="flex gap-2 absolute right-2 bottom-2">
			<ModalButton
				isOpen={isGoodsOpen}
				setIsOpen={setIsGoodsOpen}
				isDarkMode={isDarkMode}
				blackImageUrl={
					"https://boyintyoko.github.io/clock-web/icons/heartIcons/heartBlack.svg"
				}
				whiteImageUrl={
					"https://boyintyoko.github.io/clock-web/icons/heartIcons/heartWhite.svg"
				}
			/>
			<ModalButton
				isOpen={isSettingOpen}
				setIsOpen={setIsSettingOpen}
				isDarkMode={isDarkMode}
				blackImageUrl={
					"https://boyintyoko.github.io/clock-web/icons/settingIcons/settingBlack.svg"
				}
				whiteImageUrl={
					"https://boyintyoko.github.io/clock-web/icons/settingIcons/settingWhite.svg"
				}
			/>
			<ModalButton
				isOpen={isTimeZoneOpen}
				setIsOpen={setIsTimeZoneOpen}
				isDarkMode={isDarkMode}
				blackImageUrl={
					"https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneBlack.svg"
				}
				whiteImageUrl={
					"https://boyintyoko.github.io/clock-web/icons/timeZoneIcons/timeZoneWhite.svg"
				}
			/>
		</div>
	);
}
