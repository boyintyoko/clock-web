"use client";
import GoodsType from "../types/goodsType";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

interface GoodsContextType {
	isNowGoods: GoodsType[];
	setIsNowGoods: (isNowGoods: GoodsType[]) => void;
}

const GoodsContext = createContext<GoodsContextType | undefined>(undefined);

export const GoodsProvider = ({ children }: { children: ReactNode }) => {
	const [isNowGoods, setIsNowGoods] = useState<GoodsType[]>([]);

	useEffect(() => {
		const goods = localStorage.getItem("goods");
		if (!goods) return;
		setIsNowGoods(JSON.parse(goods));
	}, []);

	return (
		<GoodsContext.Provider value={{ isNowGoods, setIsNowGoods }}>
			{children}
		</GoodsContext.Provider>
	);
};

export const useGoods = () => {
	const context = useContext(GoodsContext);
	if (!context) {
		throw new Error("useGoods must be used within a GoodsProvider");
	}
	return context;
};
