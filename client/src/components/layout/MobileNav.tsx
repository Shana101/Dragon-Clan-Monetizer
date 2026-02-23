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
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Wallet, label: "Earnings", href: "/earnings" },
  { icon: Bot, label: "Heidi Tools", href: "/tools" },
  { icon: Trophy, label: "Dragon Points", href: "/points" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Activity, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-secondary">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar border-r border-sidebar-border p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
             <img src="/logo.png" alt="Dragon Clan" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-foreground">DRAGON<span className="text-primary">CLAN</span></span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  <span className="font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}