'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CoinIconProps {
  symbol: string;
  className?: string;
}

export default function CoinIcon({ symbol, className }: CoinIconProps) {
  const [hasError, setHasError] = useState(false);
  const cleanSymbol = symbol.replace('USDT', '').toLowerCase();

  if (hasError) {
    return (
      <div className={cn("flex items-center justify-center font-black uppercase bg-secondary/20 text-muted-foreground rounded-full", className)}>
        {symbol.charAt(0)}
      </div>
    );
  }

  return (
    <img 
      src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${cleanSymbol}.png`}
      alt={symbol}
      className={cn("object-contain rounded-full", className)}
      onError={() => setHasError(true)}
    />
  );
}
