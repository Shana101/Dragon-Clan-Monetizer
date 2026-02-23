import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  status?: "active" | "beta" | "coming-soon";
  className?: string;
}

export function ToolCard({ title, description, icon: Icon, actionLabel = "Launch", onAction, status = "active", className }: ToolCardProps) {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(240,165,0,0.15)]",
      className
    )}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status Badge */}
      {status !== "active" && (
        <div className={cn(
          "absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
          status === "beta" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
        )}>
          {status === "coming-soon" ? "Coming Soon" : status}
        </div>
      )}

      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary ring-1 ring-primary/20 shadow-[0_0_15px_rgba(240,165,0,0.2)] group-hover:shadow-[0_0_25px_rgba(240,165,0,0.4)] transition-shadow duration-300">
          <Icon className="h-6 w-6" />
        </div>
        
        <h3 className="mb-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="relative z-10 mt-6">
        <Button 
          variant="outline" 
          className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 font-medium"
          disabled={status === "coming-soon"}
          onClick={onAction}
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}