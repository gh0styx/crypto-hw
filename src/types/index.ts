export type TradeType = 'BUY' | 'SELL';

export interface Trade {
  id: string;
  symbol: string;
  type: TradeType;
  amount: number;
  price: number;
  total: number;
  timestamp: number;
  costBasis?: number;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

export interface MarketData {
  price: number;
  change24h: number;
}

export interface PricesState {
  symbols: string[];
  currentPrices: Record<string, number>;
  marketData: Record<string, MarketData>;
  history: Record<string, PriceHistory[]>;
  selectedSymbol: string;
  loading: boolean;
  error: string | null;
}

export interface PortfolioState {
  balance: number;
  holdings: Record<string, number>;
  costBasis: Record<string, number>;
  history: Trade[];
}
