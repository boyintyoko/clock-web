"use client";

import { useEffect, useState } from "react";
import LoadingSecondHand from "@@/components/loading/loadingSecondHand";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { supabase } from "@/lib/supabase";

export default function LoadingScreen() {
	const [isLoading, setIsLoading] = useState(true);

	const [visible, setVisible] = useState(true);

	const [enableTransition, setEnableTransition] = useState(false);

	const [username, setUsername] = useState("");
	const [showWelcome, setShowWelcome] = useState(false);

	useEffect(() => {
		const init = async () => {
			try {
				setVisible(true);

				requestAnimationFrame(() => {
					setEnableTransition(true);
				});

				const isFirstVisit = localStorage.getItem("hasVisited") !== "true";

				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (user) {
					const { data } = await supabase
						.from("profiles")
						.select("username")
						.eq("id", user.id)
						.single();

					if (data?.username) {
						setUsername(data.username);

						setTimeout(() => {
							setShowWelcome(true);
						}, 300);
					}
				}

				setTimeout(() => {
					if (isFirstVisit) {
						const driverObj = driver({
							showProgress: true,
							steps: [
								{
									element: "#toggleMode",
									popover: {
										title: "Theme",
										description: "Switch light / dark mode.",
									},
								},
							],
						});

						driverObj.drive();

						localStorage.setItem("hasVisited", "true");
					}
				}, 1500);

				setTimeout(() => {
					setVisible(false);
				}, 1500);
				setTimeout(() => {
					setIsLoading(false);
				}, 2300);
			} catch (error) {
				console.error(error);

				setVisible(false);

				setTimeout(() => {
					setIsLoading(false);
				}, 800);
			}
		};

		init();
	}, []);

	if (!isLoading) return null;

	return (
		<div
			className={`
      fixed inset-0
      flex items-center justify-center

      bg-gradient-to-br
      from-zinc-900
      via-black
      to-zinc-800

      z-20

      ${enableTransition ? "transition-opacity duration-700" : ""}

      ${visible ? "opacity-100" : "opacity-0"}
      `}
			style={{ zIndex: 500 }}
		>
			<div className="absolute inset-0 backdrop-blur-2xl bg-white/5" />

			<div
				className="
        relative
        flex items-center justify-center

        w-[320px]
        h-[320px]

        rounded-full

        bg-white/10
        backdrop-blur-xl

        border border-white/20

        shadow-[0_0_60px_rgba(255,255,255,0.08)]
        "
			>
				{username && (
					<div
						className={`
            absolute
            text-xl
            -top-32
            font-semibold
            text-white/80

            transition-all
            duration-700

            ${
							showWelcome
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-4"
						}
            `}
					>
						Welcome back,
						<span className="ml-2 text-white font-bold">{username}</span>
					</div>
				)}

				<LoadingSecondHand />
			</div>

			<div
				className="
        absolute
        bottom-12
        text-white/40
        text-sm
        tracking-widest
        "
			>
				Loading your workspace...
			</div>
		</div>
	);
}
