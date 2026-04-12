"use client";

import { BackgroundProvider } from "./context/backgroundContext";
import { GoodsProvider } from "./context/goodContext";
import { LanguageProvider } from "./context/languageContext";
import { TimeProvider } from "./context/timeContext";
import { TimeZoneProvider } from "./context/timeZoneContext";
import { BackgroundDescProvider } from "./context/backgroundDesc";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<BackgroundDescProvider>
			<TimeZoneProvider>
				<TimeProvider>
					<LanguageProvider>
						<BackgroundProvider>
							<GoodsProvider>{children}</GoodsProvider>
						</BackgroundProvider>
					</LanguageProvider>
				</TimeProvider>
			</TimeZoneProvider>
		</BackgroundDescProvider>
	);
}
