'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, TrendingUp, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: TrendingUp, label: 'Trade', path: '/trade' },
  { icon: PieChart, label: 'Portfolio', path: '/portfolio' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const isCollapsed = true;

  return (
    <aside className={cn(
      "flex flex-col bg-background border-r border-border",
      isMobile 
        ? "h-full w-full border-none p-6" 
        : "w-20 hidden lg:flex h-screen p-4 items-center"
    )}>
      {/* Brand Header */}
      <div className={cn(
        "flex items-center justify-center mb-10 w-full",
        isMobile ? "justify-start px-2 gap-3" : ""
      )}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shrink-0">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        {isMobile && (
          <span className="text-xl font-bold tracking-tight text-foreground uppercase">
            CryptoDash
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className="w-full flex justify-center">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-12 h-12 rounded-xl transition-all",
                  isMobile ? "w-full justify-start gap-4 px-4" : "justify-center p-0",
                  isActive 
                    ? "bg-secondary text-secondary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                title={!isMobile ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isMobile && <span className="text-base font-bold">{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto w-full flex justify-center pt-6 border-t border-border">
        <Button 
          variant="ghost" 
          className={cn(
            "w-12 h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            isMobile ? "w-full justify-start gap-4 px-4" : "justify-center p-0"
          )}
          title={!isMobile ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isMobile && <span className="text-base font-bold">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

