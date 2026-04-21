"use client";

import { createPortal } from "react-dom";

type Props = {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	title: string;
	children: React.ReactNode;
};

export default function Modal({ isOpen, setIsOpen, title, children }: Props) {
	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 z-[999] flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={() => setIsOpen(false)}
			/>

			<div className="relative z-10 bg-white rounded-xl p-6 w-96 shadow-xl h-96 w-96 overflow-auto">
				<h2 className="font-bold text-lg mb-4">{title}</h2>

				{children}
			</div>
		</div>,
		document.body,
	);
}
