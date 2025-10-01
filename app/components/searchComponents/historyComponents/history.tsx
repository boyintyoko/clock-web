import Image from "next/image";

interface Props {
	isHistoriesOpen: boolean;
	setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function History({
	isHistoriesOpen,
	setIsHistoriesOpen,
}: Props) {
	return (
		<div>
			<button
				onClick={() => setIsHistoriesOpen(!isHistoriesOpen)}
				className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
			>
				<Image
					src="https://boyintyoko.github.io/clock-web/icons/history.png"
					alt="Youtube icon"
					height={20}
					width={20}
					loading="lazy"
				/>
			</button>
		</div>
	);
}
