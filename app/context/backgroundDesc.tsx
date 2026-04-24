"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/lib/supabase";
import type BackGroundDescType from "../types/backgroundDesc";

type BackgroundDescContextType = {
	backgroundDesc?: BackGroundDescType;

	setBackgroundDesc: (desc: BackGroundDescType) => Promise<void>;
};

const BackgroundDescContext = createContext<
	BackgroundDescContextType | undefined
>(undefined);

export const BackgroundDescProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [backgroundDesc, setBackgroundDescState] = useState<
		BackGroundDescType | undefined
	>();

	const getBackgroundDesc = async (): Promise<
		BackGroundDescType | undefined
	> => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { data, error } = await supabase
			.from("settings")
			.select("background_desc")
			.eq("user_id", user.id)
			.single();

		if (error || !data?.background_desc) return;

		return data.background_desc;
	};

	const setBackgroundDesc = async (desc: BackGroundDescType) => {
		setBackgroundDescState(desc);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		await supabase.from("settings").upsert(
			{
				user_id: user.id,
				background_desc: desc,
			},
			{
				onConflict: "user_id",
			},
		);
	};

	useEffect(() => {
		const init = async () => {
			const desc = await getBackgroundDesc();

			if (desc) {
				setBackgroundDescState(desc);
			}
		};

		init();
	}, []);

	return (
		<BackgroundDescContext.Provider
			value={{
				backgroundDesc,
				setBackgroundDesc,
			}}
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
