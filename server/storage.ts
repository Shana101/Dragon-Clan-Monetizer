// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  COSMOS DB STORAGE — Replaces PostgreSQL/Drizzle with Azure Cosmos DB     ║
// ║                                                                            ║
// ║  Required environment variable:                                            ║
// ║    COSMOS_CONNECTION — Azure Cosmos DB connection string                    ║
// ║    (AccountEndpoint=...;AccountKey=...)                                     ║
// ║                                                                            ║
// ║  Database: HeidiCore                                                       ║
// ║  Containers: dcm-users (/id), dcm-earnings (/userId),                     ║
// ║    dcm-tiers (/userId), dcm-quests (/userId),                             ║
// ║    dcm-posts (/userId), dcm-analytics (/userId)                           ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

import { CosmosClient, type Container } from "@azure/cosmos";
import { randomUUID } from "crypto";
import type {
  User, InsertUser,
  Earning, InsertEarning,
  SubscriptionTier, InsertTier,
  DragonQuest, InsertQuest,
  CommunityPost, InsertPost,
  AnalyticsSnapshot, InsertAnalytics,
} from "@shared/schema";

// ── IStorage interface (unchanged from PostgreSQL version) ──
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  getEarnings(userId: string): Promise<Earning[]>;
  createEarning(earning: InsertEarning): Promise<Earning>;

  getTiers(userId: string): Promise<SubscriptionTier[]>;
  createTier(tier: InsertTier): Promise<SubscriptionTier>;
  updateTier(id: string, data: Partial<SubscriptionTier>): Promise<SubscriptionTier | undefined>;

  getQuests(userId: string): Promise<DragonQuest[]>;
  createQuest(quest: InsertQuest): Promise<DragonQuest>;
  updateQuest(id: string, data: Partial<DragonQuest>): Promise<DragonQuest | undefined>;

  getPosts(userId: string): Promise<CommunityPost[]>;
  createPost(post: InsertPost): Promise<CommunityPost>;
  likePost(id: string): Promise<CommunityPost | undefined>;

  getAnalytics(userId: string, metric?: string): Promise<AnalyticsSnapshot[]>;
  createAnalytics(snapshot: InsertAnalytics): Promise<AnalyticsSnapshot>;
}

// ── Cosmos DB connection ──
const COSMOS_CONNECTION = process.env.COSMOS_CONNECTION || "";
const DB_NAME = "HeidiCore";

const client = new CosmosClient(COSMOS_CONNECTION);
const database = client.database(DB_NAME);

// Container references
const usersC: Container      = database.container("dcm-users");
const earningsC: Container   = database.container("dcm-earnings");
const tiersC: Container      = database.container("dcm-tiers");
const questsC: Container     = database.container("dcm-quests");
const postsC: Container      = database.container("dcm-posts");
const analyticsC: Container  = database.container("dcm-analytics");

// ── Helper: strip Cosmos metadata from docs ──
function clean<T>(doc: any): T {
  if (!doc) return doc;
  const { _rid, _self, _etag, _attachments, _ts, ...rest } = doc;
  return rest as T;
}

// ══════════════════════════════════════════════════════════════════════════════
// COSMOS STORAGE CLASS
// ══════════════════════════════════════════════════════════════════════════════
export class CosmosStorage implements IStorage {

