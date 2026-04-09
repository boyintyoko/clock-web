"use client";

import Image from "next/image";
import { useEffect } from "react";
import urlData from "@/data/urlData";

interface UrlItem {
	link: string;
	url: string;
	alt: string;
	id: number;
}

interface Props {
	urls: UrlItem[];
	setUrls: (urls: UrlItem[]) => void;
}

export default function LinkSettingContent({ urls, setUrls }: Props) {
	useEffect(() => {
		const stored = localStorage.getItem("urlData");

		if (stored) {
			setUrls(JSON.parse(stored));
		} else {
			localStorage.setItem("urlData", JSON.stringify(urlData));
			setUrls(urlData);
		}
	}, [setUrls]);

	const changeLinkSetting = (id: number, newUrl: string) => {
		const updated = urls.map((item) =>
			item.id === id ? { ...item, url: newUrl } : item,
		);

		setUrls(updated);

		localStorage.setItem("urlData", JSON.stringify(updated));
	};

	return (
		<div className="space-y-4">
			{urls.map((url, index) => (
				<div
					key={url.id}
					className="
            flex items-center gap-4
            p-2 rounded-lg
            transition-all
            duration-300
            opacity-0
            animate-fadeSlide
          "
					style={{
						animationDelay: `${index * 70}ms`,
						animationFillMode: "forwards",
					}}
				>
					{/* アイコン */}
					<div
						className="
              flex items-center justify-center
              w-12 h-12
              rounded-full
              bg-blue-500
              hover:bg-blue-600
              transition-all
              hover:scale-105
            "
					>
						<Image
							src={url.link}
							alt={url.alt}
							height={20}
							width={20}
							loading="lazy"
						/>
					</div>

					{/* 入力欄 */}
					<input
						onChange={(e) => changeLinkSetting(url.id, e.target.value)}
						value={url.url}
						type="text"
						placeholder="New url"
						className="
              flex-1
              outline-none
              border-b border-gray-400
              font-bold
              bg-transparent
              transition-all
              focus:border-blue-500
              pb-1
            "
					/>
				</div>
			))}
		</div>
	);
}
