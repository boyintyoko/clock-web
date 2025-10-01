import Link from "next/link";
import Image from "next/image";
import History from "./historyComponents/history";
import { useEffect } from "react";

interface UrlItem {
	link: string;
	url: string;
	alt: string;
	id: number;
}

interface Props {
	isSearch: boolean;
	isHistoriesOpen: boolean;
	setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsLinkSettingOpen: (isLinkSettingOpen: boolean) => void;
	isLinkSettingOpen: boolean;
	urls: UrlItem[];
	setUrls: (urls: UrlItem[]) => void;
}

export default function LinkContent({
	isSearch,
	isHistoriesOpen,
	setIsHistoriesOpen,
	setIsLinkSettingOpen,
	isLinkSettingOpen,
	urls,
	setUrls,
}: Props) {
	useEffect(() => {
		const stored = localStorage.getItem("urlData");

		if (!stored) return;

		const urlData = JSON.parse(stored);

		setUrls(urlData);
	}, []);

	return (
		<div
			className={`flex items-center justify-evenly absolute ${isSearch ? "bottom-2" : "-bottom-20"}
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
					src="https://boyintyoko.github.io/images/icons/settingIcons/settingWhite.svg"
					alt="ChatGPT icon"
					height={20}
					width={20}
					loading="lazy"
				/>
			</button>

			{urls.map((url, id) => (
				<Link
					key={id}
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
					/>
				</Link>
			))}
			<History
				isHistoriesOpen={isHistoriesOpen}
				setIsHistoriesOpen={setIsHistoriesOpen}
			/>
		</div>
	);
}
