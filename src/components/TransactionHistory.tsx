'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionHistory() {
  const { history } = useSelector((state: RootState) => state.portfolio);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          History
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary border-none h-12">
                <TableHead className="text-xs lg:text-sm font-bold uppercase tracking-widest pl-6 text-white">Activity</TableHead>
                <TableHead className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white">Asset</TableHead>
                <TableHead className="text-right text-xs lg:text-sm font-bold uppercase tracking-widest pr-6 text-white">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.slice(0, 10).map((trade) => (
                <TableRow key={trade.id} className="hover:bg-primary/5 transition-colors border-border/50 h-16 group">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      {trade.type === 'BUY' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-500" />
                      )}
                      <span className={cn(
                        "text-xs font-black uppercase tracking-wider",
                        trade.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'
                      )}>
                        {trade.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-base tracking-tight">{trade.symbol.replace('USDT', '')}/USDT</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {trade.amount.toFixed(4)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-black text-lg">${trade.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground text-xs italic">
                    No activity found.
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
