"use client";

import SearchContent from "@@/components/searchComponents/searchContent";
import LinkContent from "@@/components/searchComponents/linkContent";
import Image from "next/image";
import { useEffect } from "react";
import HistoryType from "@@/types/HistoryType";
import Modal from "@@/components/modalComnponents/main";
import SerachHistroyContent from "@@/components/modalComnponents/modalContents/serachHistoryContent";
import { supabase } from "@/lib/supabase";

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
		const loadHistories = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("histories")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			if (error) {
				console.error(error);
				return;
			}

			const formatted: HistoryType[] =
				data?.map((item) => {
					const date = new Date(item.created_at);

					return {
						id: item.id,
						content: item.content,
						create_minutes: date.getMinutes(),
						create_hours: date.getHours(),
					};
				}) || [];

			setHistories(formatted);
		};

		loadHistories();
	}, []);

	useEffect(() => {
		const loadIsSearch = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("settings")
				.select("is_search")
				.eq("user_id", user.id)
				.single();

			if (error) return;

			if (data?.is_search !== undefined) {
				setIsSearch(data.is_search);
			}
		};

		loadIsSearch();
	}, []);

	const changeIsSearch = async (toggle: boolean) => {
		setIsSearch(toggle);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			await supabase.from("settings").upsert(
				{
					user_id: user.id,
					is_search: toggle,
				},
				{
					onConflict: "user_id",
				},
			);
		} catch (err) {
			console.error("isSearch save error:", err);
		}
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
					src={
						isDarkMode
							? "https://boyintyoko.github.io/clock-web/icons/downIcons/downBlack.png"
							: "https://boyintyoko.github.io/clock-web/icons/downIcons/downWhite.png"
					}
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
