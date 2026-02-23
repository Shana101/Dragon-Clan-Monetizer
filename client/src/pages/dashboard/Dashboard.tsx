import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ToolCard } from "@/components/dashboard/ToolCard";
import { 
  DollarSign, 
  Users, 
  Trophy, 
  TrendingUp, 
  Shirt, 
  Video, 
  GraduationCap, 
  Briefcase, 
  Share2, 
  Mic2,
  Lock,
  Zap,
  Bot,
  Loader2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useSeedAndGetUser, useEarnings } from "@/lib/hooks";

const earningsData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1900 },
  { name: "Mar", total: 2400 },
  { name: "Apr", total: 2100 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 4500 },
  { name: "Jul", total: 5100 },
];

export default function Dashboard() {
  const seedQuery = useSeedAndGetUser();
  const earningsQuery = useEarnings();

  const user = seedQuery.data;
  const totalEarnings = earningsQuery.data?.reduce((sum, e) => sum + e.amount, 0) ?? 0;

  if (seedQuery.isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, <span className="text-primary glow-text">{user?.displayName ?? "Commander"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Heidi is online. Your empire is growing.
          </p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-secondary/50 rounded-lg border border-border/50 backdrop-blur flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-sm font-medium text-muted-foreground">System Optimal</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Earnings" 
          value={`$${totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="12.5%" 
          trendUp={true} 
          icon={DollarSign}
          description="Direct-to-Creator Revenue"
        />
        <StatCard 
          title="Active Subscribers" 
          value="1,240" 
          trend="4.3%" 
          trendUp={true} 
          icon={Users}
          description="Paying Members"
        />
        <StatCard 
          title="Dragon Points" 
          value={(user?.dragonPoints ?? 0).toLocaleString()}
          trend="8.1%" 
          trendUp={true} 
          icon={Trophy}
          description={`Loyalty Level: ${user?.pointsTier ?? "Bronze"}`}
        />
        <StatCard 
          title="Referral Bonus" 
          value="$340.00" 
          trend="2.1%" 
          trendUp={false} 
          icon={Share2}
          description="5 Active Referrals"
        />
      </div>

      {/* Main Charts & Tools Area */}
      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        
        {/* Earnings Chart */}
        <Card className="col-span-1 md:col-span-4 bg-card/40 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display tracking-wide">Revenue Velocity</CardTitle>
            <CardDescription>Monthly earnings across all streams</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Heidi Active Tasks / AI Status */}
        <Card className="col-span-1 md:col-span-3 bg-card/40 border-border/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Bot size={120} />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="text-primary w-5 h-5" />
              <CardTitle className="font-display tracking-wide">Heidi Protocol</CardTitle>
            </div>
            <CardDescription>Synthetic Employee Activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Clip Generation
                </span>
                <span className="text-muted-foreground">Processing...</span>
              </div>
              <Progress value={78} className="h-1 bg-secondary" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Merch Designs
                </span>
                <span className="text-green-500 font-medium">Complete</span>
              </div>
              <Progress value={100} className="h-1 bg-secondary" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Sponsorship Matching
                </span>
                <span className="text-muted-foreground">Analyzing...</span>
              </div>
              <Progress value={32} className="h-1 bg-secondary" />
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs font-mono text-primary/80">
                &gt; HEIDI_LOG: Detected viral potential in stream segment [02:14:30]. Suggesting clip extraction for TikTok/Shorts. Estimated revenue lift: +15%.
              </p>
              <Button size="sm" variant="ghost" className="mt-2 w-full text-xs hover:bg-primary/20 hover:text-primary">
                Review Suggestion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heidi AI Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Heidi Toolkit</h2>
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="monetize">Monetize</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ToolCard 
            title="Podcast Studio" 
            description="Full AI production suite with clones, auto-direction, and ad injection."
            icon={Mic2}
            actionLabel="Enter Studio"
            status="active"
            onAction={() => window.location.href = "/tools/podcast-studio"}
          />
          <ToolCard 
            title="Merch Forge" 
            description="AI-generated designs based on your gameplay moments."
            icon={Shirt}
            actionLabel="Open Forge"
            status="active"
          />
          <ToolCard 
            title="Clip Hunter" 
            description="Auto-detects high-engagement moments for social."
            icon={Video}
            actionLabel="Scan Streams"
            status="active"
          />
          <ToolCard 
            title="Course Architect" 
            description="Turn your skills into a masterclass curriculum."
            icon={GraduationCap}
            actionLabel="Build Course"
            status="beta"
          />
          <ToolCard 
            title="Sponsor Match" 
            description="Connect with brands that align with your audience."
            icon={Briefcase}
            actionLabel="Find Deals"
            status="active"
          />
          <ToolCard 
            title="Voice Synth" 
            description="Create custom voice packs for licensing."
            icon={Mic2}
            actionLabel="Train Model"
            status="coming-soon"
          />
          <ToolCard 
            title="Content Safe" 
            description="Blockchain-verified content provenance (DDD)."
            icon={Lock}
            actionLabel="Verify Assets"
            status="active"
          />
        </div>
      </div>
    </Layout>
  );
}