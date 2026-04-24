"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import GoodsType from "@@/types/goodsType";

type GoodsContextType = {
	isNowGoods: GoodsType[];
	setIsNowGoods: React.Dispatch<React.SetStateAction<GoodsType[]>>;
};

const GoodsContext = createContext<GoodsContextType | undefined>(undefined);

export const GoodsProvider = ({ children }: { children: ReactNode }) => {
	const [isNowGoods, setIsNowGoods] = useState<GoodsType[]>([]);

	return (
		<GoodsContext.Provider
			value={{
				isNowGoods,
				setIsNowGoods,
			}}
		>
			{children}
		</GoodsContext.Provider>
	);
};

export const useGoods = () => {
	const context = useContext(GoodsContext);

	if (!context) {
		throw new Error("useGoods must be used within GoodsProvider");
	}

	return context;
};
