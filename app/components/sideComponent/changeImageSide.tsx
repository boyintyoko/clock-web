"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ImageType from "@/app/types/ImagesType";
import SingleColor from "./singleColor";
import { useBackground } from "@/app/context/backgroundContext";
import Link from "next/link";

type ChangeImageSideProps = {
  isChange: boolean;
};

export default function ChangeImageSide({ isChange }: ChangeImageSideProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");

  const { setBackground } = useBackground();

  useEffect(() => {
    axios
      .get(
        "https://api.unsplash.com/search/photos?query=Japan&client_id=TiAoupzP1ia4t_iuBsKpVUKvhAnfgrS5Ql97j9Vb9aU"
      )
      .then((res) => setImages(res.data.results))
      .catch((e) => console.log(e));
  }, []);

  const imageChangeHandler = (imageUrl: string): void => {
    localStorage.setItem("background", imageUrl);
    setBackground(imageUrl);
  };

  const searchSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${searchText}&client_id=TiAoupzP1ia4t_iuBsKpVUKvhAnfgrS5Ql97j9Vb9aU`
      );
      if (res.data.results.length === 0) {
        setSearchError("No results found.");
        setImages([]);
        setSearchText("");
        return;
      }
      setImages(res.data.results);
      setSearchError("");
      setSearchText("");
    } catch (error) {
      console.error(error);
      setSearchError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className={`absolute top-0 ${
        isChange ? "right-0" : "-right-96"
      } z-20 h-screen w-96 bg-gradient-to-b from-gray-100 to-white shadow-lg border-l border-gray-200 transition-all overflow-auto`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-bold text-gray-800">Images</p>
          <form onSubmit={searchSubmitHandler}>
            <input
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value)
              }
              type="text"
              value={searchText}
              placeholder="Search..."
              className="border rounded-md px-3 py-1 w-40 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </form>
        </div>
        <SingleColor />

        {searchError && <p className="text-red-500">{searchError}</p>}

        <div className="grid grid-cols-1 gap-6 pt-3">
          {images?.map((image, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
              <Link
                target="_blank"
                href={image.user.links.html}
                className="flex items-center mb-3 hover:underline"
              >
                <Image
                  src={image.user.profile_image.large}
                  alt={`${image.user.name}'s profile`}
                  height={40}
                  width={40}
                  className="rounded-full border border-gray-300"
                />
                <p className="ml-3 font-medium text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap">
                  {image.user.name}
                </p>
              </Link>
              <div
                onClick={() => imageChangeHandler(image.urls.regular)}
                className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-105 duration-200 cursor-pointer"
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
      </div>
    </div>
  );
}
