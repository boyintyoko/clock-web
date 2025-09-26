import Link from "next/link";
import Image from "next/image";
import { useBackgroundDesc } from "../../context/backgroundDesc";
import { useBackground } from "../../context/backgroundContext";

interface Props {
	isDarkMode: boolean;
}

export default function BackgroundDesc({ isDarkMode }: Props) {
	const { backgroundDesc } = useBackgroundDesc();
	const { background } = useBackground();

	return (
		<div>
			{backgroundDesc && background.startsWith("https") && (
				<Link
					href={backgroundDesc.userUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 hover:translate-y-1 transition-transform"
				>
					{backgroundDesc.userImage && (
						<Image
							src={backgroundDesc.userImage}
							alt="user image"
							width={40}
							height={40}
							className={`rounded-full border-2 ${isDarkMode ? "border-gray-700" : "border-white"}`}
						/>
					)}
					<div
						className={`${isDarkMode ? "text-gray-700" : "text-white"} text-sm leading-tight`}
					>
						<p className="font-bold">{backgroundDesc.name}</p>
						<p className="opacity-75">@{backgroundDesc.userName}</p>
					</div>
				</Link>
			)}
		</div>
	);
}
