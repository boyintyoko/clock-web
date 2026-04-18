"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSeePassword, setIsSeePassword] = useState(false);
	const [loading, setLoading] = useState(false);
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

	const handleSignup = async () => {
		setLoading(true);

		if (!username || !email || !password) {
			alert("すべて入力してください");
			setLoading(false);
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			alert("登録失敗：" + error.message);
			setLoading(false);
			return;
		}

		const user = data.user;

		if (user) {
			const { error: profileError } = await supabase.from("profiles").insert({
				id: user.id,
				username: username,
				email: email,
			});

			if (profileError) {
				alert("プロフィール保存失敗：" + profileError.message);
			}
		}

		alert("登録成功！");
		router.push("/login");

		setLoading(false);
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center">
			{/* Background */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

			{/* Card */}
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
				{/* Title */}
				<div className="text-center space-y-1">
					<h1 className="text-3xl font-bold text-white">Create Account</h1>

					<p className="text-sm text-white/70">Start your journey</p>
				</div>

				{/* Username */}
				<div className="relative">
					<i
						className="
						absolute
						fa-solid fa-user
						text-white/70
						left-3
						top-1/2
						-translate-y-1/2
					"
					/>

					<input
						type="text"
						placeholder="Username"
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
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

				{/* Email */}
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

				{/* Password */}
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
					onClick={handleSignup}
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
          ${!(password && email && username) && "bg-none"}
        `}
				>
					{loading ? "Creating..." : "Create Account"}
				</button>

				<button
					onClick={() => router.push("/login")}
					className="
					text-sm
					text-center
					text-white/80
					hover:text-white
					hover:underline
				"
				>
					Already have an account? Login
				</button>
			</div>
		</div>
	);
}
