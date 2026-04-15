"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
	const router = useRouter();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	return (
		<button
			onClick={handleLogout}
			className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
		>
			Logout
		</button>
	);
}
