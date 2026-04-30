"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type User = {
	plan: "free" | "premium" | "premium_plus";
	subscription_end: string | null;
};

export default function PremiumPage() {
	const [imageUrl, setImageUrl] = useState("");
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				const photo = await axios.get("/api/unsplash/photo");
				setImageUrl(photo.data.imageUrl);

				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) return;

				const me = await axios.get(`/api/me?userId=${user.id}`);
				setUser(me.data);
			} catch (err) {
				console.error("me取得失敗:", err);
			}
		};

		init();
	}, []);

	const isPremium = user?.plan === "premium";
	const isLifetime = user?.plan === "premium_plus";

	const handleBuyPremium = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const res = await axios.post("/api/checkout/subscription", {
			priceId: "price_1TPiV6FxZOM1YYzW6I0b2P8O",
			userId: user.id,
		});

		if (res.data.url) {
			window.location.href = res.data.url;
		}
	};

	const handleBuyPremiumPlus = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const res = await axios.post("/api/checkout/payment", {
			priceId: "price_1TPiZxFxZOM1YYzWdmsyA0cX",
			userId: user.id,
		});

		if (res.data.url) {
			window.location.href = res.data.url;
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
			<Link href="/">
				<div className="absolute top-5 left-5 z-50">
					<button className="h-12 w-12 rounded-xl backdrop-blur-xl border shadow-md hover:scale-105 transition">
						←
					</button>
				</div>
			</Link>

			<div
				className="absolute inset-0 scale-105"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			<div className="relative z-10 flex gap-6 flex-wrap justify-center">
				<div className="relative w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
					{(isPremium || isLifetime) && (
						<div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center text-lg font-bold z-10">
							✔ Subscribed
						</div>
					)}

					<h2 className="text-2xl font-bold mb-2">Premium</h2>
					<p className="text-sm mb-4 opacity-80">$1 / month</p>

					<ul className="text-sm space-y-2 mb-6 text-left">
						<li>✔ Custom Pomodoro time</li>
						<li>✔ High-quality backgrounds</li>
						<li>&nbsp;</li>
					</ul>

					<button
						onClick={handleBuyPremium}
						disabled={isPremium || isLifetime}
						className="w-full py-3 bg-gray-900 rounded-xl font-bold hover:bg-gray-700 disabled:opacity-40"
					>
						Start Premium
					</button>
				</div>

				<div className="relative w-72 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-center shadow-2xl">
					{isLifetime && (
						<div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center text-lg font-bold z-10">
							✔ Purchased
						</div>
					)}

					<h2 className="text-2xl font-bold mb-2">Premium+</h2>
					<p className="text-sm mb-4 opacity-90">Lifetime Access</p>

					<ul className="text-sm space-y-2 mb-6 text-left">
						<li>✔ All Premium features</li>
						<li>✔ Lifetime access</li>
						<li>✔ Exclusive themes</li>
					</ul>

					<button
						onClick={handleBuyPremiumPlus}
						disabled={isLifetime}
						className="w-full py-3 bg-white text-purple-700 rounded-xl font-bold hover:brightness-110 disabled:opacity-40"
					>
						Get Premium+
					</button>
				</div>
			</div>
		</div>
	);
}
