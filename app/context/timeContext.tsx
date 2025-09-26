"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

interface TimeType {
	isNowTime: number | undefined;
	setIsNowTime: (isNowTime: number) => void;
}

const TimeContext = createContext<TimeType | undefined>(undefined);

export const TimeProvider = ({ children }: { children: ReactNode }) => {
	const [isNowTime, setIsNowTime] = useState<number>();

	useEffect(() => {
		const time = localStorage.getItem("time");
		if (!(time === "24" || time === "12")) {
			localStorage.setItem("time", "24");
			return;
		}
		setIsNowTime(Number(time));
	}, []);

	return (
		<TimeContext.Provider value={{ isNowTime, setIsNowTime }}>
			{children}
		</TimeContext.Provider>
	);
};

export const useTime = () => {
	const context = useContext(TimeContext);
	if (!context) {
		throw new Error("useTime must be used within a TimeProvider");
	}
	return context;
};
