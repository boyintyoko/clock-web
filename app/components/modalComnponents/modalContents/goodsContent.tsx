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
		<div className="fade-in-up">
			{goods.length > 0 ? (
				<div className="flex flex-col gap-5">
					{[...goods].reverse().map((item, index) => (
						<div
							key={index}
							className="
              fade-in-up
              relative
              p-4
              rounded-2xl
              bg-white/10
              backdrop-blur-md
              border border-white/20
              shadow-md
              transition-all duration-200
              hover:-translate-y-1
              hover:shadow-xl
            "
						>
							{/* user info */}
							<Link
								target="_blank"
								href={item.userUrl}
								className="
                group
                flex
                items-center
                gap-3
                p-2
                rounded-xl
                transition-all
                hover:bg-white/10
              "
							>
								<CreatedImageDiv className="relative w-10 h-10 shrink-0">
									<Image
										src={item.userImageUrl}
										alt={`${item.name}'s profile`}
										fill
										className="
                    rounded-full
                    object-cover
                    border border-gray-300
                    transition-transform duration-300
                    group-hover:scale-105
                  "
									/>
								</CreatedImageDiv>

								<StyledP
									className="
                  font-semibold
                  text-gray-800
                  truncate
                  max-w-[160px]
                "
								>
									{item.name}
								</StyledP>
							</Link>

							{/* delete button */}
							<button
								onClick={() => goodDeleteHandle(item.imageUrl)}
								className="
                absolute
                top-2
                right-2
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-full
                bg-white/70
                backdrop-blur
                shadow-md
                text-red-500
                transition-all duration-200
                hover:bg-red-500
                hover:text-white
                hover:scale-105
                active:scale-90
              "
							>
								<i className="fa-solid fa-trash"></i>
							</button>

							{/* image */}
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
								className="
                mt-3
                rounded-xl
                overflow-hidden
                cursor-pointer
                transition-all duration-300
                hover:scale-[1.02]
                hover:shadow-lg
              "
							>
								<Image
									src={item.imageUrl}
									alt={`Image ${index + 1}`}
									width={300}
									height={200}
									className="
                  w-full
                  h-auto
                  object-cover
                  transition-transform duration-300
                  hover:scale-105
                "
									loading="lazy"
								/>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="fade-in-up flex justify-center items-center py-10">
					<p
						className="
          font-semibold
          text-gray-500
          text-lg
          transition-all
          hover:-translate-y-1
        "
					>
						{(() => {
							if (isNowLanguage === "en") {
								return "Nothing saved yet.";
							} else if (isNowLanguage === "it") {
								return "Niente salvato.";
							}
							return "まだ保存されていません。";
						})()}
					</p>
				</div>
			)}
		</div>
	);
}
