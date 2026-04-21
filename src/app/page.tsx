"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setSelectedSymbol } from "@/store/slices/pricesSlice";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import PortfolioSummary from "@/components/PortfolioSummary";
import CoinIcon from "@/components/CoinIcon";

export default function DashboardPage() {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	const { symbols, marketData, currentPrices } = useSelector(
		(state: RootState) => state.prices,
	);

	const handleRowClick = (symbol: string) => {
		dispatch(setSelectedSymbol(symbol));
		router.push("/trade");
	};

	return (
		<div className="p-4 lg:p-8 space-y-8 max-w-(--breakpoint-2xl) mx-auto">
			{/* Overview Top Section */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-4">
					<PortfolioSummary />
				</div>
			</div>

			{/* Market Overview Table */}
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl lg:text-2xl font-bold tracking-tight flex items-center gap-2">
						<Activity className="w-6 h-6 text-primary" />
						Market Overview
					</h2>
				</div>

				<div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-secondary hover:bg-secondary border-none h-12">
									<TableHead className="text-xs lg:text-sm font-black uppercase tracking-widest pl-6 text-white">
										Asset
									</TableHead>
									<TableHead className="text-right text-xs lg:text-sm font-black uppercase tracking-widest text-white">
										Last Price
									</TableHead>
									<TableHead className="text-right text-xs lg:text-sm font-black uppercase tracking-widest pr-6 text-white">
										24h Change
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{symbols.map((symbol) => {
									const data = marketData[symbol];
									const price = data ? data.price : currentPrices[symbol] || 0;
									const change = data ? data.change24h : 0;
									const isPositive = change >= 0;

									return (
										<TableRow
											key={symbol}
											onClick={() => handleRowClick(symbol)}
											className="cursor-pointer hover:bg-primary/5 transition-colors border-border/50 h-16 group"
										>
											<TableCell className="pl-6">
												<div className="flex items-center gap-4">
													<CoinIcon
														symbol={symbol}
														className="w-10 h-10 shadow-sm transition-transform group-hover:scale-110"
													/>
													<div className="flex flex-col">
														<span className="font-bold text-base tracking-tight">
															{symbol.replace("USDT", "")}
														</span>
														<span className="text-xs text-muted-foreground font-medium">
															USDT
														</span>
													</div>
												</div>
											</TableCell>

											<TableCell className="text-right">
												<span className="text-base lg:text-lg font-bold font-mono tracking-tight">
													$
													{price > 0
														? price.toLocaleString(undefined, {
																minimumFractionDigits: 2,
																maximumFractionDigits: 8,
															})
														: "---"}
												</span>
											</TableCell>

											<TableCell className="text-right pr-6">
												<div
													className={cn(
														"inline-flex items-center justify-end gap-1.5 font-mono font-bold text-sm lg:text-base px-3 py-1.5 rounded-lg",
														isPositive
															? "text-emerald-500 bg-emerald-500/10"
															: "text-rose-500 bg-rose-500/10",
													)}
												>
													{isPositive ? (
														<TrendingUp className="w-4 h-4" />
													) : (
														<TrendingDown className="w-4 h-4" />
													)}
													{isPositive ? "+" : ""}
													{change.toFixed(2)}%
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
