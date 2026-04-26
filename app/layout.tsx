import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://clock-web-six.vercel.app"),

	title: "Image Clock | 美しい背景画像の時計",

	description:
		"綺麗な背景画像とともに現在時刻を表示できるWeb時計。背景画像の変更やカスタマイズに対応したシンプルで使いやすい時計アプリ。",

	keywords: [
		"時計",
		"画像時計",
		"Web時計",
		"デジタル時計",
		"背景画像 時計",
		"オンライン時計",
		"Image Clock",
	],

	icons: {
		icon: [
			{ url: "/favicons/favicon.ico" },
			{ url: "/favicons/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
		],
		apple: [
			{
				url: "/favicons/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	},

	manifest: "/favicons/site.webmanifest",

	alternates: {
		canonical: "https://clock-web-six.vercel.app",
	},

	robots: {
		index: true,
		follow: true,
	},

	openGraph: {
		type: "website",
		locale: "ja_JP",
		url: "https://clock-web-six.vercel.app",

		title: "Image Clock | 美しい背景画像の時計",

		description:
			"綺麗な背景画像とともに現在時刻を表示できるWeb時計。背景画像の変更やカスタマイズに対応。",

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

		title: "Image Clock | 美しい背景画像の時計",

		description:
			"綺麗な画像とともに時間を確認できるカスタマイズ可能なWeb時計。",

		images: [
			"https://boyintyoko.github.io/clock-web/assets/ogp-image-16x9.png",
		],
	},

	viewport: {
		width: "device-width",
		initialScale: 1,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<head>
				<meta
					name="google-site-verification"
					content="r9bgfR9jIhvPVPAHKCoYpVPS3jrkj4baVspn_fISchA"
				/>

				<meta name="apple-mobile-web-app-title" content="Image Clock" />

				<meta name="google-adsense-account" content="ca-pub-2975765036916124" />
			</head>

			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					{children}
					<Analytics />
				</Providers>
			</body>
		</html>
	);
}
