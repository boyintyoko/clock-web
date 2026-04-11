"use client";

import { useState, useEffect } from "react";

interface Props {
	setMyColors: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ChooseColorContent({ setMyColors }: Props) {
	const [color, setColor] = useState("hsl(220, 80%, 60%)");

	// HSL管理
	const [hue, setHue] = useState(220);
	const [saturation, setSaturation] = useState(80);
	const [lightness, setLightness] = useState(60);

	// HSL → color更新
	useEffect(() => {
		const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

		setColor(hsl);
	}, [hue, saturation, lightness]);

	// 🎯 ここが一番重要
	const handleAddColor = () => {
		setMyColors((prev) => {
			// 重複防止（おすすめ）
			if (prev.includes(color)) return prev;

			const updated = [...prev, color];

			localStorage.setItem("myColors", JSON.stringify(updated));

			return updated;
		});
	};

	return (
		<div className="flex flex-col gap-6 p-5">
			{/* Title */}
			<h2 className="text-lg font-semibold">Create Custom Color</h2>

			{/* Preview */}
			<div className="flex justify-center">
				<div
					className="
            w-24
            h-24
            rounded-full
            border
            shadow-inner
          "
					style={{
						background: color,
					}}
				/>
			</div>

			{/* Hue */}
			<div className="flex flex-col gap-1">
				<label className="text-sm text-neutral-600">Hue</label>

				<input
					type="range"
					min={0}
					max={360}
					value={hue}
					onChange={(e) => setHue(Number(e.target.value))}
				/>
			</div>

			{/* Saturation */}
			<div className="flex flex-col gap-1">
				<label className="text-sm text-neutral-600">Saturation</label>

				<input
					type="range"
					min={0}
					max={100}
					value={saturation}
					onChange={(e) => setSaturation(Number(e.target.value))}
				/>
			</div>

			{/* Lightness */}
			<div className="flex flex-col gap-1">
				<label className="text-sm text-neutral-600">Lightness</label>

				<input
					type="range"
					min={0}
					max={100}
					value={lightness}
					onChange={(e) => setLightness(Number(e.target.value))}
				/>
			</div>

			{/* Color Code */}
			<div
				className="
        flex
        items-center
        gap-2
        border
        rounded-lg
        p-2
        bg-neutral-50
      "
			>
				<div className="w-6 h-6 rounded" style={{ background: color }} />

				<input
					value={color}
					readOnly
					className="
            bg-transparent
            text-sm
            flex-1
            outline-none
          "
				/>
			</div>

			{/* Add Button */}
			<button
				onClick={handleAddColor}
				className="
          px-4
          py-2
          text-sm
          rounded-lg
          bg-blue-500
          text-white
          hover:bg-blue-600
        "
			>
				Add Color
			</button>
		</div>
	);
}
