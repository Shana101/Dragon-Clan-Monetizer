import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Gift, Zap, Crown, Lock, Loader2 } from "lucide-react";
import { useUser, useQuests, useClaimQuest } from "@/lib/hooks";

export default function DragonPoints() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: quests, isLoading: questsLoading } = useQuests();
  const claimQuest = useClaimQuest();

  const isLoading = userLoading || questsLoading;

  const dragonPoints = user?.dragonPoints ?? 0;
  const pointsTier = user?.pointsTier ?? "Bronze";
  const level = user?.level ?? 1;

  const tierThresholds: Record<string, { next: string; threshold: number }> = {
    Bronze: { next: "Silver", threshold: 10000 },
    Silver: { next: "Gold", threshold: 25000 },
    Gold: { next: "Platinum", threshold: 50000 },
    Platinum: { next: "Diamond", threshold: 100000 },
    Diamond: { next: "Dragon", threshold: 250000 },
  };

  const currentTierInfo = tierThresholds[pointsTier] ?? { next: "Max", threshold: dragonPoints };
  const prevThreshold = Object.values(tierThresholds).find(t => t.next === pointsTier);
  const prevPoints = prevThreshold ? prevThreshold.threshold : 0;
  const progressPercent = currentTierInfo.threshold > prevPoints
    ? Math.min(100, Math.round(((dragonPoints - prevPoints) / (currentTierInfo.threshold - prevPoints)) * 100))
    : 100;
  const pointsNeeded = Math.max(0, currentTierInfo.threshold - dragonPoints);

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
        
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden border border-primary/30 min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-black/60">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 mb-4 shadow-[0_0_30px_rgba(240,165,0,0.4)]">
              <Trophy className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(240,165,0,0.8)]" />
            </div>
            
            <h1 className="text-5xl font-display font-bold text-white drop-shadow-md">
              <span className="text-primary" data-testid="text-dragon-points">{dragonPoints.toLocaleString()}</span> DP
            </h1>
            <p className="text-xl text-muted-foreground uppercase tracking-widest font-bold" data-testid="text-tier-level">{pointsTier} Tier • Level {level}</p>
            
            <div className="w-full max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Progress to {currentTierInfo.next}</span>
                <span className="text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-3 bg-secondary border border-white/10" />
              <p className="text-xs text-muted-foreground">Earn {pointsNeeded.toLocaleString()} more DP to unlock {currentTierInfo.next} benefits.</p>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Active Perks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded bg-primary/10 border border-primary/20">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-bold text-sm">No Platform Fees</p>
                  <p className="text-xs text-muted-foreground">Saved $1,240 this month</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded bg-secondary/30 border border-white/5">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-bold text-sm">Priority Support</p>
                  <p className="text-xs text-muted-foreground">1hr response time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Daily Quests
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {quests && quests.length > 0 ? quests.map((quest) => {
                const progressPercent = quest.target > 0 ? Math.round((quest.progress / quest.target) * 100) : 0;
                const canClaim = progressPercent >= 100 && quest.status !== "claimed";
                return (
                  <div key={quest.id} className="p-4 rounded-lg bg-background/50 border border-white/5 flex flex-col justify-between gap-3" data-testid={`card-quest-${quest.id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm">{quest.title}</h4>
                        <Badge variant="outline" className="mt-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                          {quest.reward} DP
                        </Badge>
                      </div>
                      {quest.status === "claimed" ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Claimed</Badge>
                      ) : canClaim ? (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => claimQuest.mutate(quest.id)}
                          disabled={claimQuest.isPending}
                          data-testid={`button-claim-${quest.id}`}
                        >
                          {claimQuest.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Claim"}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">{progressPercent}%</span>
                      )}
                    </div>
                    <Progress value={progressPercent} className="h-1" />
                  </div>
                );
              }) : (
                <p className="text-sm text-muted-foreground col-span-2">No quests available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rewards Store */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold">Rewards Store</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Free Avatar Render", cost: "2,000 DP", img: "bg-purple-500" },
              { name: "Boost: 24h Front Page", cost: "5,000 DP", img: "bg-primary" },
              { name: "Custom Merch Design", cost: "3,500 DP", img: "bg-blue-500" },
              { name: "Heidi Coaching Call", cost: "10,000 DP", img: "bg-yellow-500" },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-xl border border-border/50 bg-card/40 overflow-hidden hover:border-primary/50 transition-all">
                <div className={`h-32 w-full ${item.img} opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="p-4">
                  <h3 className="font-bold">{item.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-mono font-bold text-yellow-500">{item.cost}</span>
                    <Button size="sm" variant="secondary" className="hover:bg-primary hover:text-white">Redeem</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}