"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SuccessPage() {
	const [session, setSession] = useState<any>(null);
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		const getPhoto = async () => {
			try {
				const res = await axios.get("/api/unsplash/photo");
				setImageUrl(res.data.imageUrl);
			} catch (error) {
				console.error(error);
			}
		};

		getPhoto();
	}, []);

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* 背景 */}
			<div
				className="absolute inset-0 scale-105"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

			<div className="relative z-10 w-[90%] max-w-md">
				<div
					className="
          bg-white/90
          backdrop-blur-xl
          rounded-3xl
          shadow-2xl
          p-8
          flex
          flex-col
          items-center
          text-center
          gap-5
        "
				>
					<div
						className="
            w-20 h-20
            rounded-full
            bg-green-500
            flex
            items-center
            justify-center
            text-white
            text-4xl
            shadow-lg
          "
					>
						✓
					</div>

					<h1 className="text-3xl font-bold text-gray-800">
						Payment Successful 🎉
					</h1>

					<p className="text-gray-600 text-sm leading-relaxed">
						ご購入ありがとうございます！
						<br />
						Premium機能が有効になりました。
					</p>

					{/* session情報表示（デバッグ兼確認用） */}
					{session && (
						<div className="w-full text-xs text-gray-500 break-all bg-gray-100 p-3 rounded-lg">
							<p>mode: {session.mode}</p>
							<p>email: {session.customer_email}</p>
						</div>
					)}

					<a
						href="/"
						className="
              w-full
              mt-2
              px-6
              py-3
              bg-black
              text-white
              font-semibold
              rounded-xl
              hover:scale-105
              hover:opacity-90
              transition
              duration-200
            "
					>
						ホームへ戻る
					</a>
				</div>
			</div>
		</div>
	);
}
