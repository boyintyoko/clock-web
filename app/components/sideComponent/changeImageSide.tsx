"use client";

import { useBackground } from "@@/context/backgroundContext";
import { useBackgroundDesc } from "@@/context/backgroundDesc";
import { useGoods } from "@@/context/goodContext";
import { useLanguage } from "@@/context/languageContext";
import type GoodsType from "@@/types/goodsType";
import type ImageType from "@@/types/ImagesType";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { supabase } from "@/lib/supabase";
import SingleColor from "./singleColor";

type Props = {
	isChange: boolean;
	setIsChange: (isChange: boolean) => void;
	isVisible: boolean;
	setIsVisible: (isVisible: boolean) => void;
};

const StyledP = styled.p`
  position: relative;
  &::before {
    content: "";
    transform: scale(0, 1);
    transform-origin: left;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: #333;
    transition: all 0.5s;
  }
`;

const CreatedImageDiv = styled.div`
  &:hover p::before {
    transform: scale(1);
  }
`;

type ImageChangeParams = {
	imageUrl?: string;
	name?: string;
	userImage?: string;
	userUrl?: string;
	userName?: string;
	isNormal?: boolean;
};

export default function ChangeImageSide({
	isChange,
	setIsChange,
	isVisible,
	setIsVisible,
}: Props) {
	const [images, setImages] = useState<ImageType[]>([]);
	const [searchText, setSearchText] = useState("");
	const [searchError, setSearchError] = useState("");

	const [hearts, setHearts] = useState<GoodsType[]>([]);
	const [loading, setLoading] = useState(false);
	const [count, setCount] = useState(10);
	const [scrollGoTopButton, setScrollGoTopButton] = useState(false);

	const loaderRef = useRef<HTMLDivElement | null>(null);
	const sideBarScrollWidth = useRef<HTMLDivElement>(null);

	const { setBackground, background } = useBackground();
	const { isNowGoods } = useGoods();
	const { isNowLanguage } = useLanguage();
	const { setBackgroundDesc } = useBackgroundDesc();

	const isMobile = useMediaQuery({
		query: "(max-width: 440px)",
	});

	useEffect(() => {
		setHearts(isNowGoods);
	}, [isNowGoods]);

	useEffect(() => {
		const el = sideBarScrollWidth.current;
		if (!el) return;

		const handleScroll = () => {
			setScrollGoTopButton(el.scrollTop >= 100);
		};

		el.addEventListener("scroll", handleScroll);

		return () => {
			el.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const res = await axios.get<ImageType[]>(`/api/unsplash/${count}`);

				setImages((prev) => [...prev, ...res.data]);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [count]);

	useEffect(() => {
		const currentLoader = loaderRef.current;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading) {
					setCount((prev) => prev + 10);
				}
			},
			{ threshold: 0.5 },
		);

		if (currentLoader) observer.observe(currentLoader);

		return () => {
			if (currentLoader) observer.unobserve(currentLoader);
		};
	}, [loading]);

	const imageChangeHandler = async (params: ImageChangeParams = {}) => {
		const {
			imageUrl,
			name,
			userImage,
			userUrl,
			userName,
			isNormal = true,
		} = params;

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			if (!isNormal) {
				setBackground("Random");
				setBackgroundDesc({
					imageUrl: "",
					name: "",
					userImage: "",
					userUrl: "",
					userName: "",
				});

				await supabase.from("settings").upsert(
					{
						user_id: user.id,
						background: "Random",
					},
					{
						onConflict: "user_id",
					},
				);

				return;
			}

			if (imageUrl && name && userImage && userUrl && userName) {
				setBackgroundDesc({
					imageUrl,
					name,
					userImage,
					userUrl,
					userName,
				});

				setBackground(imageUrl);

				await supabase.from("settings").upsert(
					{
						user_id: user.id,
						background: imageUrl,
					},
					{
						onConflict: "user_id",
					},
				);
			}
		} catch (err) {
			console.error("imageChange error:", err);
		}
	};

	const searchSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setImages([]);

		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_UNSPLASH_BASE_URL}?query=${searchText}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_END_KEY}`,
			);

			if (response.data.results.length === 0) {
				setSearchError("No results found.");

				return;
			}

			setImages(response.data.results);

			setSearchError("");
		} catch (err) {
			console.error(err);

			setSearchError("Search error.");
		}
	};

	useEffect(() => {
		const loadGoods = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("goods")
				.select("*")
				.eq("user_id", user.id);

			if (error) return;

			const formatted =
				data?.map((item) => ({
					imageUrl: item.image_url,
					userUrl: item.user_url,
					name: item.name,
					userName: item.user_name,
					userImageUrl: item.user_image_url,
				})) || [];

			setHearts(formatted);
		};

		loadGoods();
	}, []);

	const goodClickHandler = async (
		imageUrl: string,
		userUrl: string,
		name: string,
		userName: string,
		userImageUrl: string,
	) => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const exists = hearts.some((item) => item.imageUrl === imageUrl);

			if (exists) {
				await supabase
					.from("goods")
					.delete()
					.eq("user_id", user.id)
					.eq("image_url", imageUrl);

				setHearts((prev) => prev.filter((item) => item.imageUrl !== imageUrl));
			} else {
				await supabase.from("goods").insert({
					user_id: user.id,
					image_url: imageUrl,
					user_url: userUrl,
					name,
					user_name: userName,
					user_image_url: userImageUrl,
				});

				setHearts((prev) => [
					...prev,
					{
						imageUrl,
						userUrl,
						name,
						userName,
						userImageUrl,
					},
				]);
			}
		} catch (err) {
			console.error("goodClick error:", err);
		}
	};

	const changeSideBar = () => {
		setIsChange(!isChange);

		if (isMobile) setIsVisible(!isVisible);
	};

	const handleByThePremium = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return;
		}

		const res = await axios.post("/api/checkout/subscription", {
			priceId: "price_1TPiV6FxZOM1YYzW6I0b2P8O",
			userId: user.id,
		});

		const data = res.data;

		if (data.url) {
			window.location.href = data.url;
		}
	};

	const handleByThePremiumPlus = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return;
		}

		const res = await axios.post("/api/checkout/payment", {
			priceId: "price_1TPiZxFxZOM1YYzWdmsyA0cX",
			userId: user.id,
		});

		if (res.data.url) {
			window.location.href = res.data.url;
		}
	};

	return (
		<div
			className={`
    fixed
    side-bar
    fixed top-0 right-0
    z-20 
    h-screen 
    w-[384px]
    bg-gradient-to-b from-gray-100 to-white 
    shadow-lg border-l border-gray-200 
    transition-transform duration-300
    overflow-y-auto
    overflow-x-hidden
    ${isChange ? "translate-x-0" : "translate-x-full"}
  `}
			ref={sideBarScrollWidth}
		>
			<div className="p-4 fixid">
				<div
					className="flex items-center justify-between mb-4
                  bg-white/80 backdrop-blur-md
                  rounded-2xl px-4 py-3
                  shadow-sm border border-gray-200"
				>
					<button
						onClick={changeSideBar}
						className="flex justify-center items-center
                 w-9 h-9 rounded-xl
                 hover:bg-gray-100
                 active:scale-95
                 transition"
					>
						<Image
							src="https://boyintyoko.github.io/clock-web/icons/back.png"
							alt="back image"
							height={20}
							width={20}
							loading="lazy"
						/>
					</button>

					<p
						className="text-lg font-semibold
                  text-gray-800
                  tracking-wide select-none"
					>
						{isNowLanguage === "it" ? "Immagine." : "Image."}
					</p>

					<form onSubmit={searchSubmitHandler} className="relative">
						<input
							onChange={(e) => setSearchText(e.target.value)}
							type="text"
							value={searchText}
							placeholder="Search..."
							className="w-44
                   bg-gray-50
                   border border-gray-200
                   rounded-xl
                   px-3 py-2
                   text-sm
                   focus:outline-none
                   focus:ring-2 focus:ring-blue-400
                   focus:bg-white
                   transition"
						/>
					</form>
				</div>

				<SingleColor />

				{searchError && (
					<p className="text-red-500 font-bold mt-2">{searchError}</p>
				)}

				<div className="grid grid-cols-1 gap-4 pt-4">
					<button
						onClick={() => imageChangeHandler({ isNormal: false })}
						className={`
    relative
    flex items-center justify-center gap-2
    h-16 w-full
    rounded-2xl
    font-semibold
    text-gray-700
    bg-gradient-to-r from-gray-100 to-gray-200
    shadow-sm
    transition
    hover:scale-[1.02]
    hover:shadow-md
    active:scale-[0.98]
    select-none
    border
    ${
			background === "Random"
				? "ring-2 ring-blue-500 border-transparent bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600"
				: "border-gray-200"
		}
  `}
					>
						Random Background
					</button>
					{images.map((image, index) => {
						const isLiked = hearts.some(
							(item) => item.imageUrl === image.urls.regular,
						);
						return (
							<div
								key={index}
								className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
							>
								<div className="flex items-center justify-between mb-3">
									<Link
										target="_blank"
										href={image.user.links.html}
										className="flex items-center"
									>
										<CreatedImageDiv className="flex relative items-center">
											<Image
												src={image.user.profile_image.large}
												alt={`${image.user.name}'s profile`}
												height={40}
												width={40}
												className="rounded-full border border-gray-300"
												loading="lazy"
											/>
											<StyledP className="ml-3 font-medium text-gray-700 truncate">
												{image.user.name}
											</StyledP>
										</CreatedImageDiv>
									</Link>
									<div className="flex gap-3">
										<button
											onClick={() =>
												goodClickHandler(
													image.urls.regular,
													image.user.links.html,
													image.user.name,
													image.user.username,
													image.user.profile_image.large,
												)
											}
											className="transition-all hover:translate-y-1 text-xl"
										>
											{isLiked ? (
												<i className="fa-solid fa-heart text-red-500"></i>
											) : (
												<i className="fa-regular fa-heart"></i>
											)}
										</button>
									</div>
								</div>

								<div
									onClick={() =>
										imageChangeHandler({
											imageUrl: image.urls.regular,
											name: image.user.name,
											userImage: image.user.profile_image.medium,
											userUrl: image.user.links.html,
											userName: image.user.username,
											isNormal: true,
										})
									}
									className={`${
										image.urls.regular === background &&
										"border-2 border-blue-500"
									} rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg hover:scale-105 duration-200 cursor-pointer`}
								>
									<Image
										src={image.urls.regular}
										alt={`Image ${index + 1}`}
										width={300}
										height={200}
										className="w-full h-auto object-cover"
										loading="lazy"
									/>
								</div>
							</div>
						);
					})}
				</div>

				<div
					ref={loaderRef}
					className="h-10 flex justify-center items-center font-bold"
				>
					{loading && (
						<div className="flex items-center gap-1">
							<p className="mr-1">Loading</p>
							<span className="animate-bounce [animation-delay:0s]">.</span>
							<span className="animate-bounce [animation-delay:0.2s]">.</span>
							<span className="animate-bounce [animation-delay:0.4s]">.</span>
						</div>
					)}
				</div>
			</div>

			<div className="sticky bottom-10 flex justify-end pr-2">
				<button
					onClick={() =>
						sideBarScrollWidth.current?.scrollTo({
							top: 0,
							behavior: "smooth",
						})
					}
					className={`
              transition-all duration-300

              ${
								scrollGoTopButton && isChange
									? "opacity-100"
									: "opacity-0 pointer-events-none"
							}

              bg-white
              p-5
              rounded-full
              shadow-2xl
              hover:-translate-y-1
              bg-opacity-70
            `}
				>
					<i className="fa-solid fa-jet-fighter-up text-3xl"></i>
				</button>
			</div>
		</div>
	);
}
