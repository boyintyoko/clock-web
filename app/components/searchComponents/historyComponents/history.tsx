interface Props {
	isHistoriesOpen: boolean;
	setIsHistoriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isDarkMode: boolean;
	isSideBar: boolean;
}

export default function History({
	isDarkMode,
	setIsHistoriesOpen,
	isSideBar,
}: Props) {
	return (
		<button
			onClick={() => setIsHistoriesOpen((prev) => !prev)}
			className={`
        flex items-center justify-center
        rounded-full
        ${isSideBar ? "w-9 h-9" : "w-12 h-12"}
        bg-blue-500 hover:bg-blue-600
        active:scale-95
        transition-all duration-150
    `}
		>
			<i
				className={`
          fa-solid fa-clock
      text-lg
      ${isSideBar ? (isDarkMode ? "text-white" : "text-black") : isDarkMode ? "text-black" : "text-white"}
        `}
			/>
		</button>
	);
}
