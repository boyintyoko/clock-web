"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useBackground } from "@/app/context/backgroundContext";
import { useGoods } from "@/app/context/goodContext";
import { useLanguage } from "@/app/context/languageContext";
import GoodsType from "@/app/types/goodsType";
import Link from "next/link";
import styled from "styled-components";
import { useBackgroundDesc } from "@/app/context/backgroundDesc";

interface GoodsItemType {
	isGoodsOpen: boolean;
}

const StyledP = styled.p`
  position: relative;
  &::before {
    content: "";
    position: absolute;
    bottom: 12px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #333;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
`;

const CreatedImageDiv = styled.div`
  &:hover p::before {
    transform: scaleX(1);
  }
`;

export default function GoodsContent({ isGoodsOpen }: GoodsItemType) {
	const [goods, setGoods] = useState<GoodsType[]>([]);

	const { setBackground } = useBackground();
	const { setIsNowGoods } = useGoods();
	const { isNowLanguage } = useLanguage();
	const { setBackgroundDesc } = useBackgroundDesc();

	const setImageBackground = (
		imageUrl: string,
		name: string,
		userImage: string,
		userUrl: string,
		userName: string,
	) => {
		setBackground(imageUrl);
		setBackgroundDesc({ imageUrl, name, userImage, userUrl, userName });
		localStorage.setItem("background", imageUrl);
	};

	useEffect(() => {
		const goods = localStorage.getItem("goods");
		if (!goods) return;
		setIsNowGoods(JSON.parse(goods));
	}, [setIsNowGoods]);

	useEffect(() => {
		if (!isGoodsOpen) return;

		const storedGoods = localStorage.getItem("goods");
		if (!storedGoods) return;

		try {
			const parsedGoods = JSON.parse(storedGoods);
			if (Array.isArray(parsedGoods)) {
				setGoods(parsedGoods);
			} else {
				console.error("Invalid goods data in localStorage");
			}
		} catch (error) {
			console.error("Failed to parse goods from localStorage:", error);
		}
	}, [isGoodsOpen]);

	const goodDeleteHandle = (url: string) => {
		const updatedGoods = goods.filter((good) => good.imageUrl !== url);
		setGoods(updatedGoods);
		setIsNowGoods(updatedGoods);
		localStorage.setItem("goods", JSON.stringify(updatedGoods));
	};

	return (
		<div>
			{goods.length > 0 ? (
				<div className="flex flex-col gap-4">
					{[...goods].reverse().map((item, index) => (
						<div
							key={index}
							className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 relative"
						>
							<Link
								target="_blank"
								href={item.userUrl}
								className="group flex items-center gap-3 p-2 rounded-md transition"
							>
								<CreatedImageDiv className="relative w-10 h-10 shrink-0">
									<Image
										src={item.userImageUrl}
										alt={`${item.name}'s profile`}
										fill
										className="rounded-full object-cover border border-gray-300 group-hover:scale-105 transition-transform duration-300"
									/>
								</CreatedImageDiv>
								<StyledP className="font-semibold text-gray-800 group-hover:underline truncate max-w-[160px]">
									{item.name}
								</StyledP>
							</Link>

							<button
								onClick={() => goodDeleteHandle(item.imageUrl)}
								className="absolute rounded-tr-lg right-0 top-0 z-10 w-10 h-10  bg-white p-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 text-red-500 hover:text-red-700"
							>
								<i className="fa-solid fa-trash"></i>
							</button>
							<div
								onClick={() =>
									setImageBackground(
										item.imageUrl,
										item.name,
										item.userImageUrl,
										item.userUrl,
										item.userName,
									)
								}
								className="rounded-lg overflow-hidden hover:shadow-lg transition-transform hover:scale-105 duration-200 cursor-pointer"
							>
								<Image
									src={item.imageUrl}
									alt={`Image ${index + 1}`}
									width={300}
									height={200}
									className="w-full h-auto object-cover"
									loading="lazy"
								/>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="font-bold transition-all hover:translate-y-1">
					{(() => {
						if (isNowLanguage === "en") {
							return "Nothing.";
						} else if (isNowLanguage === "it") {
							return "Niente.";
						}
						return "何もありません。";
					})()}
				</p>
			)}
		</div>
	);
}
