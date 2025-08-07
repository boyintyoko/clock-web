import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundProvider } from "./context/backgroundContext";
import { GoodsProvider } from "./context/goodContext";
import { LanguageProvider } from "./context/languageContext";
import { TimeProvider } from "./context/timeContext";
import { TimeZoneProvider } from "./context/timeZoneContext";
import { Analytics } from "@vercel/analytics/react";
import { BackgroundDescProvider } from "./context/backgroundDesc";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image clock",
  description: "綺麗な画像とともに時間を確認できます",
  icons: ["/apple-touch-icon.png"],
  keywords: ["時計", "画像時計", "時間確認", "Image Clock"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://web-clock-dawoyiteng.vercel.app",
    title: "Image clock",
    description: "綺麗な画像とともに時間を確認できます",
    images: [
      {
        url: "/ogp-image.png",
        width: 1230,
        height: 720,
        alt: "Image Clock",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/driver.js/dist/driver.min.css"
        />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v6.2.0/css/all.css"
        />
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundDescProvider>
          <TimeZoneProvider>
            <TimeProvider>
              <LanguageProvider>
                <BackgroundProvider>
                  <GoodsProvider>
                    {children}
                    <Analytics />
                  </GoodsProvider>
                </BackgroundProvider>
              </LanguageProvider>
            </TimeProvider>
          </TimeZoneProvider>
        </BackgroundDescProvider>
      </body>
    </html>
  );
}
