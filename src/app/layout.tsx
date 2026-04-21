import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { GlobalDataSync } from "@/components/GlobalDataSync";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CryptoDash | Advanced Crypto Trading Dashboard",
	description:
		"Real-time crypto price analysis, interactive 24h charts, and mock trading simulation for Bitcoin, Ethereum, and more.",
	keywords: [
		"crypto",
		"trading",
		"dashboard",
		"bitcoin",
		"ethereum",
		"real-time",
		"mock trading",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-screen overflow-hidden`}
			>
				<StoreProvider>
					<GlobalDataSync>
						<div className="flex h-screen overflow-hidden">
							<Sidebar />
							<main className="flex-1 flex flex-col overflow-hidden relative">
								<Header />
								<div className="flex-1 overflow-y-auto">{children}</div>
							</main>
						</div>
					</GlobalDataSync>
					<Toaster position="top-right" richColors theme="dark" />
				</StoreProvider>
			</body>
		</html>
	);
}
