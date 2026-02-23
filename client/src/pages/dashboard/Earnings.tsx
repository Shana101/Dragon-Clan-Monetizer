import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { DollarSign, TrendingUp, CreditCard, Gift, Video, Shirt, Loader2 } from "lucide-react";
import { useEarnings } from "@/lib/hooks";

const revenueData = [
  { name: 'Mon', sub: 400, tip: 240, ad: 200 },
  { name: 'Tue', sub: 300, tip: 139, ad: 220 },
  { name: 'Wed', sub: 200, tip: 980, ad: 229 },
  { name: 'Thu', sub: 278, tip: 390, ad: 200 },
  { name: 'Fri', sub: 189, tip: 480, ad: 218 },
  { name: 'Sat', sub: 239, tip: 380, ad: 250 },
  { name: 'Sun', sub: 349, tip: 430, ad: 210 },
];

const sourceData = [
  { name: 'Subscriptions', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Tips & Gifts', value: 25, color: '#eab308' },
  { name: 'Ad Revenue', value: 20, color: '#3b82f6' },
  { name: 'Merch', value: 10, color: '#a855f7' },
];

const typeIconMap: Record<string, { icon: typeof CreditCard; color: string }> = {
  subscription: { icon: CreditCard, color: "text-primary" },
  tip: { icon: Gift, color: "text-yellow-500" },
  ad: { icon: Video, color: "text-blue-500" },
  merch: { icon: Shirt, color: "text-purple-500" },
};

export default function Earnings() {
  const earningsQuery = useEarnings();
  const earningsData2 = earningsQuery.data ?? [];

  const totalEarnings = earningsData2.reduce((sum, e) => sum + e.amount, 0);
  const subscriptionTotal = earningsData2
    .filter((e) => e.type === "subscription")
    .reduce((sum, e) => sum + e.amount, 0);

  if (earningsQuery.isLoading) {
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
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-display font-bold">Earnings Center</h1>
          <p className="text-muted-foreground">Detailed financial breakdown of your empire.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Available Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold font-display">${totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">Ready</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Scheduled for Friday, Feb 24</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Monthly Recurring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold font-display">${subscriptionTotal >= 1000 ? `${(subscriptionTotal / 1000).toFixed(1)}k` : subscriptionTotal.toFixed(2)}</span>
                <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +15%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Projected ${((subscriptionTotal * 1.15) / 1000).toFixed(1)}k next month</p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Avg. Revenue Per User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold font-display">$8.50</span>
                <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Top 5% of creators</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Bar Chart */}
          <Card className="lg:col-span-2 bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Daily earnings by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  />
                  <Legend />
                  <Bar dataKey="sub" name="Subscriptions" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="tip" name="Tips" stackId="a" fill="#eab308" />
                  <Bar dataKey="ad" name="Ads" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Donut Chart */}
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                     itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Custom Legend */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 flex-wrap px-4">
                {sourceData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningsData2.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
              )}
              {earningsData2.map((tx) => {
                const mapping = typeIconMap[tx.type] ?? { icon: CreditCard, color: "text-primary" };
                const IconComponent = mapping.icon;
                const timeAgo = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "";
                return (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-white/5 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-full bg-secondary/50", mapping.color)}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tx.source}</p>
                        <p className="text-xs text-muted-foreground">{tx.type} • {timeAgo}</p>
                      </div>
                    </div>
                    <span className={cn("font-mono font-bold", mapping.color)}>+${tx.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}