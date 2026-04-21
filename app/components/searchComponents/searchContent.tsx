"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import HistoryType from "@/app/types/HistoryType";
import styles from "@@/css/inputLabel.module.css";
import { supabase } from "@/lib/supabase";

type Props = {
	isSearch: boolean;
	setHistories: React.Dispatch<React.SetStateAction<HistoryType[]>>;
	histories: HistoryType[];
	isDarkMode: boolean;
};

export default function SearchContent({
	isSearch,
	setHistories,
	histories,
	isDarkMode,
}: Props) {
	const [searchText, setSearchText] = useState<string>("");
	useEffect(() => {
		async function fetchHistories() {
			const { data: userData } = await supabase.auth.getUser();

			if (!userData.user) return;

			const userId = userData.user.id;

			const { data, error } = await supabase
				.from("histories")
				.select("*")
				.eq("user_id", userId)
				.order("id", { ascending: true });

			if (error) {
				console.error(error);
				return;
			}

			if (data) {
				setHistories(
					data.map((item) => ({
						id: item.id,
						content: item.content,
						create_minutes: item.create_minutes,
						create_hours: item.create_hours,
					})),
				);
			}
		}

		fetchHistories();
	}, [setHistories]);

	async function saveHistory(newHistory: HistoryType) {
		const { data: userData } = await supabase.auth.getUser();

		if (!userData.user) return;

		const userId = userData.user.id;

		const { error } = await supabase.from("histories").insert({
			user_id: userId,
			content: newHistory.content,
			create_minutes: newHistory.create_minutes,
			create_hours: newHistory.create_hours,
		});

		if (error) {
			console.error(error);
		}
	}

	const searchHandler = async (
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
	): Promise<void> => {
		e.preventDefault();

		if (searchText.trim().length > 0) {
			window.open(`https://www.google.com/search?q=${searchText}`);

			const newId =
				histories.length > 0 ? Math.max(...histories.map((h) => h.id)) + 1 : 0;

			const newHistory: HistoryType = {
				content: searchText,
				id: newId,
				create_minutes: new Date().getMinutes(),
				create_hours: new Date().getHours(),
			};

			const updatedHistory = [...histories, newHistory];

			setHistories(updatedHistory);

			await saveHistory(newHistory);

			setSearchText("");
		}
	};

	return (
		<div
			className={`flex items-center absolute ${
				isSearch ? "-bottom-20" : "bottom-2"
			} left-2
      h-14 md:h-16
      w-[90vw] sm:w-[60vw] md:w-[45vw]
      max-w-96 min-w-[200px]
      bg-white bg-opacity-50
      rounded-full shadow-lg
      hover:ring-blue-500 ring-4
      transition-all hover:shadow-2xl hover:translate-y-2`}
			id="inputSearch"
		>
			<div className={`${styles.input} relative flex-1 h-full`}>
				<form onSubmit={(e) => searchHandler(e)}>
					<input
						type="text"
						placeholder=" "
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="
            peer
            h-16 w-full
            pl-4 pr-8
            rounded-l-full
            text-gray-700
            bg-transparent
            placeholder-transparent
            focus:outline-none
            font-bold
          "
					/>

					<p
						className="
            absolute left-4 top-1/2
            -translate-y-1/2
            text-gray-500
            transition-all duration-200
            peer-focus:-top-5
            pointer-events-none
            peer-focus:text-blue-500
            peer-placeholder-shown:top-1/2
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-500
            font-bold
          "
					>
						Search...
					</p>
				</form>
			</div>

			<button
				className="
        flex justify-center items-center
        bg-blue-500
        h-full
        w-12 md:w-16
        rounded-r-full
        hover:bg-blue-600
      "
				onClick={searchHandler}
			>
				<Image
					src={
						isDarkMode
							? "https://boyintyoko.github.io/clock-web/icons/searchIcons/blackSeacrh.png"
							: "https://boyintyoko.github.io/clock-web/icons/searchIcons/whiteSearch.png"
					}
					alt="search icon"
					height={28}
					width={28}
					loading="lazy"
				/>
			</button>
		</div>
	);
}
