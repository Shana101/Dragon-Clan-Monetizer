import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Heart, Share2, MoreHorizontal, Search, Loader2, Wand2 } from "lucide-react";
import { usePosts, useLikePost, useCreatePost, getUserId, useAiCommentReply } from "@/lib/hooks";
import { useState } from "react";

function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

export default function Community() {
  const { data: posts, isLoading } = usePosts();
  const likePost = useLikePost();
  const aiReply = useAiCommentReply();
  const [aiReplies, setAiReplies] = useState<Record<string, string>>({});

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Community Hub</h1>
            <p className="text-muted-foreground">Manage your fanbase and engagement.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search comments..." className="pl-10 w-64 bg-secondary/50" />
            </div>
            <Button>Broadcast Message</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {posts && posts.length > 0 ? posts.map((post) => (
              <Card key={post.id} className="bg-card/40 border-border/50 backdrop-blur-sm" data-testid={`card-post-${post.id}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.authorAvatar || undefined} />
                        <AvatarFallback>{post.authorName?.charAt(0) ?? "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-sm hover:text-primary cursor-pointer" data-testid={`text-author-${post.id}`}>{post.authorName}</h4>
                        <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)} • {post.authorTier} Sub</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                  </div>
                  
                  <p className="text-sm leading-relaxed" data-testid={`text-content-${post.id}`}>
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-red-500"
                      onClick={() => likePost.mutate(post.id)}
                      disabled={likePost.isPending}
                      data-testid={`button-like-${post.id}`}
                    >
                      <Heart className="w-4 h-4 mr-2" /> {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                      <MessageSquare className="w-4 h-4 mr-2" /> {post.replies > 0 ? post.replies : "Reply"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-purple-500"
                      onClick={() => {
                        aiReply.mutate(
                          { comment: post.content },
                          { onSuccess: (data) => setAiReplies((prev) => ({ ...prev, [post.id]: data.reply })) }
                        );
                      }}
                      disabled={aiReply.isPending}
                    >
                      <Wand2 className="w-4 h-4 mr-2" /> {aiReply.isPending ? "Thinking..." : "AI Reply"}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                  </div>
                  {aiReplies[post.id] && (
                    <div className="mt-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <p className="text-xs text-purple-400 font-bold mb-1">AI-Generated Reply</p>
                      <p className="text-sm text-muted-foreground">{aiReplies[post.id]}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )) : (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            )}
          </div>

          {/* Side Panel: Top Fans */}
          <div className="space-y-6">
            <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "CryptoKing99", points: "15,400 DP", rank: 1 },
                  { name: "PixelArtist", points: "12,200 DP", rank: 2 },
                  { name: "SpeedRunnerX", points: "9,800 DP", rank: 3 },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-bold font-mono text-muted-foreground">
                        #{user.rank}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${i+10}`} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-sm">{user.name}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{user.points}</span>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">View Leaderboard</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-purple-900/20 border-primary/30">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="font-display font-bold text-xl">Community Challenge</h3>
                <p className="text-sm text-muted-foreground">Get 500 comments on your next post to unlock a global XP boost!</p>
                <Progress value={65} className="h-2 bg-black/40" />
                <p className="text-xs font-mono text-primary">325/500 Comments</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </Layout>
  );
}