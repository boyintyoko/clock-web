"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const checkUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!isMounted) return;

			if (!user) {
				router.replace("/login");
				return;
			}

			setLoading(false);
		};

		checkUser();

		return () => {
			isMounted = false;
		};
	}, [router]);

	if (loading) {
		return (
			<div className="h-screen w-full flex items-center justify-center bg-black/5 backdrop-blur-sm">
				<div className="flex flex-col items-center gap-3">
					<div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
					<p className="text-sm text-gray-600 tracking-wide">Loading...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
