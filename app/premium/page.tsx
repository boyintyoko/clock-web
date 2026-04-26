"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PremiumPage() {
	const [imageUrl, setImageUrl] = useState<string>("");

	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			setImageUrl(res.data.imageUrl);
		};

		getPhoto();
	}, []);

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
			<div
				className="absolute inset-0 scale-110 blur-sm"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			<div className="relative z-10 flex gap-6 flex-wrap justify-center">
				<div
					className="
          w-72
          bg-white/10 backdrop-blur-md
          rounded-2xl
          p-6
          text-center
          border border-white/20
        "
				>
					<h2 className="text-2xl font-bold mb-2">Premium</h2>

					<p className="text-sm mb-4 opacity-80">$1 / month</p>

					<ul className="text-sm space-y-2 mb-6 text-left">
						<li>✔ Custom Pomodoro time</li>
						<li>✔ High-quality backgrounds</li>
						<li>✔ No ads</li>
					</ul>

					<button
						onClick={handleBuyPremium}
						className="
              w-full
              py-3
              bg-gray-900
              rounded-xl
              font-bold
              hover:bg-gray-700
              transition
            "
					>
						Start Premium
					</button>
				</div>

				{/* Premium+ */}
				<div
					className="
          w-72
          bg-gradient-to-br
          from-indigo-500
          to-purple-600
          rounded-2xl
          p-6
          text-center
          shadow-2xl
        "
				>
					<h2 className="text-2xl font-bold mb-2">Premium+</h2>

					<p className="text-sm mb-4 opacity-90">Lifetime Access</p>

					<ul className="text-sm space-y-2 mb-6 text-left">
						<li>✔ All Premium features</li>
						<li>✔ Lifetime access</li>
						<li>✔ Exclusive themes</li>
					</ul>

					<button
						onClick={handleBuyPremiumPlus}
						className="
              w-full
              py-3
              bg-white
              text-purple-700
              rounded-xl
              font-bold
              hover:brightness-110
              transition
            "
					>
						Get Premium+
					</button>
				</div>
			</div>
		</div>
	);
}
