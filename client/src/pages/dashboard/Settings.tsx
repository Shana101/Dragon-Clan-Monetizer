import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  CreditCard, 
  Bell, 
  Bot, 
  Save, 
  Upload,
  Mic2,
  Zap,
  Loader2
} from "lucide-react";
import { useUser, useUpdateUser, useTiers } from "@/lib/hooks";

export default function Settings() {
  const userQuery = useUser();
  const updateUser = useUpdateUser();
  const tiersQuery = useTiers();

  const user = userQuery.data;
  const tiers = tiersQuery.data ?? [];

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [heidiAutonomy, setHeidiAutonomy] = useState(60);
  const [heidiPersonality, setHeidiPersonality] = useState("professional");
  const [heidiVoice, setHeidiVoice] = useState("v2");
  const [autoClip, setAutoClip] = useState(true);
  const [autoComment, setAutoComment] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [paypalConnected, setPaypalConnected] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? "");
      setUsername(user.username ?? "");
      setBio(user.bio ?? "");
      setAvatarUrl(user.avatarUrl ?? "");
      setHeidiAutonomy(user.heidiAutonomy ?? 60);
      setHeidiPersonality(user.heidiPersonality ?? "professional");
      setHeidiVoice(user.heidiVoice ?? "v2");
      setAutoClip(user.autoClip ?? true);
      setAutoComment(user.autoComment ?? false);
      setStripeConnected(user.stripeConnected ?? false);
      setPaypalConnected(user.paypalConnected ?? false);
    }
  }, [user]);

  const handleSave = () => {
    updateUser.mutate({
      displayName,
      username,
      bio,
      avatarUrl,
      heidiAutonomy,
      heidiPersonality,
      heidiVoice,
      autoClip,
      autoComment,
      stripeConnected,
      paypalConnected,
    });
  };

  if (userQuery.isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const tierColors = ["bg-zinc-400", "bg-primary", "bg-yellow-500"];
  const tierBorderColors = ["border-border/50", "border-primary/50", "border-yellow-500/50"];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold">System Configuration</h1>
            <p className="text-muted-foreground">Manage your profile, AI parameters, and financial connections.</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(240,165,0,0.3)]"
            onClick={handleSave}
            disabled={updateUser.isPending}
          >
            {updateUser.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 flex-shrink-0">
              <TabsList className="flex flex-col h-auto w-full bg-card/40 border border-border/50 backdrop-blur-sm p-2 gap-1 rounded-xl">
                <TabsTrigger value="profile" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <User className="w-4 h-4" /> Profile & Brand
                </TabsTrigger>
                <TabsTrigger value="heidi" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Bot className="w-4 h-4" /> Heidi AI Engine
                </TabsTrigger>
                <TabsTrigger value="monetization" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <CreditCard className="w-4 h-4" /> Monetization
                </TabsTrigger>
                <TabsTrigger value="tiers" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Zap className="w-4 h-4" /> Sub Tiers
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Bell className="w-4 h-4" /> Notifications
                </TabsTrigger>
              </TabsList>
            </aside>

            <div className="flex-1 space-y-6">
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-0">
                <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>How you appear to your community.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24 border-2 border-primary/50">
                        <AvatarImage src={avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} />
                        <AvatarFallback>{displayName?.slice(0, 2).toUpperCase() || "JD"}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" /> Change Avatar
                        </Button>
                        <p className="text-xs text-muted-foreground">Recommended: 400x400px, PNG or JPG.</p>
                      </div>
                    </div>
                    
                    <Separator className="bg-border/50" />
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Display Name</Label>
                        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-secondary/30 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                          <Input value={username} onChange={(e) => setUsername(e.target.value)} className="pl-7 bg-secondary/30 border-border/50" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <textarea 
                        className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Heidi AI Tab */}
              <TabsContent value="heidi" className="space-y-6 mt-0">
                <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Heidi Core Parameters</CardTitle>
                    <CardDescription>Configure your synthetic employee's behavior.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex flex-col gap-1">
                          <span>Autonomy Level</span>
                          <span className="font-normal text-xs text-muted-foreground">How much control does Heidi have?</span>
                        </Label>
                      </div>
                      <Slider value={[heidiAutonomy]} onValueChange={(val) => setHeidiAutonomy(val[0])} max={100} step={20} className="[&>span]:bg-primary" />
                      <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>Manual</span>
                        <span>Assistant</span>
                        <span>Co-Pilot</span>
                        <span>Director</span>
                        <span>Autonomous</span>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Personality Model</Label>
                        <Select value={heidiPersonality} onValueChange={setHeidiPersonality}>
                          <SelectTrigger className="bg-secondary/30 border-border/50">
                            <SelectValue placeholder="Select personality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional & Crisp</SelectItem>
                            <SelectItem value="hype">Hype & Energetic</SelectItem>
                            <SelectItem value="sarcastic">Witty & Sarcastic</SelectItem>
                            <SelectItem value="zen">Calm & Zen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Voice Synth Model</Label>
                        <div className="flex gap-2">
                          <Select value={heidiVoice} onValueChange={setHeidiVoice}>
                            <SelectTrigger className="bg-secondary/30 border-border/50">
                              <SelectValue placeholder="Select voice" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="v1">Heidi Classic (V1)</SelectItem>
                              <SelectItem value="v2">Heidi Neural (V2)</SelectItem>
                              <SelectItem value="clone">Custom Clone (Beta)</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="icon" variant="secondary"><Mic2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <Label>Automated Tasks</Label>
                       <div className="space-y-3">
                         <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20">
                           <div className="space-y-0.5">
                             <div className="font-medium text-sm">Auto-Clip & Post</div>
                             <div className="text-xs text-muted-foreground">Find highlights and post to TikTok</div>
                           </div>
                           <Switch checked={autoClip} onCheckedChange={setAutoClip} />
                         </div>
                         <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20">
                           <div className="space-y-0.5">
                             <div className="font-medium text-sm">Comment Responder</div>
                             <div className="text-xs text-muted-foreground">Reply to top fans automatically</div>
                           </div>
                           <Switch checked={autoComment} onCheckedChange={setAutoComment} />
                         </div>
                       </div>
                    </div>

                  </CardContent>
                </Card>
              </TabsContent>

              {/* Monetization Tab */}
              <TabsContent value="monetization" className="space-y-6 mt-0">
                <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Where your earnings go.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={cn(
                      "p-4 rounded-lg flex items-center justify-between",
                      stripeConnected 
                        ? "border border-green-500/30 bg-green-500/10" 
                        : "border border-border/50 bg-secondary/20 opacity-75"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded">
                           <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{stripeConnected ? "Stripe Connected" : "Stripe"}</p>
                          <p className={cn("text-xs", stripeConnected ? "text-green-400" : "text-muted-foreground")}>
                            {stripeConnected ? "Active • Payouts Daily" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className={stripeConnected ? "border-green-500/30 text-green-400 hover:bg-green-500/20" : ""}>
                        {stripeConnected ? "Manage" : "Connect"}
                      </Button>
                    </div>

                    <div className={cn(
                      "p-4 rounded-lg flex items-center justify-between",
                      paypalConnected 
                        ? "border border-green-500/30 bg-green-500/10" 
                        : "border border-border/50 bg-secondary/20 opacity-75"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded">
                           <div className="w-6 h-6 bg-blue-800 rounded-sm"></div>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{paypalConnected ? "PayPal Connected" : "PayPal"}</p>
                          <p className={cn("text-xs", paypalConnected ? "text-green-400" : "text-muted-foreground")}>
                            {paypalConnected ? "Active • Payouts Daily" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className={paypalConnected ? "border-green-500/30 text-green-400 hover:bg-green-500/20" : ""}>
                        {paypalConnected ? "Manage" : "Connect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tiers Tab */}
              <TabsContent value="tiers" className="space-y-6 mt-0">
                <div className="grid gap-4 md:grid-cols-3">
                  {tiers.map((tier, i) => (
                    <Card 
                      key={tier.id} 
                      className={cn(
                        "bg-card/40 backdrop-blur-sm relative overflow-hidden",
                        tier.isPopular 
                          ? "border-primary/50 shadow-[0_0_15px_rgba(240,165,0,0.1)]" 
                          : tierBorderColors[i] ?? "border-border/50"
                      )}
                    >
                      {tier.isPopular && (
                        <div className="absolute top-0 right-0 px-2 py-1 bg-primary text-[10px] font-bold uppercase">Popular</div>
                      )}
                      <div className={cn("absolute top-0 left-0 w-1 h-full", tierColors[i] ?? "bg-zinc-400")} />
                      <CardHeader>
                        <CardTitle>{tier.name}</CardTitle>
                        <div className="text-2xl font-bold">${tier.price.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          {(tier.perks ?? []).map((perk, j) => (
                            <li key={j}>• {perk}</li>
                          ))}
                        </ul>
                        <Button 
                          variant={tier.isPopular ? "default" : "outline"} 
                          className={cn(
                            "w-full",
                            tier.isPopular 
                              ? "bg-primary hover:bg-primary/90" 
                              : i === 2 
                                ? "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10" 
                                : ""
                          )}
                        >
                          Edit Perks
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {tiers.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-3 text-center py-8">No tiers configured yet.</p>
                  )}
                </div>
              </TabsContent>

            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}