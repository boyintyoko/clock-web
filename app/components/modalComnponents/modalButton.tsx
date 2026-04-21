import Image from "next/image";

type Props = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	isDarkMode: boolean;
	blackImageUrl: string;
	whiteImageUrl: string;
};

export default function ModalButton({
	isOpen,
	setIsOpen,
	isDarkMode,
	blackImageUrl,
	whiteImageUrl,
}: Props) {
	return (
		<button
			className={`transition-all shadow-xl bg-opacity-50 bg-white shrink-0 h-14 w-14
            } rounded-full p-3 hover:translate-y-1`}
			onClick={() => setIsOpen(!isOpen)}
		>
			<Image
				src={`${isDarkMode ? blackImageUrl : whiteImageUrl}`}
				alt="Modal button"
				height={30}
				width={30}
			/>
		</button>
	);
}
