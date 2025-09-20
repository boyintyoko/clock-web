import Image from "next/image"
import { useEffect, useState } from "react"
import urlData from "@/data/urlData";

interface UrlItem {
  link: string;
  url: string;
  alt: string;
  id: number;
}

interface Props {
  urls: UrlItem[];
  setUrls: (urls: UrlItem[]) => void
}

export default function LinkSettingContent({ urls, setUrls }: Props) {

  useEffect(() => {
    const stored = localStorage.getItem("urlData");
    if (stored) {
      setUrls(JSON.parse(stored));
    } else {
      localStorage.setItem("urlData", JSON.stringify(urlData));
      setUrls(urlData);
    }
  }, []);

  const changeLinkSetting = (id: number, newUrl: string) => {
    const updated = urls.map(item =>
      item.id === id ? { ...item, url: newUrl } : item
    );
    setUrls(updated);
    localStorage.setItem("urlData", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-3">
      {urls.map((url) => (
        <div key={url.id} className="flex justify-around">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all">
            <Image
              src={url.link}
              alt={url.alt}
              height={20}
              width={20}
              loading="lazy"
            />
          </div>
          <input
            onChange={(e) => changeLinkSetting(url.id, e.target.value)}
            value={url.url}
            type="text"
            placeholder="New url"
            className="outline-none border-b border-gray-600 font-bold"
          />
        </div>
      ))}
    </div>
  );
}

