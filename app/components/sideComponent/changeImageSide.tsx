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

type ChangeImageSideProps = {
  isChange: boolean;
  setIsChange: (isChange: boolean) => void;
};

export default function ChangeImageSide({
  isChange,
  setIsChange,
}: ChangeImageSideProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");
  const getInitialGoods =
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("goods") || "[]");
  const [hearts, setHearts] = useState<string[]>(getInitialGoods);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(10);
  const [scrollGoTopButton, setScrollGoTopButton] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { setBackground, background } = useBackground();
  const { isNowGoods } = useGoods();
  const { isNowLanguage } = useLanguage();
  const sideBarScrollWidth = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHearts(isNowGoods);
  }, [isNowGoods]);

  useEffect(() => {
    const el = sideBarScrollWidth.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop >= 100) {
        setScrollGoTopButton(true);
      } else {
        setScrollGoTopButton(false);
      }
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

  const imageChangeHandler = (imageUrl: string): void => {
    localStorage.setItem("background", imageUrl);
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

  const goodClickHandler = (url: string) => {
    setHearts((prevGoods) => {
      if (prevGoods.includes(url)) {
        return prevGoods.filter((item) => item !== url);
      }
      return [...prevGoods, url];
    });
  };

  return (
    <div
      className={`side-bar absolute top-0 ${
        isChange ? "right-0" : "-right-96"
      } z-20 h-screen w-96 bg-gradient-to-b from-gray-100 to-white shadow-lg border-l border-gray-200 transition-all overflow-auto`}
      ref={sideBarScrollWidth}
    >
      <div className="p-4 fixid">
        <div className=" flex justify-between items-center mb-4">
          <button
            onClick={() => setIsChange(!isChange)}
            className="flex justify-center items-center"
          >
            <Image src="/back.png" alt="back image" height={25} width={25} />
          </button>
          <p className="text-xl font-bold text-gray-800">
            {isNowLanguage === "it" ? "Immagine." : "Image."}
          </p>
          <form onSubmit={searchSubmitHandler} className="relative">
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
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <Link
                  target="_blank"
                  href={image.user.links.html}
                  className="flex items-center hover:underline"
                >
                  <div className="flex items-center">
                    <Image
                      src={image.user.profile_image.large}
                      alt={`${image.user.name}'s profile`}
                      height={40}
                      width={40}
                      className="rounded-full border border-gray-300"
                    />
                    <p className="ml-3 font-medium text-gray-700 truncate">
                      {image.user.name}
                    </p>
                  </div>
                </Link>
                <div className="flex gap-3">
                  <button
                    onClick={() => goodClickHandler(image.urls.regular)}
                    className="transition-all hover:-translate-y-1 text-xl"
                  >
                    {hearts.includes(image.urls.regular) ? (
                      <>
                        <i className="fa-solid fa-heart text-red-500"></i>
                      </>
                    ) : (
                      <>
                        <i className="fa-regular fa-heart"></i>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => goodClickHandler(image.urls.regular)}
                    className="transition-all hover:-translate-y-1 text-xl"
                  >
                    {hearts.includes(image.urls.regular) ? (
                      <>
                        <i className="fa-solid fa-thumbs-up"></i>
                      </>
                    ) : (
                      <>
                        <i className="fa-regular fa-thumbs-up"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div
                onClick={() => imageChangeHandler(image.urls.regular)}
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
                />
              </div>
            </div>
          ))}
        </div>
        <div ref={loaderRef} className="h-10 flex justify-center items-center">
          {loading && <p>Loading...</p>}
        </div>
      </div>
      <button
        onClick={() => {
          sideBarScrollWidth.current?.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`fixed ${scrollGoTopButton && isChange ? "right-10" : "-right-20"}  transition-all  bottom-10  bg-white p-5 rounded-full shadow-2xl hover:bottom-8`}
      >
        <i className="fa-solid fa-jet-fighter-up text-4xl"></i>
      </button>
    </div>
  );
}
