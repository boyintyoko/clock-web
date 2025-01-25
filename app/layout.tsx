import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundProvider } from "./context/backgroundContext";
import { GoodsProvider } from "./context/goodContext";
import { LanguageProvider } from "./context/languageContext";
import { TimeProvider } from "./context/timeContext";

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
  keywords: ["時計", "画像時計", "時間確認", "Image Clock"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://web-clock-dawoyiteng.vercel.app",
    title: "Image clock",
    description: "綺麗な画像とともに時間を確認できます",
    images: [
      {
        url: "https://web-clock-dawoyiteng.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
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
        <meta
          name="description"
          content="綺麗な画像とともに時間を確認できます"
        />
        <meta name="keywords" content="時計, 画像時計, 時間確認, Image Clock" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ja_JP" />
        <meta
          property="og:url"
          content="https://web-clock-dawoyiteng.vercel.app"
        />
        <meta property="og:title" content="Image clock" />
        <meta
          property="og:description"
          content="綺麗な画像とともに時間を確認できます"
        />
        <meta
          property="og:image"
          content="https://web-clock-dawoyiteng.vercel.app/og-image.jpg"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link rel="icon" href="/clock.ico" />
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
