"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { resetPortfolio } from "@/store/slices/portfolioSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Shield, Bell, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
	const dispatch = useDispatch<AppDispatch>();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const confirmReset = () => {
		dispatch(resetPortfolio());
		toast.success("Portfolio reset successfully");
		setIsConfirmOpen(false);
	};

	return (
		<div className="p-4 lg:p-8 space-y-6 max-w-(--breakpoint-md) mx-auto relative">
			<h2 className="text-2xl font-bold tracking-tight">Settings</h2>

			<div className="space-y-4">
				<div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-secondary rounded-lg">
								<Trash2 className="w-5 h-5 text-zinc-300" />
							</div>
							<div>
								<h4 className="font-medium text-sm">Reset Account</h4>
								<p className="text-xs text-muted-foreground">
									Wipe all trades and balance history
								</p>
							</div>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => setIsConfirmOpen(true)}
						>
							Reset Now
						</Button>
					</div>
				</div>

				<div className="bg-card border rounded-xl p-6 shadow-sm opacity-50 cursor-not-allowed">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-secondary rounded-lg">
								<Shield className="w-5 h-5 text-zinc-300" />
							</div>
							<div>
								<h4 className="font-medium text-sm">Security</h4>
								<p className="text-xs text-muted-foreground">
									Manage your API keys (Experimental)
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-card border rounded-xl p-6 shadow-sm opacity-50 cursor-not-allowed">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-secondary rounded-lg">
								<Bell className="w-5 h-5 text-zinc-300" />
							</div>
							<div>
								<h4 className="font-medium text-sm">Notifications</h4>
								<p className="text-xs text-muted-foreground">
									Alerts for price targets
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Confirmation Modal */}
			{isConfirmOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
					<div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
						<div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
							<AlertTriangle className="w-8 h-8" />
						</div>
						<h3 className="text-xl font-bold text-foreground mb-2">
							Reset Portfolio?
						</h3>
						<p className="text-sm font-medium text-muted-foreground mb-8">
							This action is irreversible. All your trade history, holdings, and
							statistics will be wiped globally.
						</p>
						<div className="flex gap-3 w-full">
							<Button
								onClick={() => setIsConfirmOpen(false)}
								className="flex-1 bg-muted hover:bg-muted/80 text-foreground rounded-xl h-12 text-sm font-bold shadow-none"
							>
								Cancel
							</Button>
							<Button
								onClick={confirmReset}
								className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 text-sm font-bold shadow-md"
							>
								Yes, Reset
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
