"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

import { supabase } from "@/lib/supabase";

type BackgroundContextType = {
	background: string;
	setBackground: (background: string) => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(
	undefined,
);

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
	const [background, setBackground] = useState<string>("");

	useEffect(() => {
		const fetchBackground = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				const { data, error } = await supabase
					.from("settings")
					.select("background")
					.eq("user_id", user.id)
					.single();

				if (!error && data?.background) {
					setBackground(data.background);
					return;
				}
			}
		};

		fetchBackground();
	}, []);

	return (
		<BackgroundContext.Provider value={{ background, setBackground }}>
			{children}
		</BackgroundContext.Provider>
	);
};

export const useBackground = () => {
	const context = useContext(BackgroundContext);

	if (!context) {
		throw new Error("useBackground must be used within a BackgroundProvider");
	}

	return context;
};
