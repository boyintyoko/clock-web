"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PremiumPage() {
	const [imageUrl, setImageUrl] = useState<string>("");

	const [isPremium, setIsPremium] = useState(false);
	const [isPremiumPlus, setIsPremiumPlus] = useState(false);

	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			setImageUrl(res.data.imageUrl);
		};

		getPhoto();
	}, []);

	useEffect(() => {
		const fetchPlan = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("profiles")
				.select("is_premium,is_lifetime,subscription_status")
				.eq("id", user.id)
				.single();

			if (error) {
				console.error("plan fetch error:", error);
				return;
			}

			if (data?.is_premium && data?.subscription_status === "active") {
				setIsPremium(true);
			}

			if (data?.is_lifetime) {
				setIsPremiumPlus(true);
				setIsPremium(true); // Premium含む
			}
		};

		fetchPlan();
	}, []);

	const handleBuyPremium = async () => {
		if (isPremium || isPremiumPlus) return;

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
		if (isPremiumPlus) return;

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
			{/* Background */}
			<div
				className="absolute inset-0 scale-110 blur-sm"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>

			<div className="relative z-10 flex gap-6 flex-wrap justify-center">
				{/* Premium */}
				<div className="relative w-72">
					{(isPremium || isPremiumPlus) && (
						<div
							className="
              absolute inset-0
              bg-black/60
              backdrop-blur-sm
              rounded-2xl
              flex items-center justify-center
              z-20
              text-center
              px-4
            "
						>
							<p className="font-bold text-lg">
								{isPremiumPlus ? "Included in Premium+" : "Already Subscribed"}
							</p>
						</div>
					)}

					<div
						className="
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
							<li>&nbsp;</li>
						</ul>

						<button
							onClick={handleBuyPremium}
							disabled={isPremium || isPremiumPlus}
							className={`
                w-full py-3
                rounded-xl font-bold
                transition
                ${
									isPremium || isPremiumPlus
										? "bg-gray-500 cursor-not-allowed"
										: "bg-gray-900 hover:bg-gray-700"
								}
              `}
						>
							Start Premium
						</button>
					</div>
				</div>

				<div className="relative w-72">
					{isPremiumPlus && (
						<div
							className="
              absolute inset-0
              bg-black/60
              backdrop-blur-sm
              rounded-2xl
              flex items-center justify-center
              z-20
              text-center
              px-4
            "
						>
							<p className="font-bold text-lg">Already Purchased</p>
						</div>
					)}

					<div
						className="
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
							disabled={isPremiumPlus}
							className={`
                w-full py-3
                rounded-xl font-bold
                transition
                ${
									isPremiumPlus
										? "bg-gray-400 text-gray-200 cursor-not-allowed"
										: "bg-white text-purple-700 hover:brightness-110"
								}
              `}
						>
							Get Premium+
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
