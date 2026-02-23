import { Layout } from "@/components/layout/Layout";
import { ToolCard } from "@/components/dashboard/ToolCard";
import { 
  Mic2, Shirt, Video, GraduationCap, Briefcase, Lock, 
  Palette, Music, MessageSquare, Globe, Camera, Code 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HeidiTools() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-display font-bold">Heidi Tools</h1>
          <p className="text-muted-foreground">The complete AI arsenal for next-gen creators.</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-secondary/50 border border-border/50">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="monetization">Monetization</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ToolCard 
                title="Podcast Studio" 
                description="Full AI production suite with clones."
                icon={Mic2}
                status="active"
                actionLabel="Open Studio"
                onAction={() => window.location.href = "/tools/podcast-studio"}
              />
              <ToolCard 
                title="Merch Forge" 
                description="AI-generated designs from content."
                icon={Shirt}
                status="active"
              />
              <ToolCard 
                title="Clip Hunter" 
                description="Viral moment detection & clipping."
                icon={Video}
                status="active"
              />
              <ToolCard 
                title="Sponsor Match" 
                description="Auto-negotiate brand deals."
                icon={Briefcase}
                status="active"
              />
              <ToolCard 
                title="Course Architect" 
                description="Turn knowledge into curriculum."
                icon={GraduationCap}
                status="beta"
              />
              <ToolCard 
                title="Content Safe" 
                description="Blockchain IP verification."
                icon={Lock}
                status="active"
              />
              <ToolCard 
                title="Thumbnail Gen" 
                description="High-CTR thumbnail creation."
                icon={Palette}
                status="active"
              />
              <ToolCard 
                title="Music Synth" 
                description="Royalty-free beat generation."
                icon={Music}
                status="coming-soon"
              />
              <ToolCard 
                title="Comment Bot" 
                description="Auto-engage with top fans."
                icon={MessageSquare}
                status="beta"
              />
              <ToolCard 
                title="Translation" 
                description="Dub content into 20+ languages."
                icon={Globe}
                status="coming-soon"
              />
            </div>
          </TabsContent>
          {/* We can duplicate content for other tabs for the mockup */}
        </Tabs>
      </div>
    </Layout>
  );
}