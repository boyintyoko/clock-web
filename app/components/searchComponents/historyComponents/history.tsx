interface Props {
	isHistoriesOpen: boolean;
	setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isDarkMode: boolean;
}

export default function History({ isDarkMode, setIsHistoriesOpen }: Props) {
	return (
		<button
			onClick={() => setIsHistoriesOpen((prev) => !prev)}
			className="
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-blue-500 hover:bg-blue-600
        active:scale-95
        transition-all duration-150
      "
		>
			<i
				className={`
          fa-solid fa-clock
          text-lg
          ${isDarkMode ? "text-black" : "text-white"}
        `}
			/>
		</button>
	);
}
