"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function usePortfolioStats() {
	const { balance, holdings, costBasis } = useSelector(
		(state: RootState) => state.portfolio,
	);
	const { currentPrices } = useSelector((state: RootState) => state.prices);

	const stats = useMemo(() => {
		let totalValue = balance;
		const assetStats = Object.keys(holdings).map((symbol) => {
			const amount = holdings[symbol] || 0;
			const currentPrice = currentPrices[symbol] || 0;
			const currentValue = amount * currentPrice;
			const totalSpent = costBasis[symbol] || 0;
			const pl = currentValue - totalSpent;
			const plPercentage = totalSpent > 0 ? (pl / totalSpent) * 100 : 0;

			totalValue += currentValue;

			return {
				symbol,
				amount,
				currentPrice,
				currentValue,
				totalSpent,
				pl,
				plPercentage,
			};
		});

		const totalPL = totalValue - 10000;
		const totalPLPercentage = (totalPL / 10000) * 100;

		return {
			balance,
			totalValue,
			totalPL,
			totalPLPercentage,
			assetStats,
		};
	}, [balance, holdings, costBasis, currentPrices]);

	return stats;
}
