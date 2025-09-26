"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

interface LanguageType {
	isNowLanguage: string;
	setIsNowLanguage: (isNowLanguage: string) => void;
}

const LanguageContext = createContext<LanguageType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [isNowLanguage, setIsNowLanguage] = useState<string>("ja");

	useEffect(() => {
		const savedLanguage = localStorage.getItem("language");
		const browserLanguage = navigator.language.split("-")[0];
		const supportedLanguages = ["ja", "en", "it"];

		let language = savedLanguage || browserLanguage;

		if (!supportedLanguages.includes(language)) {
			language = "en";
		}

		localStorage.setItem("language", language);
		setIsNowLanguage(language);
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
