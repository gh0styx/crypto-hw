"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import { setSelectedSymbol } from "@/store/slices/pricesSlice";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Wallet, Menu, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Sidebar from "./Sidebar";
import CoinIcon from "./CoinIcon";
import { useDebounce } from "@/hooks/useDebounce";

export default function Header() {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const { symbols, selectedSymbol, currentPrices } = useSelector(
		(state: RootState) => state.prices,
	);
	const { balance } = useSelector((state: RootState) => state.portfolio);

	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 300);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	const filteredSymbols = useMemo(() => {
		return symbols.filter((s) =>
			s.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
		);
	}, [symbols, debouncedSearchTerm]);

	const currentPrice = currentPrices[selectedSymbol];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsSearchOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (symbol: string) => {
		dispatch(setSelectedSymbol(symbol));
		setSearchTerm("");
		setIsSearchOpen(false);
		router.push("/trade");
	};

	return (
		<header className="h-16 lg:h-20 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50">
			<div className="flex items-center gap-4 lg:gap-8">
				<Sheet>
					<SheetTrigger className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
						<Menu className="w-6 h-6 text-muted-foreground" />
					</SheetTrigger>
					<SheetContent
						side="left"
						className="p-0 w-72 bg-background border-r border-border"
					>
						<SheetHeader className="p-6 pb-2">
							<SheetTitle className="text-left flex items-center gap-2 font-bold tracking-tight text-xl">
								<TrendingUp className="text-primary w-6 h-6" />
								CryptoDash
							</SheetTitle>
						</SheetHeader>
						<Sidebar isMobile />
					</SheetContent>
				</Sheet>

				{/* Unified Search Input */}
				<div className="flex items-center gap-3 relative" ref={searchRef}>
					<div className="relative group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
						<Input
							placeholder="Search crypto..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onFocus={() => setIsSearchOpen(true)}
							className="pl-10 h-10 lg:h-12 w-[160px] lg:w-[260px] bg-secondary/30 border-border rounded-xl text-sm lg:text-base font-bold focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm"
						/>

						{/* Search Dropdown */}
						{isSearchOpen && (
							<div className="absolute top-[calc(100%+8px)] left-0 w-[240px] lg:w-[320px] max-h-[300px] overflow-y-auto bg-popover border border-border rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
								<div className="p-1">
									{filteredSymbols.length > 0 ? (
										filteredSymbols.map((s) => (
											<button
												key={s}
												onClick={() => handleSelect(s)}
												className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-secondary/10 rounded-lg transition-colors flex justify-between items-center group/item"
											>
												<div className="flex items-center gap-3">
													<CoinIcon
														symbol={s}
														className="w-6 h-6 border bg-white"
													/>
													<span className="group-hover/item:text-primary transition-colors">
														{s?.replace("USDT", "") ?? s}/USDT
													</span>
												</div>
												<span className="text-muted-foreground font-mono group-hover/item:text-foreground transition-colors">
													{currentPrices[s]
														? `$${currentPrices[s].toLocaleString(undefined, { minimumFractionDigits: 2 })}`
														: ""}
												</span>
											</button>
										))
									) : (
										<div className="p-6 text-center text-sm font-medium text-muted-foreground italic">
											No results found
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					<div className="h-10 lg:h-12 border-l border-border pl-3 lg:pl-6 hidden sm:flex items-center">
						<div className="flex items-center gap-2">
							<span className="text-base lg:text-xl font-bold tracking-tighter font-mono leading-none">
								{selectedSymbol?.replace("USDT", "")}:{" "}
								{currentPrice
									? `$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
									: "---"}
							</span>
							<div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				{/* Minimal Wallet Display */}
				<div className="bg-secondary px-5 h-10 lg:h-12 rounded-full flex items-center gap-3 transition-transform hover:scale-105 shadow-md cursor-default border border-secondary/10">
					<div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
						<Wallet className="w-4 h-4 text-primary" />
					</div>
					<span className="text-base lg:text-lg font-bold font-mono tracking-tight text-white">
						$
						{balance.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				</div>
			</div>
		</header>
	);
}
