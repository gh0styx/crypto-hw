import portfolioReducer, {
	executeTrade,
} from "../store/slices/portfolioSlice";

describe("portfolioSlice reducer", () => {
	const initialState = {
		balance: 10000,
		holdings: {
			BTCUSDT: 0,
			ETHUSDT: 0,
		},
		costBasis: {},
		history: [],
	};

	test("should handle BUY trade correctly", () => {
		const trade = {
			id: "1",
			symbol: "BTCUSDT",
			type: "BUY" as const,
			amount: 0.1,
			price: 50000,
			total: 5000,
			timestamp: Date.now(),
		};

		const nextState = portfolioReducer(initialState, executeTrade(trade));

		expect(nextState.balance).toBe(5000);
		expect(nextState.holdings["BTCUSDT"]).toBe(0.1);
		expect(nextState.history).toHaveLength(1);
		expect(nextState.history[0]).toEqual(trade);
	});

	test("should not handle BUY trade if insufficient balance", () => {
		const trade = {
			id: "1",
			symbol: "BTCUSDT",
			type: "BUY" as const,
			amount: 1,
			price: 50000,
			total: 50000,
			timestamp: Date.now(),
		};

		const nextState = portfolioReducer(initialState, executeTrade(trade));

		expect(nextState.balance).toBe(10000);
		expect(nextState.holdings["BTCUSDT"]).toBe(0);
		expect(nextState.history).toHaveLength(0);
	});

	test("should handle SELL trade correctly", () => {
		const stateWithHoldings = {
			...initialState,
			balance: 5000,
			holdings: { ...initialState.holdings, BTCUSDT: 0.1 },
		};

		const trade = {
			id: "2",
			symbol: "BTCUSDT",
			type: "SELL" as const,
			amount: 0.05,
			price: 60000,
			total: 3000,
			timestamp: Date.now(),
		};

		const nextState = portfolioReducer(stateWithHoldings, executeTrade(trade));

		expect(nextState.balance).toBe(8000);
		expect(nextState.holdings["BTCUSDT"]).toBe(0.05);
		expect(nextState.history).toHaveLength(1);
	});

	test("should not handle SELL trade if insufficient holdings", () => {
		const trade = {
			id: "2",
			symbol: "BTCUSDT",
			type: "SELL" as const,
			amount: 0.1,
			price: 60000,
			total: 6000,
			timestamp: Date.now(),
		};

		const nextState = portfolioReducer(initialState, executeTrade(trade));

		expect(nextState.balance).toBe(10000);
		expect(nextState.holdings["BTCUSDT"]).toBe(0);
		expect(nextState.history).toHaveLength(0);
	});
});
