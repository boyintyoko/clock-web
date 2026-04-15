"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSeePassword, setIsSeePassword] = useState(false);
	const [loading, setLoading] = useState(false);

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
			<div
				className="absolute inset-0"
				style={{
					backgroundImage:
						"url(https://boyintyoko.github.io/clock-web/assets/initialValuePhoto.avif)",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

			<div
				className="
          glass-card
          relative
          w-96
          p-8
          rounded-2xl
          bg-white/80
          shadow-2xl
          flex flex-col
          gap-6
        "
			>
				<h1
					className="
            text-3xl
            font-bold
            text-center
            text-gray-900
          "
				>
					Create Account
				</h1>

				<div className="relative">
					<i
						className="
    absolute
    fa-solid fa-user
    text-gray-500
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
      bg-white
      border
      border-gray-300
      text-black
      outline-none
      focus:ring-2
      focus:ring-green-500
      transition
    "
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

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
              focus:ring-green-500
              focus:border-green-500
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
              focus:ring-green-500
              focus:border-green-500
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
					onClick={handleSignup}
					disabled={loading}
					className="
            py-3
            rounded-xl
            font-semibold
            text-white
            bg-green-500
            hover:bg-green-600
            active:scale-95
            transition
            shadow-md
            disabled:opacity-50
          "
				>
					{loading ? "Creating..." : "Create Account"}
				</button>

				<button
					onClick={() => router.push("/login")}
					className="
            text-sm
            text-center
            text-blue-500
            hover:underline
          "
				>
					Already have an account? Login
				</button>
			</div>
		</div>
	);
}
