interface Props {
	isOpen: boolean;
	setIsOpen(isOpen: boolean): void;
}

export default function Mask({ isOpen, setIsOpen }: Props) {
	return (
		<div
			onClick={() => setIsOpen(!isOpen)}
			className={`absolute bg-black h-screen w-screen z-30 ${isOpen ? "opacity-50" : "opacity-0"}`}
		></div>
	);
}
