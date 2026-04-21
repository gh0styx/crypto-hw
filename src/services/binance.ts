const BASE_URL =
	process.env.NEXT_PUBLIC_BINANCE_API_URL || "https://api.binance.com/api/v3";

export interface BinanceTicker {
	symbol: string;
	price: string;
}

export interface KlineData {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
}

export const fetchTicker = async (symbol: string): Promise<number> => {
	try {
		const response = await fetch(`${BASE_URL}/ticker/price?symbol=${symbol}`);
		if (!response.ok) throw new Error("API request failed");
		const data: BinanceTicker = await response.json();
		return parseFloat(data.price);
	} catch (error) {
		console.error("Error fetching ticker:", error);
		throw error;
	}
};

export interface Binance24hrTicker {
	symbol: string;
	lastPrice: string;
	priceChangePercent: string;
	[key: string]: string | number;
}

export const fetch24hrTickers = async (
	symbols: string[],
): Promise<Binance24hrTicker[]> => {
	try {
		const response = await fetch(
			`${BASE_URL}/ticker/24hr?symbols=${JSON.stringify(symbols)}`,
		);
		if (!response.ok) throw new Error("API request failed");
		return await response.json();
	} catch (error) {
		console.error("Error fetching 24hr tickers:", error);
		throw error;
	}
};

export const fetchKlines = async (
	symbol: string,
	interval: string = "1h",
	limit: number = 24,
): Promise<KlineData[]> => {
	try {
		const response = await fetch(
			`${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
		);
		if (!response.ok) throw new Error("API request failed");
		const data = await response.json();

		return data.map((d: (string | number)[]) => ({
			time: d[0] as number,
			open: Number(d[1]),
			high: Number(d[2]),
			low: Number(d[3]),
			close: Number(d[4]),
		}));
	} catch (error) {
		console.error("Error fetching klines:", error);
		throw error;
	}
};
