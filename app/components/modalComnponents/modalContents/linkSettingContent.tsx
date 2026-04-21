"use client";

import Image from "next/image";
import { supabase } from "@/lib/supabase";

type UrlItem = {
	link: string;
	url: string;
	alt: string;
	id: number;
};

type Props = {
	urls: UrlItem[];
	setUrls: (urls: UrlItem[]) => void;
};

export default function LinkSettingContent({ urls, setUrls }: Props) {
	const changeLinkSetting = async (id: number, newUrl: string) => {
		console.log("update start:", id, newUrl);

		const updated = urls.map((item) =>
			item.id === id ? { ...item, url: newUrl } : item,
		);

		setUrls(updated);

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			console.log("❌ no session");
			return;
		}

		await supabase
			.from("urls")
			.update({
				url: newUrl,
			})
			.eq("id", id);
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
