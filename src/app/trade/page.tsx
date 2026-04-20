'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import dynamic from 'next/dynamic';
import { usePortfolioStats } from '@/hooks/usePortfolioStats';
import { Button } from '@/components/ui/button';
import TradeModal from '@/components/TradeModal';
import TransactionHistoryLite from '@/components/TransactionHistoryLite';
import CoinIcon from '@/components/CoinIcon';

const PriceChart = dynamic(() => import('@/components/PriceChart'), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-xl" />
});

export default function TradePage() {
  const { selectedSymbol, currentPrices } = useSelector((state: RootState) => state.prices);
  const { assetStats } = usePortfolioStats();
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  const currentPrice = currentPrices[selectedSymbol] || 0;
  
  const assetStat = assetStats.find(a => a.symbol === selectedSymbol);
  const pnl = assetStat ? assetStat.pl : 0;
  const isPositive = pnl >= 0;
  const cryptoAmount = assetStat ? assetStat.amount : 0;
  const rawSymbol = selectedSymbol.replace('USDT', '');

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] w-full bg-white">
      
      {/* ======================= */}
      {/* LEFT COLUMN (MAIN CHART)*/}
      {/* ======================= */}
      <div className="flex-1 flex flex-col relative w-full lg:border-r border-border pb-8 lg:pb-0">
        
        {/* Header */}
        <div className="px-6 lg:px-12 pt-8 lg:pt-10 pb-4 flex justify-between items-center">
          <div className="text-primary font-bold">
            <CoinIcon symbol={selectedSymbol} className="w-10 h-10 lg:w-12 lg:h-12" />
          </div>
          <div className="text-right">
            <span className="text-xs lg:text-sm text-muted-foreground font-medium block uppercase tracking-wider">Available</span>
            <span className="text-sm lg:text-lg font-bold text-foreground">
              {cryptoAmount > 0 ? cryptoAmount.toFixed(8) : '0.00000000'} {rawSymbol}
            </span>
            <div className="text-[10px] lg:text-xs text-muted-foreground font-bold mt-0.5">
              {(cryptoAmount * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })} $
            </div>
          </div>
        </div>

        {/* Center Price Info */}
        <div className="text-center mt-6 lg:mt-12 space-y-2 lg:space-y-4 z-10 px-6">
          <h2 className="text-xl lg:text-3xl font-medium tracking-widest text-foreground opacity-80">{rawSymbol}</h2>
          <div className="text-5xl lg:text-7xl font-light tracking-tighter text-foreground">
            {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
          </div>
          <div className={`text-sm lg:text-lg font-bold px-3 py-1 bg-opacity-10 rounded-full inline-block ${isPositive ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
            PnL: {isPositive ? '+' : ''}{pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })} $
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 w-full mt-4 lg:mt-10 relative px-2 lg:px-10">
          <PriceChart />
        </div>

        {/* On Mobile Only: Trade Button anchors below chart before history */}
        <div className="px-6 z-20 mt-8 mb-4 lg:hidden">
          <Button 
            onClick={() => setIsTradeModalOpen(true)}
            className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-lg font-bold tracking-wide shadow-lg active:scale-95 transition-all"
          >
            Trade
          </Button>
        </div>
      </div>

      {/* ======================= */}
      {/* RIGHT COLUMN (SIDEBAR) */}
      {/* ======================= */}
      <div className="w-full lg:w-[450px] flex flex-col bg-muted lg:bg-white shrink-0">
        
        {/* Desktop Only: Huge Trade Button isolated at top of sidebar */}
        <div className="hidden lg:block p-10 border-b border-border bg-white sticky top-0 z-10">
            <Button 
            onClick={() => setIsTradeModalOpen(true)}
            className="w-full h-20 bg-secondary hover:bg-secondary/90 text-white rounded-2xl text-2xl font-bold tracking-widest shadow-xl active:scale-95 transition-all"
          >
            EXECUTE TRADE
          </Button>
        </div>

        {/* History List Section */}
        <div className="flex-1 lg:bg-muted/30 px-6 lg:px-10 py-8 lg:py-10 h-80 lg:h-auto overflow-y-auto w-full">
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-6 opacity-60">
            Recent Transactions
          </div>
          <TransactionHistoryLite symbol={selectedSymbol} />
        </div>
      </div>

      <TradeModal 
        isOpen={isTradeModalOpen} 
        onClose={() => setIsTradeModalOpen(false)} 
      />
    </div>
  );
}
