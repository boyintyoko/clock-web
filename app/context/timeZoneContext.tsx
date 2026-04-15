"use client";

import {
	createContext,
	useState,
	ReactNode,
	useContext,
	useEffect,
} from "react";

import { supabase } from "@/lib/supabase";

interface TimeZoneType {
	isNowTimeZone: string;
	setIsNowTimeZone: (tz: string) => void;
}

const TimeZoneContext = createContext<TimeZoneType | undefined>(undefined);

export const TimeZoneProvider = ({ children }: { children: ReactNode }) => {
	const [isNowTimeZone, setIsNowTimeZoneState] = useState<string>("Asia/Tokyo");

	useEffect(() => {
		const fetchTimeZone = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session?.user) {
				const { data } = await supabase
					.from("settings")
					.select("timezone")
					.eq("user_id", session.user.id)
					.maybeSingle();

				if (data?.timezone) {
					setIsNowTimeZoneState(data.timezone);

					localStorage.setItem("timeZone", data.timezone);

					console.log("Supabase timezone取得:", data.timezone);

					return;
				}
			}

			const localTz = localStorage.getItem("timeZone");

			if (localTz) {
				setIsNowTimeZoneState(localTz);
				return;
			}

			const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;

			setIsNowTimeZoneState(detected);

			localStorage.setItem("timeZone", detected);
		};

		fetchTimeZone();
	}, []);

	const setIsNowTimeZone = async (tz: string) => {
		setIsNowTimeZoneState(tz);

		localStorage.setItem("timeZone", tz);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (user) {
			const { error } = await supabase.from("settings").upsert(
				{
					user_id: user.id,
					timezone: tz,
				},
				{
					onConflict: "user_id",
				},
			);

			if (error) {
				console.error("timezone保存失敗:", error);
			} else {
				console.log("timezone保存成功");
			}
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
