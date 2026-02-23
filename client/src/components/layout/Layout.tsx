import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Bell, Search, Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300">
        
        {/* Abstract Background Texture */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('/src/assets/bg-texture.png')] bg-cover bg-center" />
        
        {/* Header */}
        <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search Heidi tools..." 
                className="pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-full text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 w-64 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(240,165,0,0.1)]">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-display font-bold">1,250 DP</span>
            </Button>
            
            <button className="relative p-2 rounded-full hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#f0a500]" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 z-10 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}