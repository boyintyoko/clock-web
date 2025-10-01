"use client";

import SearchContent from "./searchContent";
import LinkContent from "./linkContent";
import Image from "next/image";
import { useEffect, useState } from "react";
import HistoryType from "@/app/types/HistoryType";
import Modal from "../modalComnponents/main";
import SerachHistroyContent from "../modalComnponents/modalContents/serachHistoryContent";

interface UrlItem {
	link: string;
	url: string;
	alt: string;
	id: number;
}

interface Props {
	isDarkMode: boolean;
	isHistoriesOpen: boolean;
	setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsLinkSettingOpen: (isLinkSettingOpen: boolean) => void;
	isLinkSettingOpen: boolean;
	urls: UrlItem[];
	setUrls: (urls: UrlItem[]) => void;
}

export default function Search({
	isDarkMode,
	isHistoriesOpen,
	setIsHistoriesOpen,
	setIsLinkSettingOpen,
	isLinkSettingOpen,
	urls,
	setUrls,
}: Props) {
	const [isSearch, setIsSearch] = useState<boolean>(false);
	const [histories, setHistories] = useState<HistoryType[]>([]);

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
