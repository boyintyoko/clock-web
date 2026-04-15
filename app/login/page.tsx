"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSeePassword, setIsSeePassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

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
			{/* 背景 */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage:
						"url(https://images.unsplash.com/photo-1599173705513-0880f530cd3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>
			{/* 暗いフィルター */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

			<div
				className="
          relative
          w-96
          p-8
          rounded-2xl
          bg-white/80
          shadow-2xl
          glass-card
          flex flex-col
          gap-6
        "
			>
				{/* タイトル */}
				<h1 className="text-3xl font-bold text-center text-gray-900">Login</h1>

				{/* エラーメッセージ */}
				{errorMsg && (
					<div
						className="
              bg-red-100
              text-red-600
              text-sm
              p-2
              rounded-lg
              text-center
            "
					>
						{errorMsg}
					</div>
				)}

				{/* Email */}
				<div className="relative">
					<i
						className="
            absolute
            fa-solid fa-envelope
            text-gray-500
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
              bg-white
              border
              border-gray-300
              text-black
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              transition
            "
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				{/* Password */}
				<div className="relative">
					<i
						className="
            absolute
            fa-solid fa-key
            text-gray-500
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
              bg-white
              border
              border-gray-300
              text-black
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              transition
            "
						onChange={(e) => setPassword(e.target.value)}
					/>

					{/* 表示切替 */}
					<button
						type="button"
						className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-500
              hover:text-black
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
					className="
            py-3
            rounded-xl
            font-semibold
            text-white
            bg-blue-500
            hover:bg-blue-600
            active:scale-95
            transition
            shadow-md
            disabled:opacity-50
          "
				>
					{loading ? "Logging in..." : "Login"}
				</button>

				<button
					onClick={() => router.push("/signup")}
					className="
            text-sm
            text-center
            text-blue-500
            hover:underline
          "
				>
					Don't have an account? Create Account
				</button>
			</div>
		</div>
	);
}
