"use client";

import History from "@@/components/searchComponents/historyComponents/history";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import urlData from "@/data/urlData";
import { supabase } from "@/lib/supabase";

type UrlItem = {
	link: string;
	url: string;
	alt: string;
	id: number;
};

type Props = {
	isSearch: boolean;
	isHistoriesOpen: boolean;
	setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsLinkSettingOpen: (isLinkSettingOpen: boolean) => void;
	isLinkSettingOpen: boolean;
	urls: UrlItem[];
	setUrls: (urls: UrlItem[]) => void;
	isDarkMode: boolean;
};

export default function LinkContent({
	isDarkMode,
	isSearch,
	isHistoriesOpen,
	setIsHistoriesOpen,
	setIsLinkSettingOpen,
	isLinkSettingOpen,
	urls,
	setUrls,
}: Props) {
	useEffect(() => {
		async function loadUrls() {
			console.log("loadUrls start");

			const { data: userData } = await supabase.auth.getUser();

			const user = userData.user;

			if (!user) {
				console.log("no user");
				return;
			}

			const { data, error } = await supabase
				.from("urls")
				.select("*")
				.eq("user_id", user.id)
				.order("id");

			if (error) {
				console.error("fetch error:", error);
				return;
			}

			if (!data || data.length === 0) {
				console.log("no urls → insert template");

				const templateData = urlData.map((item) => ({
					user_id: user.id,
					link: item.link,
					url: item.url,
					alt: item.alt,
				}));

				const { error: insertError } = await supabase
					.from("urls")
					.insert(templateData);

				if (insertError) {
					console.error("template insert error:", insertError);
					return;
				}

				const { data: newData } = await supabase
					.from("urls")
					.select("*")
					.eq("user_id", user.id)
					.order("id");

				if (newData) {
					setUrls(newData);
				}
			} else {
				setUrls(data);
			}
		}

		loadUrls();
	}, [setUrls]);

	return (
		<div
			className={`flex items-center justify-evenly absolute ${
				isSearch ? "bottom-2" : "-bottom-20"
			}
      left-2 h-16 w-96 bg-white bg-opacity-50
      shadow-lg ring-blue-500 ring-4 transition-all
      hover:shadow-2xl hover:translate-y-2`}
			style={{
				borderRadius: "50px",
				borderTopRightRadius: "3px",
			}}
		>
			<button
				onClick={() => setIsLinkSettingOpen(!isLinkSettingOpen)}
				className="absolute top-1 right-1"
			>
				<Image
					src="https://boyintyoko.github.io/clock-web/icons/settingIcons/settingWhite.svg"
					alt="Setting Icon"
					height={20}
					width={20}
					loading="lazy"
					className={isDarkMode ? "invert" : ""}
				/>
			</button>

			{urls.map((url) => (
				<Link
					key={url.id}
					href={url.url}
					rel="noopener noreferrer"
					target="_blank"
					className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
				>
					<Image
						src={url.link}
						alt={url.alt}
						height={20}
						width={20}
						loading="lazy"
						className={isDarkMode ? "invert" : ""}
					/>
				</Link>
			))}

			<History
				isDarkMode={isDarkMode}
				isHistoriesOpen={isHistoriesOpen}
				setIsHistoriesOpen={setIsHistoriesOpen}
				isSideBar={false}
			/>
		</div>
	);
}
