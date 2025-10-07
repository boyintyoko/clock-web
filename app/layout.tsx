import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundProvider } from "./context/backgroundContext";
import { GoodsProvider } from "./context/goodContext";
import { LanguageProvider } from "./context/languageContext";
import { TimeProvider } from "./context/timeContext";
import { TimeZoneProvider } from "./context/timeZoneContext";
import { BackgroundDescProvider } from "./context/backgroundDesc";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// --- Metadata で favicon を統一 ---
export const metadata: Metadata = {
	title: "Image clock",
	description: "綺麗な画像とともに時間を確認できます",
	keywords: ["時計", "画像時計", "時間確認", "Image Clock"],
	icons: {
		icon: "https://boyintyoko.github.io/clock-web/assets/favicon.svg",
		apple: "https://boyintyoko.github.io/clock-web/assets/apple-touch-icon.png",
		shortcut: "https://boyintyoko.github.io/clock-web/assets/favicon.svg",
	},
	openGraph: {
		type: "website",
		locale: "ja_JP",
		url: "https://clock-web-six.vercel.app",
		title: "Image clock",
		description: "綺麗な画像とともに時間を確認できます",
		images: [
			{
				url: "https://boyintyoko.github.io/clock-web/assets/ogp-image-16x9.png",
				width: 1230,
				height: 720,
				alt: "Image Clock",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@boyintyoko",
		title: "Image clock",
		description: "綺麗な画像とともに時間を確認できます",
		images: [
			"https://boyintyoko.github.io/clock-web/assets/ogp-image-16x9.png",
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ja">
			<head>
				<link
					rel="stylesheet"
					href="https://unpkg.com/driver.js/dist/driver.min.css"
				/>
				<link
					rel="stylesheet"
					href="https://use.fontawesome.com/releases/v6.2.0/css/all.css"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="google-site-verification"
					content="r9bgfR9jIhvPVPAHKCoYpVPS3jrkj4baVspn_fISchA"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="canonical" href="https://clock-web-six.vercel.app/" />
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
