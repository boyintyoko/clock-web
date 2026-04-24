"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkUser();
	}, []);

	const checkUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			router.push("/login");
		} else {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
