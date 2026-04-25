"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
	isDarkMode: boolean;
};

export default function LogoutButton({ isDarkMode }: Props) {
	const router = useRouter();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	return (
		<button
			onClick={handleLogout}
			className={`
				flex items-center gap-2
				px-5 py-2.5
				bg-red-500/90
				text-white text-sm font-semibold
				rounded-xl
				shadow-sm
				hover:bg-red-600
				hover:shadow-md
				active:scale-95
				transition-all
				select-none
        ${!isDarkMode ? "text-gray-700" : "text-white"}
    `}
		>
			<i className="fa-solid fa-right-from-bracket"></i>
			Logout
		</button>
	);
}
