import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// ── Redis De-Dupe Registration ──
// Registers new users with the cross-system Redis cache for email deduplication.
const REDIS_CACHE_URL = "https://heidi-dev-functions.azurewebsites.net/api/cache/register";

async function registerWithRedisCache(email: string, creatorId: string): Promise<void> {
  try {
    const resp = await fetch(REDIS_CACHE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, creatorId, system: "dcm" }),
    });
    const data = await resp.json();
    console.log(`[redis-cache] Registered ${email} → dcm (status ${resp.status}, systems: ${JSON.stringify(data.systems || [])})`);
  } catch (err: any) {
    // Non-fatal — log but don't block user creation
    console.warn(`[redis-cache] Failed to register ${email}: ${err.message}`);
  }
}

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  AZURE OPENAI INTEGRATION — see server/azure-openai.ts for full details   ║
// ║  Required secrets (set in Replit Secrets tab before publishing):           ║
// ║    • AZURE_OPENAI_API_KEY                                                  ║
// ║    • AZURE_OPENAI_ENDPOINT                                                 ║
// ║    • AZURE_OPENAI_DEPLOYMENT_NAME                                          ║
// ║                                                                            ║
// ║  Optional (for future features):                                           ║
// ║    • AZURE_SPEECH_KEY / AZURE_SPEECH_REGION — Voice synthesis              ║
// ║    • AZURE_CONTENT_SAFETY_KEY / AZURE_CONTENT_SAFETY_ENDPOINT              ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
import {
  isAzureConfigured,
  heidiGenerate,
  generateAdRead,
  generateCommentReply,
  generateClipPost,
  analyzeSponsorship,
  generateCourseOutline,
} from "./azure-openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── USER / PROFILE ──
  app.get("/api/user/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = user;
    res.json(safe);
  });

  app.patch("/api/user/:id", async (req, res) => {
    const updated = await storage.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = updated;
    res.json(safe);
  });

  // ── EARNINGS ──
  app.get("/api/earnings/:userId", async (req, res) => {
    const rows = await storage.getEarnings(req.params.userId);
    res.json(rows);
  });

  app.post("/api/earnings", async (req, res) => {
    const row = await storage.createEarning(req.body);
    res.status(201).json(row);
  });

  // ── SUBSCRIPTION TIERS ──
  app.get("/api/tiers/:userId", async (req, res) => {
    const rows = await storage.getTiers(req.params.userId);
    res.json(rows);
  });

  app.post("/api/tiers", async (req, res) => {
    const row = await storage.createTier(req.body);
    res.status(201).json(row);
  });

  app.patch("/api/tiers/:id", async (req, res) => {
    const row = await storage.updateTier(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Tier not found" });
    res.json(row);
  });

  // ── DRAGON QUESTS ──
  app.get("/api/quests/:userId", async (req, res) => {
    const rows = await storage.getQuests(req.params.userId);
    res.json(rows);
  });

  app.post("/api/quests", async (req, res) => {
    const row = await storage.createQuest(req.body);
    res.status(201).json(row);
  });

  app.patch("/api/quests/:id", async (req, res) => {
    const row = await storage.updateQuest(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Quest not found" });
    res.json(row);
  });

  // ── COMMUNITY POSTS ──
  app.get("/api/posts/:userId", async (req, res) => {
    const rows = await storage.getPosts(req.params.userId);
    res.json(rows);
  });

  app.post("/api/posts", async (req, res) => {
    const row = await storage.createPost(req.body);
    res.status(201).json(row);
  });

  app.post("/api/posts/:id/like", async (req, res) => {
    const row = await storage.likePost(req.params.id);
    if (!row) return res.status(404).json({ message: "Post not found" });
    res.json(row);
  });

  // ── ANALYTICS ──
  app.get("/api/analytics/:userId", async (req, res) => {
    const metric = req.query.metric as string | undefined;
    const rows = await storage.getAnalytics(req.params.userId, metric);
    res.json(rows);
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // AZURE CONNECTION POINT: Health Check
  // Verifies Azure OpenAI credentials are configured before publishing.
  // ══════════════════════════════════════════════════════════════════════════════
  app.get("/api/azure/status", async (_req, res) => {
    res.json({
      configured: isAzureConfigured(),
      message: isAzureConfigured()
        ? "Azure OpenAI is connected and ready."
        : "Azure OpenAI is NOT configured. Set AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, and AZURE_OPENAI_DEPLOYMENT_NAME in Secrets.",
    });
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // AZURE CONNECTION POINT: Heidi AI Chat
  // Powers the main Heidi assistant — free-form AI chat for creators.
  // Requires: AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME
  // ══════════════════════════════════════════════════════════════════════════════
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { prompt, personality } = req.body;
      if (!prompt) return res.status(400).json({ message: "prompt is required" });
      const reply = await heidiGenerate(prompt, personality);
      res.json({ reply });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // AZURE CONNECTION POINT: Podcast Ad Read Generator
  // Powers the "Generate Ad Read" button in Podcast Studio.
  // Requires: AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME
  // ══════════════════════════════════════════════════════════════════════════════
  app.post("/api/ai/ad-read", async (req, res) => {
    try {
      const { sponsorName, sponsorDescription, personality } = req.body;
      if (!sponsorName) return res.status(400).json({ message: "sponsorName is required" });
      const script = await generateAdRead(sponsorName, sponsorDescription || "", personality);
      res.json({ script });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // AZURE CONNECTION POINT: Auto Comment Reply
  // Powers the Comment Responder in Community Hub.
  // Requires: AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME
  // ══════════════════════════════════════════════════════════════════════════════
  app.post("/api/ai/reply", async (req, res) => {
    try {
      const { comment, personality } = req.body;
      if (!comment) return res.status(400).json({ message: "comment is required" });
      const reply = await generateCommentReply(comment, personality);
      res.json({ reply });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // AZURE CONNECTION POINT: Social Clip Post Generator
  // Powers the Clip Hunter & Auto-Promoter tools.
  // Requires: AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME
  // ══════════════════════════════════════════════════════════════════════════════
  app.post("/api/ai/clip-post", async (req, res) => {
    try {
      const { clipDescription, platform } = req.body;
      if (!clipDescription) return res.status(400).json({ message: "clipDescription is required" });
      const post = await generateClipPost(clipDescription, platform || "twitter");
      res.json({ post });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // AZURE CONNECTION POINT: Sponsor Match Analyzer
  // Powers the Sponsor Match tool — analyzes creator + audience fit.
  // Requires: AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME
  // ══════════════════════════════════════════════════════════════════════════════
  app.post("/api/ai/sponsor-match", async (req, res) => {
    try {
      const { creatorBio, audienceData } = req.body;
      if (!creatorBio) return res.status(400).json({ message: "creatorBio is required" });
      const analysis = await analyzeSponsorship(creatorBio, audienceData || "General gaming audience");
      res.json({ analysis });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // AZURE CONNECTION POINT: Course Outline Generator
  // Powers the Course Architect tool.
  // Requires: AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME
  // ══════════════════════════════════════════════════════════════════════════════
  app.post("/api/ai/course-outline", async (req, res) => {
    try {
      const { topic, expertise } = req.body;
      if (!topic) return res.status(400).json({ message: "topic is required" });
      const outline = await generateCourseOutline(topic, expertise || "intermediate");
      res.json({ outline });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── SEED: Bootstrap a demo user with data ──
  app.post("/api/seed", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("commander_john");
      if (user) {
        const { password, ...safe } = user;
        return res.json({ message: "Already seeded", user: safe });
      }

      user = await storage.createUser({
        username: "commander_john",
        password: "dragon2026",
        displayName: "Commander John",
      });

      // Register with Redis de-dupe cache
      await registerWithRedisCache("commander_john@dragonclantv.ai", user.id);

      await storage.updateUser(user.id, {
        level: 42,
        dragonPoints: 45200,
        pointsTier: "Gold",
        bio: "Building the next generation of content. Powered by Heidi AI.",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        stripeConnected: true,
      });

      const earningsSeed = [
        { userId: user.id, type: "subscription", amount: 19.99, source: "CryptoKing99", description: "Tier 2 Sub" },
        { userId: user.id, type: "tip", amount: 50.00, source: "Sarah_Gamer", description: "Thank you tip" },
        { userId: user.id, type: "ad", amount: 12.50, source: "Pre-roll Placement", description: "Ad revenue" },
        { userId: user.id, type: "subscription", amount: 4.99, source: "TechNinja", description: "Tier 1 Sub" },
        { userId: user.id, type: "merch", amount: 34.99, source: "PixelArtist", description: "Dragon T-Shirt" },
        { userId: user.id, type: "tip", amount: 10.00, source: "SpeedRunnerX", description: "Quick tip" },
        { userId: user.id, type: "subscription", amount: 9.99, source: "AIEnthusiast", description: "Tier 2 Sub" },
        { userId: user.id, type: "ad", amount: 25.00, source: "Mid-roll Placement", description: "Ad revenue" },
      ];
      for (const e of earningsSeed) {
        await storage.createEarning(e);
      }

      await storage.createTier({ userId: user.id, name: "Supporter", price: 1.99, perks: ["Ad-free viewing", "Supporter Badge"], isPopular: false, subscriberCount: 520 });
      await storage.createTier({ userId: user.id, name: "Super Fan", price: 4.99, perks: ["All Supporter perks", "Exclusive Discord Role", "Early Access to VODs"], isPopular: true, subscriberCount: 340 });
      await storage.createTier({ userId: user.id, name: "Inner Circle", price: 19.99, perks: ["All Super Fan perks", "Monthly Q&A Call", "Merch Discounts", "Private Chat"], isPopular: false, subscriberCount: 80 });

      await storage.createQuest({ userId: user.id, title: "Stream for 2 hours", reward: 500, progress: 100, target: 100, status: "claimed" });
      await storage.createQuest({ userId: user.id, title: "Clip 3 viral moments", reward: 300, progress: 66, target: 100, status: "active" });
      await storage.createQuest({ userId: user.id, title: "Refer a creator", reward: 1000, progress: 0, target: 100, status: "active" });
      await storage.createQuest({ userId: user.id, title: "Sell 5 merch items", reward: 750, progress: 20, target: 100, status: "active" });

      const postAuthors = [
        { name: "SuperFan_1", avatar: "https://i.pravatar.cc/150?u=1", tier: "Tier 3 Sub" },
        { name: "DragonSlayer", avatar: "https://i.pravatar.cc/150?u=2", tier: "Tier 2 Sub" },
        { name: "NightOwl_X", avatar: "https://i.pravatar.cc/150?u=3", tier: "Tier 1 Sub" },
      ];
      const postContents = [
        "This latest episode was absolutely insane! The AI clone voice is getting so realistic I can hardly tell the difference anymore. @DragonClan forever!",
        "Just signed up for the Inner Circle tier and the Q&A session was worth every penny. Commander John really knows how to engage with the community.",
        "Anyone else think the Heidi AI merch designs are getting better every week? Just ordered two t-shirts and a poster. The dragon scale one is fire!",
      ];
      for (let i = 0; i < 3; i++) {
        await storage.createPost({
          userId: user.id,
          authorName: postAuthors[i].name,
          authorAvatar: postAuthors[i].avatar,
          authorTier: postAuthors[i].tier,
          content: postContents[i],
          likes: Math.floor(Math.random() * 300) + 50,
          replies: Math.floor(Math.random() * 20),
        });
      }

      const viewerLabels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"];
      const viewerValues = [1200, 800, 2400, 4500, 6800, 9200, 3400];
      for (let i = 0; i < viewerLabels.length; i++) {
        await storage.createAnalytics({ userId: user.id, metric: "viewers", value: viewerValues[i], label: viewerLabels[i] });
      }

      const engDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const likesVals = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
      const commentsVals = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
      for (let i = 0; i < engDays.length; i++) {
        await storage.createAnalytics({ userId: user.id, metric: "likes", value: likesVals[i], label: engDays[i] });
        await storage.createAnalytics({ userId: user.id, metric: "comments", value: commentsVals[i], label: engDays[i] });
      }

      const { password, ...safe } = user;
      res.status(201).json({ message: "Seeded successfully", user: safe });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  return httpServer;
}
