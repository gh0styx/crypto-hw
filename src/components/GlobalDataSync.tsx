"use client";

import { useEffect, useRef } from "react";
import { usePriceUpdates } from "@/hooks/usePriceUpdates";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { hydratePortfolio } from "@/store/slices/portfolioSlice";

export function GlobalDataSync({ children }: { children: React.ReactNode }) {
	usePriceUpdates();
	const dispatch = useDispatch();
	const portfolio = useSelector((state: RootState) => state.portfolio);
	const isHydrated = useRef(false);

	useEffect(() => {
		try {
			const saved = localStorage.getItem("cryptodash_portfolio");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed && typeof parsed.balance === "number") {
					dispatch(hydratePortfolio(parsed));
				}
			}
		} catch (e) {
			console.error("Failed to load portfolio from localStorage", e);
		}
		isHydrated.current = true;
	}, [dispatch]);

	useEffect(() => {
		if (isHydrated.current) {
			try {
				localStorage.setItem("cryptodash_portfolio", JSON.stringify(portfolio));
			} catch (e) {
				console.error("Failed to save portfolio to localStorage", e);
			}
		}
	}, [portfolio]);

	return <>{children}</>;
}
