"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Success() {
	const [imageUrl, setImageUrl] = useState<string>("");

	const searchParams = useSearchParams();
	const router = useRouter();
	const sessionId = searchParams.get("session_id");

	useEffect(() => {
		const getPhoto = async () => {
			try {
				const res = await axios.get("/api/unsplash/photo");
				setImageUrl(res.data.imageUrl);
			} catch (err) {
				console.error("Unsplash error:", err);

				setImageUrl("/default.jpg");
			}
		};

		getPhoto();
	}, []);

	// 🎯 決済後処理（最重要）
	useEffect(() => {
		const getSessionAndUpdateUser = async () => {
			if (!sessionId) return;

			try {
				const res = await axios.get(
					`/api/checkout/session?session_id=${sessionId}`,
				);

				const data = res.data;

				console.log("session data:", data);

				if (data.payment_status !== "paid") return;

				const userId = data.userId;

				if (!userId) {
					console.error("No userId found");
					return;
				}

				// 🎯 買い切り
				if (data.mode === "payment") {
					await supabase
						.from("profiles")
						.update({
							is_lifetime: true,
							is_premium: true,
						})
						.eq("id", userId);

					console.log("Lifetime premium applied");
				}

				// 🎯 サブスク
				if (data.mode === "subscription") {
					let subscriptionEndISO = null;

					// 🔥 null対策（ここが重要）
					if (data.subscription_end) {
						subscriptionEndISO = new Date(
							data.subscription_end * 1000,
						).toISOString();
					}

					await supabase
						.from("profiles")
						.update({
							subscription_status: "active",
							is_premium: true,
							subscription_end: subscriptionEndISO,
						})
						.eq("id", userId);

					console.log("Subscription premium applied");
				}
			} catch (err) {
				console.error("Error updating user:", err);
			}
		};

		getSessionAndUpdateUser();
	}, [sessionId]);

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
			{/* 背景 */}
			<div
				className="absolute inset-0 scale-110 blur-sm"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>

			<div className="absolute inset-0 bg-black/60" />

			{/* カード */}
			<div className="relative z-10 w-[90%] max-w-md rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-center">
				<div className="flex justify-center">
					<div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl">
						🎉
					</div>
				</div>

				<h1 className="text-2xl font-bold mt-4">Payment Successful</h1>

				<p className="text-sm text-gray-300 mt-1">
					Thank you for your purchase
				</p>

				<div className="flex justify-between border-b border-white/10 pb-2 mt-6">
					<span>Status</span>
					<span className="text-green-400 font-semibold">Success</span>
				</div>

				<button
					onClick={() => router.push("/")}
					className="mt-6 w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
				>
					Back to Home
				</button>
			</div>
		</div>
	);
}
