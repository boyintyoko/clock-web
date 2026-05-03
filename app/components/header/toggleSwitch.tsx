import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
	handleSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isDarkMode: boolean;
};

export default function ToggleSwitch({
	handleSwitchChange,
	isDarkMode,
}: Props) {
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const save = async () => {
			const { data: userData } = await supabase.auth.getUser();
			const user = userData.user;

			if (!user) return;

			await supabase.from("settings").upsert({
				user_id: user.id,
				dark_mode: !isDarkMode,
			});
		};

		save();
	}, [isDarkMode]);

	return (
		<label
			htmlFor="switch"
			aria-label="Toggle dark mode"
			id="toggleMode"
			className="flex items-center cursor-pointer transition-transform hover:translate-y-1"
		>
			<input
				id="switch"
				type="checkbox"
				checked={isDarkMode}
				onChange={handleSwitchChange}
				className="sr-only"
			/>
			<div
				className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
					isDarkMode ? "bg-gray-700" : "bg-gray-300"
				}`}
			>
				<div
					className={`w-6 h-6 bg-blue-500 rounded-full shadow-md transition-transform duration-300 ${
						isDarkMode ? "translate-x-6" : "translate-x-0"
					}`}
				/>
			</div>
		</label>
	);
}
