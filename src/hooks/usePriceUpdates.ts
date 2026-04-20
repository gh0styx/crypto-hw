import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setPrice, setHistory, setLoading, setError, setMarketData } from '@/store/slices/pricesSlice';
import { fetch24hrTickers, fetchKlines } from '@/services/binance';

export const usePriceUpdates = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { symbols, selectedSymbol } = useSelector((state: RootState) => state.prices);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updatePrices = async () => {
    try {
      const data = await fetch24hrTickers(symbols);
      data.forEach((ticker: any) => {
        dispatch(setMarketData({
          symbol: ticker.symbol,
          data: {
            price: parseFloat(ticker.lastPrice),
            change24h: parseFloat(ticker.priceChangePercent)
          }
        }));
      });
    } catch (err) {
      dispatch(setError('Failed to fetch real-time prices'));
    }
  };

  const updateHistory = async () => {
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
      dispatch(setError('Failed to fetch historical data'));
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    updateHistory();
  }, [selectedSymbol]);

  useEffect(() => {
    updatePrices();
    
    intervalRef.current = setInterval(updatePrices, 10000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { updateHistory };
};
