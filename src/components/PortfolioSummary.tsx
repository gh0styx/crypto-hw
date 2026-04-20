'use client';

import { usePortfolioStats } from '@/hooks/usePortfolioStats';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import CoinIcon from './CoinIcon';

export default function PortfolioSummary() {
  const { 
    balance, 
    totalValue, 
    totalPL, 
    totalPLPercentage, 
    assetStats 
  } = usePortfolioStats();

  const activeHoldings = assetStats.filter(a => a.amount > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Portfolio Performance
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Net Worth</p>
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black font-mono tracking-tighter">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className={cn(
              "flex items-center gap-1.5 text-sm font-bold px-2 py-1 rounded-md mt-1",
              totalPL >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
            )}>
              {totalPL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {totalPL >= 0 ? '+' : ''}${Math.abs(totalPL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
              ({totalPLPercentage.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary border-none h-12">
                <TableHead className="text-xs lg:text-sm font-bold uppercase tracking-widest pl-6 text-white">Asset</TableHead>
                <TableHead className="text-right text-xs lg:text-sm font-bold uppercase tracking-widest text-white">Price</TableHead>
                <TableHead className="text-right text-xs lg:text-sm font-bold uppercase tracking-widest pr-6 text-white">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-primary/5 transition-colors border-border/50 h-16">
                <TableCell className="pl-6 font-bold text-base">USD Cash</TableCell>
                <TableCell className="text-right text-muted-foreground font-mono font-medium text-sm">$1.00</TableCell>
                <TableCell className="text-right pr-6 font-mono font-black text-lg">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
              {activeHoldings.map((asset) => (
                <TableRow key={asset.symbol} className="hover:bg-primary/5 transition-colors border-border/50 h-16 group">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-4">
                      <CoinIcon symbol={asset.symbol} className="w-10 h-10 shadow-sm" />
                      <div className="flex flex-col">
                        <span className="font-bold text-base tracking-tight">{asset.symbol.replace('USDT', '')}</span>
                        <span className="text-xs text-muted-foreground font-medium font-mono">{asset.amount.toFixed(4)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-sm text-muted-foreground">
                    ${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-black text-lg">${asset.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className={cn(
                        "text-xs font-mono font-bold mt-0.5",
                        asset.pl >= 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {asset.pl >= 0 ? '+' : '-'}${Math.abs(asset.pl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {activeHoldings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12 text-muted-foreground font-medium text-sm">
                    No crypto holdings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
