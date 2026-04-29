"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CancelPage() {
	const [imageUrl, setImageUrl] = useState("");

	// 背景画像取得
	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			const data = res.data;
			setImageUrl(data.imageUrl);
		};
		getPhoto();
	}, []);

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background */}
			<div
				className="absolute inset-0 scale-110"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			{/* Overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60 backdrop-blur-sm" />

			{/* Glass Card */}
			<div className="relative z-10 w-[92%] max-w-md">
				<div
					className="
          bg-white/10
          backdrop-blur-2xl
          border
          border-white/20
          rounded-3xl
          shadow-[0_8px_40px_rgba(0,0,0,0.4)]
          p-8
          flex
          flex-col
          items-center
          text-center
          gap-6
        "
				>
					{/* Cancel Icon */}
					<div
						className="
            w-20 h-20
            rounded-full
            bg-red-500/30
            border border-red-400/40
            flex
            items-center
            justify-center
            text-white
            text-4xl
            shadow-lg
            backdrop-blur-md
          "
					>
						✕
					</div>

					{/* Title */}
					<h1 className="text-3xl font-bold text-white tracking-tight">
						Payment Cancelled
					</h1>

					{/* Subtitle */}
					<p className="text-white/80 text-sm leading-relaxed">
						Your payment was cancelled.
						<br />
						No charges were made to your account.
					</p>

					{/* Buttons */}
					<div className="flex flex-col w-full gap-3 mt-2">
						{/* Try Again */}
						<a
							href="/premium"
							className="
              w-full
              px-6
              py-3
              bg-white/90
              text-black
              font-semibold
              rounded-xl
              hover:bg-white
              hover:scale-[1.02]
              active:scale-[0.98]
              transition
              duration-200
              shadow-lg
            "
						>
							Try Again
						</a>

						{/* Go Home */}
						<a
							href="/"
							className="
              w-full
              px-6
              py-3
              bg-white/10
              border
              border-white/20
              text-white
              font-semibold
              rounded-xl
              hover:bg-white/20
              transition
              duration-200
            "
						>
							Go to Home
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
