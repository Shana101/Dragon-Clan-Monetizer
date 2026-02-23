import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Wallet, 
  Bot, 
  Trophy, 
  Users, 
  Settings, 
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Wallet, label: "Earnings", href: "/earnings" },
  { icon: Bot, label: "Heidi Tools", href: "/tools" },
  { icon: Trophy, label: "Dragon Points", href: "/points" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Activity, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border relative transition-all duration-300 z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Logo Area */}
      <div className={cn("p-6 flex items-center gap-3 z-10", collapsed && "justify-center p-4")}>
        <div className="w-10 h-10 min-w-10 rounded bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(240,165,0,0.3)]">
          <img src="/logo.png" alt="Dragon Clan" className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(240,165,0,0.5)]" />
        </div>
        {!collapsed && (
          <div className="animate-in fade-in duration-300">
            <h1 className="font-display font-bold text-xl tracking-wider text-foreground">DRAGON<span className="text-primary">CLAN</span></h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Creator OS</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-20 z-50">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-6 w-6 rounded-full border border-border shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 z-10">
        {sidebarItems.map((item) => {
          const isActive = location === item.href;
          
          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className={cn(
                      "flex items-center justify-center w-full h-12 rounded-lg transition-all duration-300 group relative overflow-hidden",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(240,165,0,0.1)]" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}>
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#f0a500]" />
                      )}
                      <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover border-border text-foreground">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(240,165,0,0.1)]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#f0a500]" />
                )}
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                <span className="font-medium tracking-wide whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={cn("p-4 border-t border-sidebar-border z-10", collapsed && "items-center flex flex-col")}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors cursor-pointer group",
          collapsed && "justify-center p-0 hover:bg-transparent"
        )}>
          <div className="w-10 h-10 min-w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <span className="font-display font-bold text-primary">JD</span>
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in duration-300">
              <p className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Lvl 42 Creator</p>
            </div>
          )}
          {!collapsed && <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />}
        </div>
      </div>
    </div>
  );
}