import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trade, PortfolioState } from '@/types';

const initialState: PortfolioState = {
  balance: 10000,
  holdings: {},
  costBasis: {},
  history: [],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    executeTrade: (state, action: PayloadAction<Trade>) => {
      const trade = action.payload;
      const precision = 8;
      const symbol = trade.symbol;
      
      if (trade.type === 'BUY') {
        if (state.balance >= trade.total) {
          state.balance = Number((state.balance - trade.total).toFixed(4));
          const currentHolding = state.holdings[symbol] || 0;
          const currentCost = state.costBasis[symbol] || 0;
          
          state.holdings[symbol] = Number((currentHolding + trade.amount).toFixed(precision));
          state.costBasis[symbol] = Number((currentCost + trade.total).toFixed(4));
          state.history.unshift(trade);
        }
      } else {
        const currentHolding = state.holdings[symbol] || 0;
        if (currentHolding >= trade.amount) {
          state.balance = Number((state.balance + trade.total).toFixed(4));
          
          const ratio = trade.amount / currentHolding;
          const currentCost = state.costBasis[symbol] || 0;
          state.costBasis[symbol] = Number((currentCost * (1 - ratio)).toFixed(4));
          
          state.holdings[symbol] = Number((currentHolding - trade.amount).toFixed(precision));
          state.history.unshift(trade);
        }
      }
    },
    hydratePortfolio: (state, action: PayloadAction<PortfolioState>) => {
      state.balance = action.payload.balance;
      state.holdings = action.payload.holdings;
      state.costBasis = action.payload.costBasis;
      state.history = action.payload.history;
    },
    resetPortfolio: (state) => {
      state.balance = initialState.balance;
      state.holdings = { ...initialState.holdings };
      state.costBasis = { ...initialState.costBasis };
      state.history = [];
    },
  },
});

export const { executeTrade, resetPortfolio, hydratePortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
