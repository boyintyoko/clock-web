"use client";

import Image from "next/image";
import { useBackground } from "@@/context/backgroundContext";
import { useEffect, useState } from "react";
import ChooseColorContent from "@@/components/modalComnponents/modalContents/chooseColor";
import Modal from "@@/components/modal/modal";
import ModalButton from "@@/components/modalComnponents/modalButton";
import colors from "@/data/colorData";
import { supabase } from "@/lib/supabase";

export default function SingleColor() {
	const { setBackground, background } = useBackground();

	const [isNowBackground, setIsNowBackground] = useState<string>("");

	const [myColors, setMyColors] = useState<string[]>([]);

	const [isChooseColorOpen, setIsChoosColorOpen] = useState<boolean>(false);

	/* =========================
     background変更
  ========================= */

	const colorChangeHandler = async (color: string) => {
		setBackground(color);
		setIsNowBackground(color);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		await supabase.from("settings").upsert(
			{
				user_id: user.id,
				background: color,
			},
			{
				onConflict: "user_id",
			},
		);
	};

	/* =========================
     myColors削除
  ========================= */

	const deleteMyColor = async (index: number) => {
		const updated = myColors.filter((_, i) => i !== index);

		setMyColors(updated);

		if (myColors[index] === isNowBackground) {
			setBackground("");
			setIsNowBackground("");
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		await supabase.from("settings").upsert(
			{
				user_id: user.id,
				my_colors: updated,
			},
			{
				onConflict: "user_id",
			},
		);
	};

	/* =========================
     background状態同期
  ========================= */

	useEffect(() => {
		if (!background) return;

		if (background === "Random" || background.startsWith("https")) {
			setIsNowBackground("");
		} else {
			setIsNowBackground(background);
		}
	}, [background]);

	/* =========================
     初期データ取得（重要）
  ========================= */

	useEffect(() => {
		const getSettings = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error || !user) return;

			const { data } = await supabase
				.from("settings")
				.select("background, my_colors")
				.eq("user_id", user.id)
				.single();

			if (!data) return;

			/* background */

			const url = data.background;

			if (url?.startsWith("https")) {
				setIsNowBackground(url);
			} else if (url) {
				setIsNowBackground(url);
			}

			/* myColors */

			if (data.my_colors) {
				setMyColors(data.my_colors);
			}
		};

		getSettings();
	}, []);

	return (
		<div className="flex flex-nowrap overflow-x-auto gap-3 border-b p-1 pt-2">
			{/* =========================
         固定カラー
      ========================= */}

			{colors.map((color, i) => (
				<button
					key={i}
					onClick={() => colorChangeHandler(color + ".png")}
					className={`
            flex
            border-2
            rounded-full
            p-1
            transition
            duration-200
            hover:scale-105
            active:scale-95
            ${
							isNowBackground === color + ".png" && isNowBackground !== "Random"
								? "ring-2 ring-blue-500"
								: "border-neutral-300"
						}
          `}
				>
					<div className="h-12 w-12 overflow-hidden rounded-full">
						<Image
							src={`https://github.com/boyintyoko/boyintyoko.github.io/blob/main/clock-web/icons/colors/${color}.png?raw=true`}
							height={50}
							width={50}
							alt={color}
							loading="lazy"
						/>
					</div>
				</button>
			))}

			{/* =========================
         My Colors
      ========================= */}

			{myColors.map((color, i) => (
				<div key={`my-${i}`} className="relative">
					<button
						onClick={() => deleteMyColor(i)}
						className="
              absolute
              -top-1
              -right-1
              h-5
              w-5
              rounded-full
              bg-red-500
              text-white
              text-xs
              flex
              items-center
              justify-center
              hover:scale-110
              active:scale-95
              z-10
            "
					>
						×
					</button>

					<button
						onClick={() => colorChangeHandler(color)}
						className={`
              flex
              border-2
              rounded-full
              p-1
              transition
              duration-200
              hover:scale-105
              active:scale-95
              ${
								isNowBackground === color
									? "ring-2 ring-blue-500"
									: "border-neutral-300"
							}
            `}
					>
						<div
							className="h-12 w-12 rounded-full"
							style={{
								backgroundColor: color,
							}}
						/>
					</button>
				</div>
			))}

			{/* =========================
         Add Color Button
      ========================= */}

			<ModalButton
				isOpen={isChooseColorOpen}
				setIsOpen={setIsChoosColorOpen}
				isDarkMode={true}
				blackImageUrl="https://raw.githubusercontent.com/boyintyoko/boyintyoko.github.io/d7a9da6b6fc683b2662a2a7efad7118f129aec6d/clock-web/icons/addIcons/addWhite.svg"
				whiteImageUrl="https://raw.githubusercontent.com/boyintyoko/boyintyoko.github.io/d7a9da6b6fc683b2662a2a7efad7118f129aec6d/clock-web/icons/addIcons/addBlack.svg"
			/>

			<Modal
				isOpen={isChooseColorOpen}
				setIsOpen={setIsChoosColorOpen}
				title="Choose color"
			>
				<ChooseColorContent
					myColors={myColors}
					setMyColors={setMyColors}
					isChooseColorOpen={isChooseColorOpen}
					setIsChoosColorOpen={setIsChoosColorOpen}
				/>
			</Modal>
		</div>
	);
}
