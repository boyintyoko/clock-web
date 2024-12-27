import { useState, useEffect } from "react";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundProvider } from "./context/backgroundContext";
import { GoodsProvider } from "./context/goodContext";
import { LanguageProvider } from "./context/languageContext";
import { TimeProvider } from "./context/timeContext";
import { useLanguage } from "./context/languageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [description, setDescription] =
    useState("綺麗な画像とともに時間を確認できます");

  const { isNowLanguage } = useLanguage();

  useEffect(() => {
    if (isNowLanguage === "en") {
      setDescription("You can check the time with beautiful images.");
      return;
    } else if (isNowLanguage === "it") {
      setDescription("È possibile controllare l'ora con bellissime immagini.");
      return;
    }
    setDescription("美しい画像とともに時間を確認できます");
  }, [isNowLanguage]);

  return (
    <html lang="en">
      <head>
        <Head>
          <meta name="description" content={description} />
          <link rel="icon" href="/clock.ico" />
        </Head>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TimeProvider>
          <LanguageProvider>
            <BackgroundProvider>
              <GoodsProvider>{children}</GoodsProvider>
            </BackgroundProvider>
          </LanguageProvider>
        </TimeProvider>
      </body>
    </html>
  );
}
