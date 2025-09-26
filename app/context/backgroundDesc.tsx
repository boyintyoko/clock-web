"use client";
import {
	createContext,
	ReactNode,
	useEffect,
	useState,
	useContext,
} from "react";
import BackGroundDescType from "../types/backgroundDesc";

type BackgroundDescContextType = {
	backgroundDesc?: BackGroundDescType;
	setBackgroundDesc: (desc: BackGroundDescType) => void;
};

const BackgroundDescContext = createContext<
	BackgroundDescContextType | undefined
>(undefined);

export const BackgroundDescProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [backgroundDesc, setBackgroundDesc] = useState<BackGroundDescType>();

	useEffect(() => {
		const desc = localStorage.getItem("backgroundDescription");
		if (desc) {
			setBackgroundDesc(JSON.parse(desc));
		}
	}, []);

	return (
		<BackgroundDescContext.Provider
			value={{ backgroundDesc, setBackgroundDesc }}
		>
			{children}
		</BackgroundDescContext.Provider>
	);
};

export const useBackgroundDesc = () => {
	const context = useContext(BackgroundDescContext);
	if (!context) {
		throw new Error(
			"useBackgroundDesc must be used within a BackgroundDescProvider",
		);
	}
	return context;
};
