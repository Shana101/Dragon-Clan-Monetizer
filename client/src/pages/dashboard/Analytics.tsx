import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAnalytics } from "@/lib/hooks";
import { useMemo } from "react";

export default function Analytics() {
  const { data: analytics, isLoading } = useAnalytics();

  const viewData = useMemo(() => {
    if (!analytics) return [];
    return analytics
      .filter((a) => a.metric === "viewers")
      .map((a) => ({ time: a.label, viewers: Math.round(a.value) }));
  }, [analytics]);

  const engagementData = useMemo(() => {
    if (!analytics) return [];
    const likesMap = new Map<string, number>();
    const commentsMap = new Map<string, number>();
    const labels: string[] = [];

    analytics.forEach((a) => {
      if (a.metric === "likes") {
        likesMap.set(a.label, Math.round(a.value));
        if (!labels.includes(a.label)) labels.push(a.label);
      } else if (a.metric === "comments") {
        commentsMap.set(a.label, Math.round(a.value));
        if (!labels.includes(a.label)) labels.push(a.label);
      }
    });

    return labels.map((label) => ({
      day: label,
      likes: likesMap.get(label) ?? 0,
      comments: commentsMap.get(label) ?? 0,
    }));
  }, [analytics]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-display font-bold">Deep Analytics</h1>
          <p className="text-muted-foreground">Real-time data visualization of your empire's performance.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-border/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Live Viewership</CardTitle>
                  <CardDescription>24h Viewer Trends</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={viewData}>
                      <defs>
                        <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                      />
                      <Area type="monotone" dataKey="viewers" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViewers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Engagement Volume</CardTitle>
                  <CardDescription>Likes vs Comments (Weekly)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      />
                      <Bar dataKey="likes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="comments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Heatmap / Histogram Mockup */}
            <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Audience Retention Histogram</CardTitle>
                <CardDescription>Where viewers drop off during streams</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="h-48 w-full flex items-end gap-1">
                   {[...Array(50)].map((_, i) => {
                     const height = Math.max(10, Math.random() * 100);
                     const color = height > 80 ? "bg-green-500" : height > 40 ? "bg-primary" : "bg-red-500";
                     return (
                       <div key={i} className={`flex-1 ${color} rounded-t-sm opacity-80 hover:opacity-100 transition-opacity`} style={{ height: `${height}%` }} />
                     )
                   })}
                 </div>
                 <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                   <span>0:00</span>
                   <span>1:00</span>
                   <span>2:00</span>
                   <span>3:00</span>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}