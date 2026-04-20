'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useState, useEffect, useMemo } from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  YAxis,
  ReferenceLine
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function PriceChart() {
  const [isMounted, setIsMounted] = useState(false);
  const { history, selectedSymbol, loading, marketData } = useSelector((state: RootState) => state.prices);
  
  const data = history[selectedSymbol] || [];
  
  // Calculate a simulated "previous close" from data or default it for the reference line
  const prevClose = useMemo(() => {
    if (data.length > 0) {
      return data[0].price; // Use earliest data point as previous close for 24h view
    }
    return 0;
  }, [data]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || (loading && data.length === 0)) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-none opacity-20" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-lg shadow-sm">
          <p className="text-sm font-mono font-bold text-foreground">
            {payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              {/* Very specific light teal gradient mapping */}
              <stop offset="0%" stopColor="#15A09A" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#15A09A" stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#15A09A', fontSize: 10, fontWeight: 700 }}
            tickFormatter={(val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            width={50}
            dx={4}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {prevClose > 0 && (
            <ReferenceLine 
              y={prevClose} 
              stroke="#15A09A" 
              strokeDasharray="3 3" 
              strokeOpacity={0.4}
            />
          )}

          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#15A09A" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1000}
            activeDot={{ r: 4, fill: '#15A09A', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
