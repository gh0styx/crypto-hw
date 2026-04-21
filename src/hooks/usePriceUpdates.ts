import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
	setHistory,
	setLoading,
	setError,
	setMarketData,
} from "@/store/slices/pricesSlice";
import {
	fetch24hrTickers,
	fetchKlines,
	Binance24hrTicker,
} from "@/services/binance";

export const usePriceUpdates = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { symbols, selectedSymbol } = useSelector(
		(state: RootState) => state.prices,
	);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const updatePrices = useCallback(async () => {
		try {
			const data = await fetch24hrTickers(symbols);
			data.forEach((ticker: Binance24hrTicker) => {
				dispatch(
					setMarketData({
						symbol: ticker.symbol,
						data: {
							price: parseFloat(ticker.lastPrice),
							change24h: parseFloat(ticker.priceChangePercent),
						},
					}),
				);
			});
		} catch (err) {
			console.error(err);
			dispatch(setError("Failed to fetch real-time prices"));
		}
	}, [dispatch, symbols]);

	const updateHistory = useCallback(async () => {
		try {
			dispatch(setLoading(true));
			const klines = await fetchKlines(selectedSymbol);
			const history = klines.map((k) => ({
				timestamp: k.time,
				price: k.close,
			}));
			dispatch(setHistory({ symbol: selectedSymbol, history }));
			dispatch(setLoading(false));
		} catch (err) {
			console.error(err);
			dispatch(setError("Failed to fetch historical data"));
			dispatch(setLoading(false));
		}
	}, [dispatch, selectedSymbol]);

	useEffect(() => {
		updateHistory();
	}, [updateHistory]);

	useEffect(() => {
		updatePrices();

		intervalRef.current = setInterval(updatePrices, 10000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [updatePrices]);

	return { updateHistory };
};
