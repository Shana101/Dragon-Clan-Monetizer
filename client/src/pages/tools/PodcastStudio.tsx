import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Mic2, 
  Users, 
  Radio, 
  Zap, 
  Play, 
  Pause, 
  SkipForward, 
  Settings2, 
  Wand2,
  Megaphone,
  Share2,
  Activity,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAiAdRead } from "@/lib/hooks";

export default function PodcastStudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [activeClone, setActiveClone] = useState("heidi-main");
  const [adScript, setAdScript] = useState<string | null>(null);
  const aiAdRead = useAiAdRead();

  return (
    <Layout>
      <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
        {/* Studio Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold text-foreground">Podcast AI Studio</h1>
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 animate-pulse">
                <Radio className="w-3 h-3 mr-1" />
                ON AIR
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Autonomous production environment managed by <span className="text-primary font-bold">Director AI</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-destructive/50 hover:bg-destructive/10 text-destructive">
              <Activity className="w-4 h-4 mr-2" />
              Emergency Stop
            </Button>
            <Button 
              className={cn(
                "min-w-[140px] font-bold transition-all duration-500",
                isRecording 
                  ? "bg-destructive hover:bg-destructive/90 shadow-[0_0_20px_rgba(255,0,0,0.4)]" 
                  : "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(240,165,0,0.2)]"
              )}
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? (
                <>
                  <Pause className="w-4 h-4 mr-2 fill-current" />
                  STOP RECORDING
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  START SHOW
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Studio Grid */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Left Panel: Clone & Host Management */}
          <div className="col-span-3 flex flex-col gap-4">
            <Card className="flex-1 bg-card/40 border-border/50 backdrop-blur-sm flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Active Clones
                </CardTitle>
                <CardDescription>Select active AI hosts</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div 
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group",
                    activeClone === "heidi-main" ? "bg-primary/10 border-primary" : "bg-secondary/30 border-border/50 hover:border-primary/50"
                  )}
                  onClick={() => setActiveClone("heidi-main")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 p-[1px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <span className="font-display font-bold">H</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold">Heidi (Main)</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-4">Host</Badge>
                        <span className="text-[10px] text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          Ready
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Voice Visualizer (Fake) */}
                  <div className="mt-3 flex items-end justify-between h-4 gap-[2px]">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-full bg-primary/50 rounded-t-sm transition-all duration-75"
                        style={{ height: activeClone === "heidi-main" ? `${Math.random() * 100}%` : '10%' }}
                      />
                    ))}
                  </div>
                </div>

                <div 
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group",
                    activeClone === "guest-bot" ? "bg-primary/10 border-primary" : "bg-secondary/30 border-border/50 hover:border-primary/50"
                  )}
                  onClick={() => setActiveClone("guest-bot")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 p-[1px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <Users className="w-4 h-4 text-zinc-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold">Guest Bot 9000</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-4">Co-Host</Badge>
                        <span className="text-[10px] text-zinc-400">Idle</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-dashed border-border hover:border-primary/50 hover:bg-primary/5">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Clone New Voice
                </Button>
              </CardContent>
            </Card>

            <Card className="h-1/3 bg-card/40 border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Voice Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Speed</span>
                    <span className="text-primary">1.1x</span>
                  </div>
                  <Slider defaultValue={[11]} max={20} step={1} className="[&>span]:bg-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Emotion</span>
                    <span className="text-primary">Excited</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} step={1} className="[&>span]:bg-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel: Director View & Live Feed */}
          <div className="col-span-6 flex flex-col gap-4">
            {/* Live Visualizer Area */}
            <div className="flex-1 rounded-xl bg-black/50 border border-border/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
              
              {/* Overlay UI */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Badge variant="destructive" className="animate-pulse">LIVE FEED</Badge>
                  <div className="bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-primary border border-primary/20">
                    <span className="mr-2">●</span>
                    BITRATE: 4500kbps
                  </div>
                </div>
                
                <div className="flex justify-center items-center">
                   {/* Central Audio Waveform Animation */}
                   <div className="flex items-center gap-1 h-32">
                     {[...Array(40)].map((_, i) => (
                       <div 
                         key={i}
                         className="w-2 bg-primary/80 rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                         style={{ 
                           height: `${Math.random() * 100}%`,
                           animationDelay: `${Math.random() * 0.5}s`
                         }}
                       />
                     ))}
                   </div>
                </div>

                <div className="bg-black/80 backdrop-blur rounded-lg p-4 border border-white/10">
                  <p className="text-primary text-xs uppercase font-bold mb-1">Current Topic</p>
                  <p className="text-lg font-display text-white">"The Future of AI Monetization in 2026"</p>
                </div>
              </div>
            </div>

            {/* Run of Show / Director Controls */}
            <Card className="h-1/3 bg-card/40 border-border/50 backdrop-blur-sm">
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  Director AI Controls
                </CardTitle>
                <Switch defaultChecked />
              </CardHeader>
              <CardContent className="py-0">
                <ScrollArea className="h-[140px] pr-4">
                  <div className="space-y-2">
                    {[
                      { time: "00:00", action: "Intro Sequence", status: "done" },
                      { time: "01:30", action: "Topic: AI Trends", status: "active" },
                      { time: "15:00", action: "Ad Break: NordVPN", status: "queued" },
                      { time: "16:30", action: "Q&A Session", status: "queued" },
                      { time: "25:00", action: "Outro", status: "queued" },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg text-sm border",
                          item.status === "active" ? "bg-primary/20 border-primary text-foreground" : 
                          item.status === "done" ? "bg-secondary/20 border-transparent text-muted-foreground line-through" :
                          "bg-card border-border/50 text-muted-foreground"
                        )}
                      >
                        <span className="font-mono text-xs opacity-70">{item.time}</span>
                        <span className="font-medium">{item.action}</span>
                        {item.status === "active" && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Monetization & Promotion */}
          <div className="col-span-3 flex flex-col gap-4">
            
            {/* Ad Generator */}
            <Card className="flex-1 bg-card/40 border-border/50 backdrop-blur-sm flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Megaphone className="w-5 h-5 text-yellow-500" />
                  Ad Generator
                </CardTitle>
                <CardDescription>Inject AI-read sponsorships</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                  <Label className="text-xs text-muted-foreground mb-2 block">Next Ad Slot</Label>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-foreground">CyberGhost VPN</h4>
                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">$450 CPM</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground italic line-clamp-2">
                    "Protect your privacy online with the fastest VPN..."
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-500 border border-yellow-600/50"
                  onClick={() => {
                    aiAdRead.mutate(
                      { sponsorName: "CyberGhost VPN", sponsorDescription: "Fast, secure VPN service" },
                      { onSuccess: (data) => setAdScript(data.script) }
                    );
                  }}
                  disabled={aiAdRead.isPending}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {aiAdRead.isPending ? "Generating..." : "Generate Ad Read"}
                </Button>

                {adScript && (
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-600/30 mt-2">
                    <p className="text-xs text-yellow-400 font-bold mb-1">Generated Script</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{adScript}</p>
                  </div>
                )}
                
                <div className="space-y-2 mt-4">
                  <Label className="text-xs text-muted-foreground">Insertion Mode</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="bg-primary/10 border-primary/50 text-primary">Dynamic</Button>
                    <Button variant="outline" size="sm" className="text-muted-foreground">Fixed</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promoter / Distribution */}
            <Card className="flex-1 bg-card/40 border-border/50 backdrop-blur-sm flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  Auto-Promoter
                </CardTitle>
                <CardDescription>Real-time distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { platform: "TikTok", status: "Clipping...", color: "bg-pink-500" },
                    { platform: "YouTube Shorts", status: "Uploaded", color: "bg-red-500" },
                    { platform: "Twitter/X", status: "Drafting Thread...", color: "bg-white" },
                  ].map((platform, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-background/50 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", platform.color)} />
                        {platform.platform}
                      </div>
                      <span className="text-xs text-muted-foreground">{platform.status}</span>
                    </div>
                  ))}
                </div>
                
                <Button variant="secondary" className="w-full mt-auto">
                  Configure Channels
                </Button>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </Layout>
  );
}