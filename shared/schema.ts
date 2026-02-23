// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  SHARED SCHEMA — Pure TypeScript interfaces (ported from PostgreSQL/Drizzle)║
// ║  Now backed by Azure Cosmos DB instead of PostgreSQL.                      ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ── USER ──
export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  level: number;
  dragonPoints: number;
  pointsTier: string;
  heidiAutonomy: number;
  heidiPersonality: string;
  heidiVoice: string;
  autoClip: boolean;
  autoComment: boolean;
  stripeConnected: boolean;
  paypalConnected: boolean;
}

export interface InsertUser {
  username: string;
  password: string;
  displayName?: string;
}

// ── EARNING ──
export interface Earning {
  id: string;
  userId: string;
  type: string;       // subscription, tip, ad, merch
  amount: number;
  source: string;     // username or label
  description: string;
  createdAt: string;   // ISO date string
}

export interface InsertEarning {
  userId: string;
  type: string;
  amount: number;
  source: string;
  description?: string;
}

// ── SUBSCRIPTION TIER ──
export interface SubscriptionTier {
  id: string;
  userId: string;
  name: string;
  price: number;
  perks: string[];
  isPopular: boolean;
  subscriberCount: number;
}

export interface InsertTier {
  userId: string;
  name: string;
  price: number;
  perks: string[];
  isPopular?: boolean;
  subscriberCount?: number;
}

// ── DRAGON QUEST ──
export interface DragonQuest {
  id: string;
  userId: string;
  title: string;
  reward: number;
  progress: number;
  target: number;
  status: string;   // active, claimed
}

export interface InsertQuest {
  userId: string;
  title: string;
  reward: number;
  progress?: number;
  target?: number;
  status?: string;
}

// ── COMMUNITY POST ──
export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorTier: string;
  content: string;
  likes: number;
  replies: number;
  createdAt: string;   // ISO date string
}

export interface InsertPost {
  userId: string;
  authorName: string;
  authorAvatar?: string;
  authorTier?: string;
  content: string;
  likes?: number;
  replies?: number;
}

// ── ANALYTICS SNAPSHOT ──
export interface AnalyticsSnapshot {
  id: string;
  userId: string;
  metric: string;    // viewers, likes, comments
  value: number;
  label: string;
  createdAt: string;  // ISO date string
}

export interface InsertAnalytics {
  userId: string;
  metric: string;
  value: number;
  label: string;
}
