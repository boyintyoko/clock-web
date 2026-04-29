"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PremiumPage() {
	const [imageUrl, setImageUrl] = useState<string>("");

	const [isPremium, setIsPremium] = useState(false);
	const [isLifetime, setIsLifetime] = useState(false);

	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			setImageUrl(res.data.imageUrl);
		};

		getPhoto();
	}, []);

	useEffect(() => {
		const fetchSubscription = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			console.log("user:", user);

			if (!user) return;

			const { data, error } = await supabase
				.from("profiles")
				.select("is_premium, is_lifetime, subscription_end")
				.eq("id", user.id)

				.single();

			console.log("profile data:", data);
			console.log("profile error:", error);

			if (data) {
				const now = new Date();

				if (data.subscription_end && new Date(data.subscription_end) < now) {
					setIsPremium(false);
				} else {
					setIsPremium(data.is_premium);
				}

				setIsLifetime(data.is_lifetime);
			}
		};

		fetchSubscription();
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
			<Link href="/">
				<div className="absolute top-5 left-5 z-50">
					<button
						className="
              flex items-center justify-center
              h-12 w-12
              rounded-xl
              backdrop-blur-xl
              border
              shadow-md
              transition-all duration-200
              hover:scale-105
              hover:shadow-lg
              active:scale-95
            "
					>
						<i className="fa-solid fa-angle-left text-lg"></i>
					</button>
				</div>
			</Link>

			<div
				className="absolute inset-0 scale-110 blur-sm"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>

			{/* カード */}
			<div className="relative z-10 flex gap-6 flex-wrap justify-center">
				{/* Premium */}
				<div
					className="
            relative
            w-72
            bg-white/10 backdrop-blur-md
            rounded-2xl
            p-6
            text-center
            border border-white/20
          "
				>
					{/* マスク */}
					{(isPremium || isLifetime) && (
						<div
							className="
                absolute inset-0
                bg-black/60
                backdrop-blur-sm
                rounded-2xl
                flex items-center justify-center
                text-lg font-bold
                z-10
              "
						>
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
						className="
              w-full
              py-3
              bg-gray-900
              rounded-xl
              font-bold
              transition

              hover:bg-gray-700

              disabled:opacity-40
              disabled:cursor-not-allowed
            "
					>
						Start Premium
					</button>
				</div>

				<div
					className="
            relative
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
					{isLifetime && (
						<div
							className="
                absolute inset-0
                bg-black/60
                backdrop-blur-sm
                rounded-2xl
                flex items-center justify-center
                text-lg font-bold
                z-10
              "
						>
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
						className="
              w-full
              py-3
              bg-white
              text-purple-700
              rounded-xl
              font-bold
              transition

              hover:brightness-110

              disabled:opacity-40
              disabled:cursor-not-allowed
            "
					>
						Get Premium+
					</button>
				</div>
			</div>
		</div>
	);
}
