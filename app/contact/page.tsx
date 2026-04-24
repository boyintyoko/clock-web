"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Contact() {
	const [imageUrl, setImageUrl] = useState<string>("");

	useEffect(() => {
		const getPhoto = async () => {
			try {
				const res = await axios.get("/api/unsplash/photo");
				setImageUrl(res.data.imageUrl);
			} catch (error) {
				console.error("Failed to fetch image:", error);
			}
		};

		getPhoto();
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

			<div
				className="
        relative
        w-full
        max-w-2xl
        rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        shadow-2xl
        p-10
        text-white
      "
			>
				<h1 className="text-3xl font-bold mb-8 text-center">Contact</h1>

				<p className="text-sm text-white/80 mb-8 text-center leading-relaxed">
					If you have any questions, feedback, or support requests, please feel
					free to contact us using the information below.
				</p>

				<div className="space-y-6">
					<ContactItem
						label="Email"
						value="clockwebsix@gmail.com"
						href="mailto:clockwebsix@gmail.com"
					/>

					<ContactItem
						label="Phone"
						value="070-9057-4541"
						href="tel:07090574541"
					/>
				</div>

				<div className="mt-10 text-xs text-white/50 text-center">
					We aim to respond to inquiries as soon as possible.
				</div>
			</div>
		</div>
	);
}

function ContactItem({
	label,
	value,
	href,
}: {
	label: string;
	value: string;
	href: string;
}) {
	return (
		<div className="border border-white/10 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition">
			<div className="text-xs text-white/60 mb-1">{label}</div>

			<a
				href={href}
				className="
          text-lg
          font-medium
          hover:underline
          break-all
        "
			>
				{value}
			</a>
		</div>
	);
}
