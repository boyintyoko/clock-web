"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSeePassword, setIsSeePassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		const getPhoto = async () => {
			const res = await axios.get("/api/unsplash/photo");
			const data = res.data;
			setImageUrl(data.imageUrl);
		};
		getPhoto();
	}, []);

	useEffect(() => {
		checkUser();
	}, []);

	const checkUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (user) {
			router.push("/");
		}
	};

	const handleLogin = async () => {
		setLoading(true);
		setErrorMsg("");

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setErrorMsg(error.message);
		} else {
			router.push("/");
		}

		setLoading(false);
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

			<div
				className="
				relative
				w-[380px]
				p-8
				rounded-2xl
				bg-white/10
				backdrop-blur-xl
				border border-white/20
				shadow-2xl
				flex flex-col
				gap-5
			"
			>
				<div className="text-center space-y-1">
					<h1 className="text-3xl font-bold text-white">Welcome Back</h1>

					<p className="text-sm text-white/70">Login to continue</p>
				</div>

				{errorMsg && (
					<div
						className="
						bg-red-500/20
						text-red-300
						text-sm
						p-2
						rounded-lg
						text-center
						border border-red-400/30
					"
					>
						{errorMsg}
					</div>
				)}

				<div className="relative">
					<i
						className="
						absolute
						fa-solid fa-envelope
						text-white/70
						left-3
						top-1/2
						-translate-y-1/2
					"
					/>

					<input
						type="email"
						placeholder="Email address"
						className="
						w-full
						pl-10
						pr-3
						py-3
						rounded-xl
						bg-white/20
						text-white
						placeholder-white/60
						border border-white/20
						outline-none
						focus:border-blue-400
						focus:ring-2
						focus:ring-blue-400/40
						transition
					"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="relative">
					<i
						className="
						absolute
						fa-solid fa-key
						text-white/70
						left-3
						top-1/2
						-translate-y-1/2
					"
					/>

					<input
						type={isSeePassword ? "text" : "password"}
						placeholder="Password"
						className="
						w-full
						pl-10
						pr-10
						py-3
						rounded-xl
						bg-white/20
						text-white
						placeholder-white/60
						border border-white/20
						outline-none
						focus:border-blue-400
						focus:ring-2
						focus:ring-blue-400/40
						transition
					"
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						type="button"
						className="
						absolute
						right-3
						top-1/2
						-translate-y-1/2
						text-white/70
						hover:text-white
					"
						onClick={() => setIsSeePassword(!isSeePassword)}
					>
						{isSeePassword ? (
							<i className="fa-solid fa-eye" />
						) : (
							<i className="fa-solid fa-eye-slash" />
						)}
					</button>
				</div>

				<button
					onClick={handleLogin}
					disabled={loading}
					className={`
					mt-2
					py-3
					rounded-xl
					font-semibold
					text-white
					bg-gradient-to-r
					from-blue-500
					to-blue-600
					hover:from-blue-600
					hover:to-blue-700
					active:scale-95
					transition
					shadow-lg
					disabled:opacity-50
          ${!(password && email) && "bg-none"}
          `}
				>
					{loading ? "Logging in..." : "Login"}
				</button>

				<button
					onClick={() => router.push("/signup")}
					className="
					text-sm
					text-center
					text-white/80
					hover:text-white
					hover:underline
				"
				>
					Don't have an account? Create Account
				</button>
			</div>
		</div>
	);
}
