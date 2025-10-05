import Modal from "./main";
import SettingContent from "./modalContents/settingContent";
import TimeZoneContent from "./modalContents/timeZoneContent";
import GoodsContent from "./modalContents/goodsContent";
import LinkSettingContent from "./modalContents/linkSettingContent";
import UrlItem from "@/app/types/UrlItems";

interface Props {
	isSettingOpen: boolean;
	setIsSettingOpen: (isSettingOpen: boolean) => void;
	temperatureUnits: string;
	setTemperatureUnits: (temperatureUnits: string) => void;
	isTimeZoneOpen: boolean;
	setIsTimeZoneOpen: (isTimeZoneOpen: boolean) => void;
	isGoodsOpen: boolean;
	setIsGoodsOpen: (isGoodsOpen: boolean) => void;
	isLinkSettingOpen: boolean;
	setIsLinkSettingOpen: (isLinksettingOpen: boolean) => void;
	urls: UrlItem[];
	setUrls: (url: UrlItem[]) => void;
}

export default function Modals({
	isSettingOpen,
	setIsSettingOpen,
	temperatureUnits,
	setTemperatureUnits,
	isTimeZoneOpen,
	setIsTimeZoneOpen,
	isGoodsOpen,
	setIsGoodsOpen,
	isLinkSettingOpen,
	setIsLinkSettingOpen,
	urls,
	setUrls,
}: Props) {
	return (
		<div>
			<Modal
				isOpen={isSettingOpen}
				setIsOpen={setIsSettingOpen}
				title="Setting"
			>
				<SettingContent
					isSettingOpen={isSettingOpen}
					setIsSettingOpen={setIsSettingOpen}
					temperatureUnits={temperatureUnits}
					setTemperatureUnits={setTemperatureUnits}
				/>
			</Modal>

			<Modal
				isOpen={isTimeZoneOpen}
				setIsOpen={setIsTimeZoneOpen}
				title="Time zone"
			>
				<TimeZoneContent />
			</Modal>

			<Modal isOpen={isGoodsOpen} setIsOpen={setIsGoodsOpen} title="Goods">
				<GoodsContent isGoodsOpen={isGoodsOpen} />
			</Modal>
			<Modal
				isOpen={isLinkSettingOpen}
				setIsOpen={setIsLinkSettingOpen}
				title="Link setting"
			>
				<LinkSettingContent urls={urls} setUrls={setUrls} />
			</Modal>
		</div>
	);
}
