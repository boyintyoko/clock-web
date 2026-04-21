"use client";

import SearchContent from "@@/components/searchComponents/searchContent";
import LinkContent from "@@/components/searchComponents/linkContent";
import Image from "next/image";
import { useEffect } from "react";
import HistoryType from "@@/types/HistoryType";
import Modal from "@@/components/modalComnponents/main";
import SerachHistroyContent from "@@/components/modalComnponents/modalContents/serachHistoryContent";

type UrlItem = {
	link: string;
	url: string;
	alt: string;
	id: number;
};

type Props = {
	isDarkMode: boolean;
	isHistoriesOpen: boolean;
	setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsLinkSettingOpen: (isLinkSettingOpen: boolean) => void;
	isLinkSettingOpen: boolean;
	urls: UrlItem[];
	setUrls: (urls: UrlItem[]) => void;
	isSearch: boolean;
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
	histories: HistoryType[];
	setHistories: React.Dispatch<React.SetStateAction<HistoryType[]>>;
};

export default function Search({
	isDarkMode,
	isHistoriesOpen,
	setIsHistoriesOpen,
	setIsLinkSettingOpen,
	isLinkSettingOpen,
	urls,
	setUrls,
	isSearch,
	setIsSearch,
	histories,
	setHistories,
}: Props) {
	useEffect(() => {
		const setDataHistories = () => {
			const histories = localStorage.getItem("history");
			if (!histories) return;
			setHistories(JSON.parse(histories));
		};
		setDataHistories();
	}, []);

	useEffect(() => {
		const toggle = localStorage.getItem("isSearch");
		if (!toggle) return;
		setIsSearch(JSON.parse(toggle));
	}, []);

	const changeIsSearch = (toggle: boolean) => {
		setIsSearch(toggle);
		localStorage.setItem("isSearch", JSON.stringify(toggle));
	};

	return (
		<div>
			<div className="absolute bottom-2 left-2 z-10">
				<SearchContent
					isSearch={isSearch}
					setHistories={setHistories}
					histories={histories}
					isDarkMode={isDarkMode}
				/>
				<LinkContent
					isDarkMode={isDarkMode}
					isSearch={isSearch}
					isHistoriesOpen={isHistoriesOpen}
					setIsHistoriesOpen={setIsHistoriesOpen}
					setIsLinkSettingOpen={setIsLinkSettingOpen}
					isLinkSettingOpen={isLinkSettingOpen}
					urls={urls}
					setUrls={setUrls}
				/>
			</div>
			<button className="flex justify-center items-center absolute bottom-4 left-96 ml-10 h-16 w-16 bg-white rounded-full transition-all bg-opacity-25 hover:translate-y-2">
				<Image
					src={`${isDarkMode ? "https://boyintyoko.github.io/clock-web/icons/downIcons/downBlack.png" : "https://boyintyoko.github.io/clock-web/icons/downIcons/downWhite.png"}`}
					alt="down icon"
					height={50}
					width={50}
					loading="lazy"
					onClick={() => changeIsSearch(!isSearch)}
				/>
			</button>

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
