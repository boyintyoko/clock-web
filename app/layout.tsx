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
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        <link rel="manifest" href="/site.webmanifest" />
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
