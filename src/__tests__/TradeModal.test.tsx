import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from '../store/slices/portfolioSlice';
import pricesReducer from '../store/slices/pricesSlice';
import TradeModal from '../components/TradeModal';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const createMockStore = () => configureStore({
  reducer: {
    portfolio: portfolioReducer,
    prices: pricesReducer,
  },
  preloadedState: {
    prices: {
      symbols: ['BTCUSDT'],
      currentPrices: { BTCUSDT: 50000 },
      history: {},
      selectedSymbol: 'BTCUSDT',
      loading: false,
      error: null,
    },
    portfolio: {
      balance: 10000,
      holdings: { BTCUSDT: 0 },
      costBasis: { BTCUSDT: 0 },
      history: [],
    }
  }
});

describe('TradeModal Component', () => {
  test('renders trade interface', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <TradeModal isOpen={true} onClose={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText(/Buy/i)).toBeInTheDocument();
  });

  test('updates amount on input change', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <TradeModal isOpen={true} onClose={jest.fn()} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('0.00000000') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0.1' } });
    expect(input.value).toBe('0.1');
  });
});
