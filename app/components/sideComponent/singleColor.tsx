"use client";

import Image from "next/image";
import { useBackground } from "@/app/context/backgroundContext";
import { useEffect, useState } from "react";
import ChooseColorContent from "../modalComnponents/modalContents/chooseColor";
import Modal from "../modal/modal";
import ModalButton from "../modalComnponents/modalButton";
import colors from "@/data/colorData";
import { supabase } from "@/lib/supabase";

export default function SingleColor() {
	const { setBackground, background } = useBackground();

	const [isNowBackground, setIsNowBackground] = useState<string>("");

	const [myColors, setMyColors] = useState<string[]>([]);

	const [isChooseColorOpen, setIsChoosColorOpen] = useState<boolean>(false);

	const colorChangeHandler = async (color: string) => {
		localStorage.setItem("background", color);
		setBackground(color);
		setIsNowBackground(color);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { error } = await supabase.from("settings").upsert({
			user_id: user.id,
			background: color,
		});

		if (error) {
			console.error("単色背景保存失敗:", error);
		} else {
			console.log("単色背景保存成功");
		}
	};

	const deleteMyColor = (index: number) => {
		const updated = myColors.filter((_, i) => i !== index);

		setMyColors(updated);

		localStorage.setItem("myColors", JSON.stringify(updated));

		if (myColors[index] === isNowBackground) {
			localStorage.setItem(
				"background",
				"https://boyintyoko.github.io/clock-web/assets/initialValuePhoto.avif",
			);
			setBackground("");
			setIsNowBackground("");
		}
	};

	useEffect(() => {
		if (background.startsWith("https")) {
			setIsNowBackground("");
		}
	}, [background]);

	useEffect(() => {
		const url = localStorage.getItem("background");

		if (url?.startsWith("https")) return;
		if (!url) return;

		setIsNowBackground(url);
	}, []);

	useEffect(() => {
		const saved = localStorage.getItem("myColors");

		if (saved) {
			setMyColors(JSON.parse(saved));
		}
	}, []);

	return (
		<div className="flex flex-nowrap overflow-x-auto gap-3 border-b p-1 pt-2">
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
							isNowBackground === color + ".png"
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
					setMyColors={setMyColors}
					isChooseColorOpen={isChooseColorOpen}
					setIsChoosColorOpen={setIsChoosColorOpen}
				/>
			</Modal>
		</div>
	);
}
