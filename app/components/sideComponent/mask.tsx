import { Dispatch, SetStateAction } from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
	isChange: boolean;
	setIsChange: Dispatch<SetStateAction<boolean>>;
	isVisible: boolean;
	setIsVisible: Dispatch<SetStateAction<boolean>>;
};

export default function Mask({
	isChange,
	setIsChange,
	isVisible,
	setIsVisible,
}: Props) {
	const isMobile = useMediaQuery({
		query: "(max-width: 440px)",
	});

	const changeSideBar = () => {
		setIsChange(!isChange);
		if (isMobile) setIsVisible(!isVisible);
		localStorage.setItem("isSideBarChang", JSON.stringify(!isChange));
	};
	return (
		<div
			onClick={() => changeSideBar()}
			className={`absolute transition-all z-30 top-0 left-0 bg-black ${
				isChange
					? "bg-opacity-50 pointer-events-auto"
					: "bg-opacity-0 pointer-events-none"
			} h-screen`}
			style={{ width: "calc(100vw - 384px)" }}
		></div>
	);
}
