import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PriceHistory, PricesState, MarketData } from '@/types';

const initialState: PricesState = {
  symbols: [
    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 
    'ADAUSDT', 'AVAXUSDT', 'DOGEUSDT', 'LTCUSDT', 'LINKUSDT', 
    'MATICUSDT', 'DOTUSDT', 'TRXUSDT', 'BCHUSDT', 'ATOMUSDT', 
    'XLMUSDT', 'ALGOUSDT', 'NEARUSDT', 'FILUSDT', 'VETUSDT'
  ],
  currentPrices: {},
  marketData: {},
  history: {},
  selectedSymbol: 'BTCUSDT',
  loading: false,
  error: null,
};

const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    setPrice: (state, action: PayloadAction<{ symbol: string; price: number }>) => {
      state.currentPrices[action.payload.symbol] = action.payload.price;
    },
    setMarketData: (state, action: PayloadAction<{ symbol: string; data: MarketData }>) => {
      state.marketData[action.payload.symbol] = action.payload.data;
      state.currentPrices[action.payload.symbol] = action.payload.data.price;
    },
    setHistory: (state, action: PayloadAction<{ symbol: string; history: PriceHistory[] }>) => {
      state.history[action.payload.symbol] = action.payload.history;
    },
    setSelectedSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPrice, setMarketData, setHistory, setSelectedSymbol, setLoading, setError } = pricesSlice.actions;
export default pricesSlice.reducer;
