"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Privacy() {
	const [imageUrl, setImageUrl] = useState<string>("");

	useEffect(() => {
		const getPhoto = async () => {
			try {
				const res = await axios.get("/api/unsplash/photo");
				setImageUrl(res.data.imageUrl);
			} catch (error) {
				console.error("Failed to fetch image:", error);
			}
		};

		getPhoto();
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${imageUrl})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>

			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

			<div
				className="
        relative
        w-full
        max-w-4xl
        max-h-[90vh]
        overflow-y-auto
        rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        shadow-2xl
        p-10
        text-white
      "
			>
				<h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>

				<Section title="1. Information We Collect">
					We may collect personal information such as your email address,
					account information, and usage data when you use our service.
				</Section>

				<Section title="2. How We Use Information">
					We use the collected information to provide, maintain, and improve our
					services, as well as to communicate with users.
				</Section>

				<Section title="3. Data Storage">
					Your data may be stored securely using third-party services such as
					authentication providers or cloud databases.
				</Section>

				<Section title="4. Third-Party Services">
					We may use third-party services to support the functionality of our
					application. These services may process your data in accordance with
					their own privacy policies.
				</Section>

				<Section title="5. Security">
					We take reasonable measures to protect your personal information from
					unauthorized access, disclosure, or destruction.
				</Section>

				<Section title="6. Changes to This Policy">
					We may update this Privacy Policy from time to time. Changes will be
					posted on this page.
				</Section>

				<Section title="7. Contact">
					If you have any questions about this Privacy Policy, please contact us
					through the application.
				</Section>
			</div>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mb-8 pb-6 border-b border-white/10 last:border-none">
			<h2
				className="
        text-lg
        font-semibold
        mb-3
        text-white
      "
			>
				{title}
			</h2>

			<div
				className="
        text-sm
        leading-relaxed
        text-white/80
      "
			>
				{children}
			</div>
		</section>
	);
}
