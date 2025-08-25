"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ImageType from "@/app/types/ImagesType";
import SingleColor from "./singleColor";
import { useBackground } from "@/app/context/backgroundContext";
import Link from "next/link";
import { useGoods } from "@/app/context/goodContext";
import { useLanguage } from "@/app/context/languageContext";
import styled from "styled-components";
import { useBackgroundDesc } from "@/app/context/backgroundDesc";
import GoodsType from "@/app/types/goodsType";

type ChangeImageSideProps = {
  isChange: boolean;
  setIsChange: (isChange: boolean) => void;
};

const StyledP = styled.p`
  &::before {
    content: "";
    transform: scale(0, 1);
    transform-origin: left;
    position: absolute;
    bottom: 12px;
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

export default function ChangeImageSide({
  isChange,
  setIsChange,
}: ChangeImageSideProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");

  const getInitialGoods: GoodsType[] =
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem("goods") || "[]") as GoodsType[])
      : [];

  const [hearts, setHearts] = useState<GoodsType[]>(getInitialGoods);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(10);
  const [scrollGoTopButton, setScrollGoTopButton] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { setBackground, background } = useBackground();
  const { isNowGoods } = useGoods();
  const { isNowLanguage } = useLanguage();
  const { setBackgroundDesc } = useBackgroundDesc();
  const sideBarScrollWidth = useRef<HTMLDivElement>(null);

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
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = sideBarScrollWidth.current;
    if (!el) return;

    if (!isChange) {
      setScrollGoTopButton(false);
    } else if (isChange && el.scrollTop >= 100) {
      setScrollGoTopButton(true);
    }
  }, [isChange]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<ImageType[]>(`/api/unsplash/${count}`);
        setImages((prevImages) => [...prevImages, ...res.data]);
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

  const imageChangeHandler = (
    imageUrl: string,
    name: string,
    userImage: string,
    userUrl: string,
    userName: string,
  ): void => {
    localStorage.setItem("background", imageUrl);
    localStorage.setItem(
      "backgroundDescription",
      JSON.stringify({ imageUrl, name, userImage, userUrl, userName }),
    );
    setBackgroundDesc({ imageUrl, name, userImage, userUrl, userName });
    setBackground(imageUrl);
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
      setSearchError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    localStorage.setItem("goods", JSON.stringify(hearts));
  }, [hearts]);

  const goodClickHandler = (
    imageUrl: string,
    userUrl: string,
    name: string,
    userName: string,
    userImageUrl: string,
  ) => {
    setHearts((prevGoods) => {
      const exists = prevGoods.some((item) => item.imageUrl === imageUrl);
      if (exists) {
        return prevGoods.filter((item) => item.imageUrl !== imageUrl);
      }
      return [
        ...prevGoods,
        { imageUrl, userUrl, name, userName, userImageUrl },
      ];
    });
  };

  const changeSideBar = () => {
    setIsChange(!isChange);
    localStorage.setItem("isSideBarChang", JSON.stringify(!isChange));
  };

  return (
    <div
      className={`side-bar absolute top-0 ${
        isChange ? "right-0" : "-right-96"
      } z-20 h-screen w-96 bg-gradient-to-b from-gray-100 to-white shadow-lg border-l border-gray-200 transition-all overflow-auto`}
      ref={sideBarScrollWidth}
    >
      <div className="p-4 fixid">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={changeSideBar}
            className="flex justify-center items-center transition-all hover:translate-y-1"
          >
            <Image
              src="/back.png"
              alt="back image"
              height={25}
              width={25}
              loading="lazy"
            />
          </button>
          <p className="text-xl font-bold text-gray-800 transition-all hover:translate-y-1">
            {isNowLanguage === "it" ? "Immagine." : "Image."}
          </p>
          <form
            onSubmit={searchSubmitHandler}
            className="relative transition-all hover:translate-y-1"
          >
            <input
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              value={searchText}
              placeholder="Search..."
              className="border border-gray-300 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </form>
        </div>

        <SingleColor />

        {searchError && (
          <p className="text-red-500 font-bold mt-2">{searchError}</p>
        )}

        <div className="grid grid-cols-1 gap-4 pt-4">
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
                    imageChangeHandler(
                      image.urls.regular,
                      image.user.name,
                      image.user.profile_image.medium,
                      image.user.links.html,
                      image.user.username,
                    )
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

      <button
        onClick={() =>
          sideBarScrollWidth.current?.scrollTo({ top: 0, behavior: "smooth" })
        }
        className={`fixed ${
          scrollGoTopButton && isChange ? "right-10" : "-right-20"
        } transition-all bottom-10 bg-white p-5 rounded-full shadow-2xl hover:bottom-8 bg-opacity-50`}
      >
        <i className="fa-solid fa-jet-fighter-up text-4xl"></i>
      </button>
    </div>
  );
}
