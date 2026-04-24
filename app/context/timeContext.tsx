"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import { supabase } from "@/lib/supabase";

type TimeType = {
	isNowTime: number | undefined;
	setIsNowTime: (isNowTime: number) => void;
};

const TimeContext = createContext<TimeType | undefined>(undefined);

export const TimeProvider = ({ children }: { children: ReactNode }) => {
	const [isNowTime, setIsNowTime] = useState<number>();

	useEffect(() => {
		const getTimeFormat = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("settings")
				.select("time_format")
				.eq("user_id", user.id)
				.single();

			if (error || !data) {
				await supabase.from("settings").insert({
					user_id: user.id,
					time_format: 24,
				});

				setIsNowTime(24);
				return;
			}

			setIsNowTime(data.time_format);
		};

		getTimeFormat();
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
