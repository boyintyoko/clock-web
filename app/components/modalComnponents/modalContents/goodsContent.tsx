"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import GoodsType from "@@/types/goodsType";
import { useBackground } from "@@/context/backgroundContext";
import { useGoods } from "@@/context/goodContext";
import { useLanguage } from "@@/context/languageContext";
import { useBackgroundDesc } from "@@/context/backgroundDesc";
import { supabase } from "@/lib/supabase";

type Props = {
	isGoodsOpen: boolean;
};

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

export default function GoodsContent({ isGoodsOpen }: Props) {
	const [goods, setGoods] = useState<GoodsType[]>([]);
	const [loading, setLoading] = useState(false);

	const { setBackground } = useBackground();
	const { setIsNowGoods } = useGoods();
	const { isNowLanguage } = useLanguage();
	const { setBackgroundDesc } = useBackgroundDesc();

	const setImageBackground = async (
		imageUrl: string,
		name: string,
		userImage: string,
		userUrl: string,
		userName: string,
	) => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			setBackground(imageUrl);

			setBackgroundDesc({
				imageUrl,
				name,
				userImage,
				userUrl,
				userName,
			});

			const { error } = await supabase.from("settings").upsert(
				{
					user_id: user.id,
					background: imageUrl,
				},
				{
					onConflict: "user_id",
				},
			);

			if (error) {
				console.error("background save error:", error);
			}
		} catch (err) {
			console.error("setImageBackground error:", err);
		}
	};
	useEffect(() => {
		if (!isGoodsOpen) return;

		const loadGoods = async () => {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setLoading(false);
				return;
			}

			const { data, error } = await supabase
				.from("goods")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("goods取得失敗:", error);
				setLoading(false);
				return;
			}

			const formatted: GoodsType[] =
				data?.map((item) => ({
					imageUrl: item.image_url,
					userUrl: item.user_url,
					name: item.name,
					userName: item.user_name,
					userImageUrl: item.user_image_url,
				})) || [];

			setGoods(formatted);
			setIsNowGoods(formatted);

			setLoading(false);
		};

		loadGoods();
	}, [isGoodsOpen, setIsNowGoods]);

	const goodDeleteHandle = async (url: string) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { error } = await supabase
			.from("goods")
			.delete()
			.eq("user_id", user.id)
			.eq("image_url", url);

		if (error) {
			console.error("削除失敗:", error);
			return;
		}

		const updatedGoods = goods.filter((good) => good.imageUrl !== url);

		setGoods(updatedGoods);
		setIsNowGoods(updatedGoods);
	};

	// =========================
	// LOADING UI
	// =========================
	if (loading) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="flex flex-col items-center gap-3">
					<div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
					<p className="text-gray-500 font-semibold">Loading...</p>
				</div>
			</div>
		);
	}

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

								<StyledP className="font-semibold text-gray-800 truncate max-w-[160px]">
									{item.name}
								</StyledP>
							</Link>

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
					<p className="font-semibold text-gray-500 text-lg">
						{isNowLanguage === "en"
							? "Nothing saved yet."
							: isNowLanguage === "it"
								? "Niente salvato."
								: "まだ保存されていません。"}
					</p>
				</div>
			)}
		</div>
	);
}
