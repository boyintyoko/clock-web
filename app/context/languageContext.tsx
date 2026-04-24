"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/lib/supabase";

type LanguageType = {
	isNowLanguage: string;
	setIsNowLanguage: (isNowLanguage: string) => void;
};

const LanguageContext = createContext<LanguageType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [isNowLanguage, setIsNowLanguage] = useState<string>("ja");

	const getUserLanguage = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) return;

		const { data } = await supabase
			.from("settings")
			.select("language")
			.eq("user_id", session.user.id)
			.single();

		return data?.language;
	};

	useEffect(() => {
		const settinLanguage = async () => {
			const savedLanguage = await getUserLanguage();
			const browserLanguage = navigator.language.split("-")[0];
			const supportedLanguages = ["ja", "en", "it"];

			let language = savedLanguage || browserLanguage;

			if (!supportedLanguages.includes(language)) {
				language = "en";
			}

			setIsNowLanguage(language);
		};
		settinLanguage();
	}, []);

	return (
		<LanguageContext.Provider value={{ isNowLanguage, setIsNowLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};
