'use client';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { executeTrade } from '@/store/slices/portfolioSlice';
import { toast } from 'sonner';
import { TradeType } from '@/types';

export function useTrading() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSymbol, currentPrices } = useSelector((state: RootState) => state.prices);
  const { balance, holdings } = useSelector((state: RootState) => state.portfolio);
  
  const [amount, setAmount] = useState<string>('');
  const [tradeType, setTradeType] = useState<TradeType>('BUY');

  const currentPrice = currentPrices[selectedSymbol] || 0;
  const currentHoldings = holdings[selectedSymbol] || 0;
  
  const total = parseFloat(amount) * currentPrice || 0;

  const handlePercentage = useCallback((percentage: number) => {
    if (tradeType === 'BUY') {
      const maxBuy = balance / currentPrice;
      setAmount((maxBuy * (percentage / 100)).toFixed(8));
    } else {
      setAmount((currentHoldings * (percentage / 100)).toFixed(8));
    }
  }, [balance, currentHoldings, currentPrice, tradeType]);

  const performTrade = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Invalid amount');
      return false;
    }

    const tradeTotal = numAmount * currentPrice;

    if (tradeType === 'BUY') {
      if (tradeTotal > balance) {
        toast.error('Insufficient USD');
        return false;
      }
    } else {
      if (numAmount > currentHoldings) {
        toast.error(`Insufficient ${selectedSymbol.replace('USDT', '')}/USDT`);
        return false;
      }
    }

    dispatch(executeTrade({
      id: Math.random().toString(36).substr(2, 9),
      symbol: selectedSymbol,
      type: tradeType,
      amount: numAmount,
      price: currentPrice,
      total: tradeTotal,
      timestamp: Date.now(),
    }));

    toast.success(`${tradeType} Success: ${numAmount} ${selectedSymbol.replace('USDT', '')}/USDT`);
    setAmount('');
    return true;
  }, [amount, currentHoldings, currentPrice, selectedSymbol, tradeType, balance, dispatch]);

  return {
    amount,
    setAmount,
    tradeType,
    setTradeType,
    currentPrice,
    currentHoldings,
    total,
    handlePercentage,
    performTrade,
    selectedSymbol,
  };
}
