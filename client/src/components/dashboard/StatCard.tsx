import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, trend, trendUp, icon: Icon, description, className }: StatCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(240,165,0,0.1)]",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-foreground drop-shadow-md">{value}</h3>
          
          {trend && (
            <div className={cn("mt-2 flex items-center text-xs font-medium", trendUp ? "text-green-400" : "text-red-400")}>
              <span>{trendUp ? "↑" : "↓"} {trend}</span>
              <span className="ml-1 text-muted-foreground/60">vs last month</span>
            </div>
          )}
          
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="rounded-lg bg-secondary/50 p-3 text-primary ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}