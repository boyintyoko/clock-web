"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Cancel() {
	const [imageUrl, setImageUrl] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			setImageUrl(res.data.imageUrl);
		};
		getPhoto();
	}, []);

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
			<div
				className="absolute inset-0 scale-110 blur-sm"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>

			<div className="absolute inset-0 bg-black/60" />

			<div className="relative z-10 w-[90%] max-w-md rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-center">
				<div className="flex justify-center">
					<div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-3xl">
						❌
					</div>
				</div>

				<h1 className="text-2xl font-bold mt-4">Payment Failed</h1>

				<p className="text-sm text-gray-300 mt-2">
					Something went wrong during checkout.
					<br />
					Please try again.
				</p>

				<div className="mt-6 space-y-3">
					<button
						onClick={() => router.push("/")}
						className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
					>
						Back to Home
					</button>
				</div>
			</div>
		</div>
	);
}
