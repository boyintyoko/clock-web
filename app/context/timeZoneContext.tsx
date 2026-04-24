"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import { supabase } from "@/lib/supabase";

type TimeZoneType = {
	isNowTimeZone: string;
	setIsNowTimeZone: (tz: string) => void;
};

const TimeZoneContext = createContext<TimeZoneType | undefined>(undefined);

export const TimeZoneProvider = ({ children }: { children: ReactNode }) => {
	const [isNowTimeZone, setIsNowTimeZoneState] = useState<string>("Asia/Tokyo");

	useEffect(() => {
		const fetchTimeZone = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session?.user) return;

			const userId = session.user.id;

			const { data } = await supabase
				.from("settings")
				.select("timezone")
				.eq("user_id", userId)
				.maybeSingle();

			if (data?.timezone) {
				setIsNowTimeZoneState(data.timezone);
				return;
			}

			const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;

			await supabase
				.from("settings")
				.update({ timezone: detected })
				.eq("user_id", userId);

			setIsNowTimeZoneState(detected);
		};

		fetchTimeZone();
	}, []);

	const setIsNowTimeZone = async (tz: string) => {
		setIsNowTimeZoneState(tz);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (user) {
			await supabase.from("settings").upsert(
				{
					user_id: user.id,
					timezone: tz,
				},
				{
					onConflict: "user_id",
				},
			);
		}
	};

	return (
		<TimeZoneContext.Provider
			value={{
				isNowTimeZone,
				setIsNowTimeZone,
			}}
		>
			{children}
		</TimeZoneContext.Provider>
	);
};

export const useTimeZone = () => {
	const context = useContext(TimeZoneContext);

	if (!context) {
		throw new Error("useTimeZone must be used within a TimeZoneProvider");
	}

	return context;
};
