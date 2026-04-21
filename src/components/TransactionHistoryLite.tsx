"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function TransactionHistoryLite({ symbol }: { symbol: string }) {
	const { history } = useSelector((state: RootState) => state.portfolio);

	const symbolHistory = history
		.filter((t) => t.symbol === symbol)
		.sort((a, b) => b.timestamp - a.timestamp);

	const rawSymbol = symbol.replace("USDT", "");

	return (
		<div className="flex flex-col gap-3">
			{symbolHistory.length === 0 ? (
				<div className="text-center text-sm text-muted-foreground italic py-10">
					No transactions found for {rawSymbol}
				</div>
			) : (
				symbolHistory.map((t) => {
					const isBuy = t.type === "BUY";
					const timeString = new Date(t.timestamp).toLocaleTimeString([], {
						hour12: false,
					});

					return (
						<div
							key={t.id}
							className="grid grid-cols-4 items-center text-[13px] font-medium py-1.5 border-b border-border/20 last:border-0 hover:bg-black/5 transition-colors px-2 rounded -mx-2"
						>
							<span className="text-foreground/70 font-semibold">
								{isBuy ? "Buy" : "Sell"}
							</span>

							<span className="col-span-2 text-center font-bold text-foreground">
								{isBuy
									? `+${t.amount.toFixed(5)} ${rawSymbol} / -${t.total.toFixed(2)} $`
									: `-${t.amount.toFixed(5)} ${rawSymbol} / +${t.total.toFixed(2)} $`}
							</span>

							<span className="text-foreground/50 text-right font-mono text-[11px] font-bold">
								{timeString}
							</span>
						</div>
					);
				})
			)}
		</div>
	);
}
