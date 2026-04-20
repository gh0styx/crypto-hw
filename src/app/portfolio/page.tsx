'use client';

import PortfolioSummary from '@/components/PortfolioSummary';
import TransactionHistory from '@/components/TransactionHistory';

export default function PortfolioPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-(--breakpoint-xl) mx-auto">
      <div className="space-y-6">
        <div className="bg-card border rounded-xl p-4 lg:p-6 shadow-sm">
          <PortfolioSummary />
        </div>
        <div className="bg-card border rounded-xl p-4 lg:p-6 shadow-sm">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
