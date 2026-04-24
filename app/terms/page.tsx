"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Terms() {
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
				<h1 className="text-3xl font-bold mb-8 text-center">
					Terms of Service
				</h1>

				<Section title="1. Acceptance of Terms">
					By accessing or using this service, you agree to be bound by these
					Terms of Service. If you do not agree with any part of these terms,
					you may not use the service.
				</Section>

				<Section title="2. Use of the Service">
					You agree to use the service only for lawful purposes and in a way
					that does not infringe the rights of others or restrict their use of
					the service.
				</Section>

				<Section title="3. Prohibited Activities">
					<ul className="list-disc pl-6 space-y-2">
						<li>Attempting unauthorized access to the system</li>
						<li>Interfering with the operation of the service</li>
						<li>Using the service for illegal activities</li>
						<li>Any activity deemed harmful by the service provider</li>
					</ul>
				</Section>

				<Section title="4. Changes to the Service">
					We reserve the right to modify or discontinue the service at any time
					without prior notice.
				</Section>

				<Section title="5. Disclaimer">
					The service is provided "as is" without warranties of any kind. We are
					not responsible for any damages resulting from the use of the service.
				</Section>

				<Section title="6. Contact">
					If you have any questions about these Terms of Service, please contact
					us through the application.
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
