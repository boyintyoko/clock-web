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

			setLoading(false);

			if (!user) {
				router.replace("/login");
			}
		};

		checkUser();

		return () => {
			isMounted = false;
		};
	}, [router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
