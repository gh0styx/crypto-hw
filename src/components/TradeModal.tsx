"use client";

import { useTrading } from "@/hooks/useTrading";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

export default function TradeModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const {
		amount,
		setAmount,
		setTradeType,
		performTrade,
		selectedSymbol,
		currentPrice,
	} = useTrading();

	const [fiatValue, setFiatValue] = useState<string>("");

	const handleFiatChange = (val: string) => {
		setFiatValue(val);
		if (val && !isNaN(parseFloat(val)) && currentPrice > 0) {
			setAmount(
				(parseFloat(val) / currentPrice).toFixed(8).replace(/\.?0+$/, ""),
			);
		} else {
			setAmount("");
		}
	};

	const handleCryptoChange = (val: string) => {
		setAmount(val);
		if (val && !isNaN(parseFloat(val)) && currentPrice > 0) {
			setFiatValue((parseFloat(val) * currentPrice).toFixed(2));
		} else {
			setFiatValue("");
		}
	};

	const handleTrade = (type: "BUY" | "SELL") => {
		setTradeType(type);
		setTimeout(() => {
			performTrade();
			onClose();
		}, 50);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
			<div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
				<button
					onClick={onClose}
					className="absolute right-5 top-5 p-1 text-foreground hover:bg-muted rounded-full transition-colors"
				>
					<X className="w-5 h-5 font-bold" />
				</button>

				<div className="space-y-6 mt-6">
					{/* Inputs Section */}
					<div className="space-y-4">
						<div className="relative bg-[#F8F9FA] rounded-md px-4 py-2 border-b border-border">
							<input
								type="number"
								value={fiatValue}
								onChange={(e) => handleFiatChange(e.target.value)}
								placeholder="0.00"
								className="w-full bg-transparent text-right pr-12 outline-none text-lg tracking-wide font-normal"
							/>
							<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary uppercase tracking-widest">
								$
							</span>
						</div>

						<div className="relative bg-[#F8F9FA] rounded-md px-4 py-2 border-b border-border">
							<input
								type="number"
								value={amount}
								onChange={(e) => handleCryptoChange(e.target.value)}
								placeholder="0.00000000"
								className="w-full bg-transparent text-right pr-14 outline-none text-lg tracking-wide font-normal"
							/>
							<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary uppercase tracking-widest">
								{selectedSymbol.replace("USDT", "")}
							</span>
						</div>
					</div>

					{/* Action Buttons Section */}
					<div className="flex items-center gap-4 pt-2">
						<Button
							onClick={() => handleTrade("BUY")}
							className="flex-1 h-14 bg-secondary hover:bg-secondary/90 text-white font-medium text-lg rounded-xl shadow-md transition-all active:scale-95"
						>
							Buy
						</Button>
						<Button
							onClick={() => handleTrade("SELL")}
							className="flex-1 h-14 bg-secondary hover:bg-secondary/90 text-white font-medium text-lg rounded-xl shadow-md transition-all active:scale-95"
						>
							Sell
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