  // ── USERS (partition key: /id) ──
  async getUser(id: string): Promise<User | undefined> {
    try {
      const { resource } = await usersC.item(id, id).read();
      return resource ? clean<User>(resource) : undefined;
    } catch (e: any) {
      if (e.code === 404) return undefined;
      throw e;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { resources } = await usersC.items
      .query({
        query: "SELECT * FROM c WHERE c.username = @username",
        parameters: [{ name: "@username", value: username }],
      })
      .fetchAll();
    return resources.length > 0 ? clean<User>(resources[0]) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: randomUUID(),
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName || "Creator",
      bio: "",
      avatarUrl: "",
      level: 1,
      dragonPoints: 0,
      pointsTier: "Bronze",
      heidiAutonomy: 60,
      heidiPersonality: "professional",
      heidiVoice: "v2",
      autoClip: true,
      autoComment: false,
      stripeConnected: false,
      paypalConnected: false,
    };
    const { resource } = await usersC.items.upsert(user);
    return clean<User>(resource);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, id }; // ensure id stays
    const { resource } = await usersC.items.upsert(updated);
    return clean<User>(resource);
  }

  // ── EARNINGS (partition key: /userId) ──
  async getEarnings(userId: string): Promise<Earning[]> {
    const { resources } = await earningsC.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC",
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();
    return resources.map((r: any) => clean<Earning>(r));
  }

  async createEarning(earning: InsertEarning): Promise<Earning> {
    const doc: Earning = {
      id: randomUUID(),
      userId: earning.userId,
      type: earning.type,
      amount: earning.amount,
      source: earning.source,
      description: earning.description || "",
      createdAt: new Date().toISOString(),
    };
    const { resource } = await earningsC.items.upsert(doc);
    return clean<Earning>(resource);
  }

  // ── SUBSCRIPTION TIERS (partition key: /userId) ──
  async getTiers(userId: string): Promise<SubscriptionTier[]> {
    const { resources } = await tiersC.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();
    return resources.map((r: any) => clean<SubscriptionTier>(r));
  }

  async createTier(tier: InsertTier): Promise<SubscriptionTier> {
    const doc: SubscriptionTier = {
      id: randomUUID(),
      userId: tier.userId,
      name: tier.name,
      price: tier.price,
      perks: tier.perks || [],
      isPopular: tier.isPopular ?? false,
      subscriberCount: tier.subscriberCount ?? 0,
    };
    const { resource } = await tiersC.items.upsert(doc);
    return clean<SubscriptionTier>(resource);
  }

  async updateTier(id: string, data: Partial<SubscriptionTier>): Promise<SubscriptionTier | undefined> {
    // Cross-partition query to find by id
    const { resources } = await tiersC.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();
    if (resources.length === 0) return undefined;
    const existing = clean<SubscriptionTier>(resources[0]);
    const updated = { ...existing, ...data, id };
    const { resource } = await tiersC.items.upsert(updated);
    return clean<SubscriptionTier>(resource);
  }

  // ── DRAGON QUESTS (partition key: /userId) ──
  async getQuests(userId: string): Promise<DragonQuest[]> {
    const { resources } = await questsC.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();
    return resources.map((r: any) => clean<DragonQuest>(r));
  }

  async createQuest(quest: InsertQuest): Promise<DragonQuest> {
    const doc: DragonQuest = {
      id: randomUUID(),
      userId: quest.userId,
      title: quest.title,
      reward: quest.reward,
      progress: quest.progress ?? 0,
      target: quest.target ?? 100,
      status: quest.status ?? "active",
    };
    const { resource } = await questsC.items.upsert(doc);
    return clean<DragonQuest>(resource);
  }

  async updateQuest(id: string, data: Partial<DragonQuest>): Promise<DragonQuest | undefined> {
    const { resources } = await questsC.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();
    if (resources.length === 0) return undefined;
    const existing = clean<DragonQuest>(resources[0]);
    const updated = { ...existing, ...data, id };
    const { resource } = await questsC.items.upsert(updated);
    return clean<DragonQuest>(resource);
  }

  // ── COMMUNITY POSTS (partition key: /userId) ──
  async getPosts(userId: string): Promise<CommunityPost[]> {
    const { resources } = await postsC.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC",
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();
    return resources.map((r: any) => clean<CommunityPost>(r));
  }

  async createPost(post: InsertPost): Promise<CommunityPost> {
    const doc: CommunityPost = {
      id: randomUUID(),
      userId: post.userId,
      authorName: post.authorName,
      authorAvatar: post.authorAvatar || "",
      authorTier: post.authorTier || "Free",
      content: post.content,
      likes: post.likes ?? 0,
      replies: post.replies ?? 0,
      createdAt: new Date().toISOString(),
    };
    const { resource } = await postsC.items.upsert(doc);
    return clean<CommunityPost>(resource);
  }

  async likePost(id: string): Promise<CommunityPost | undefined> {
    const { resources } = await postsC.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();
    if (resources.length === 0) return undefined;
    const existing = clean<CommunityPost>(resources[0]);
    const updated = { ...existing, likes: existing.likes + 1 };
    const { resource } = await postsC.items.upsert(updated);
    return clean<CommunityPost>(resource);
  }

  // ── ANALYTICS SNAPSHOTS (partition key: /userId) ──
  async getAnalytics(userId: string, metric?: string): Promise<AnalyticsSnapshot[]> {
    let query: string;
    const params: any[] = [{ name: "@userId", value: userId }];

    if (metric) {
      query = "SELECT * FROM c WHERE c.userId = @userId AND c.metric = @metric ORDER BY c.createdAt DESC";
      params.push({ name: "@metric", value: metric });
    } else {
      query = "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC";
    }

    const { resources } = await analyticsC.items
      .query({ query, parameters: params })
      .fetchAll();
    return resources.map((r: any) => clean<AnalyticsSnapshot>(r));
  }

  async createAnalytics(snapshot: InsertAnalytics): Promise<AnalyticsSnapshot> {
    const doc: AnalyticsSnapshot = {
      id: randomUUID(),
      userId: snapshot.userId,
      metric: snapshot.metric,
      value: snapshot.value,
      label: snapshot.label,
      createdAt: new Date().toISOString(),
    };
    const { resource } = await analyticsC.items.upsert(doc);
    return clean<AnalyticsSnapshot>(resource);
  }
}

export const storage = new CosmosStorage();
