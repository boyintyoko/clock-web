"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function CheckEmail() {
	const [imageUrl, setImageUrl] = useState<string>("");

	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			setImageUrl(res.data.imageUrl);
		};
		getPhoto();
	}, []);

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			<div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

			<div className="relative z-10 w-full max-w-md mx-4">
				<div
					className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl 
                        rounded-3xl shadow-2xl p-8 text-center space-y-6"
				>
					<div className="flex justify-center">
						<div className="bg-blue-500/10 p-4 rounded-2xl"></div>
					</div>

					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
						Check your email
					</h1>

					<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
						We've sent a verification link to your email address.
						<br />
						Click the link to activate your account.
					</p>

					<p className="text-xs text-gray-400">
						Didn’t receive the email? Check your spam folder.
					</p>
				</div>
			</div>
		</div>
	);
}
