import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { queryClient } from "./queryClient";
import type { User, Earning, SubscriptionTier, DragonQuest, CommunityPost, AnalyticsSnapshot } from "@shared/schema";

const DEMO_USER_ID_KEY = "dragon_clan_user_id";

export function getUserId(): string | null {
  return localStorage.getItem(DEMO_USER_ID_KEY);
}

export function setUserId(id: string) {
  localStorage.setItem(DEMO_USER_ID_KEY, id);
}

export function useSeedAndGetUser() {
  return useQuery<Omit<User, "password">>({
    queryKey: ["/api/seed-check"],
    queryFn: async () => {
      let userId = getUserId();
      if (!userId) {
        const res = await apiRequest("POST", "/api/seed");
        const data = await res.json();
        userId = data.user.id;
        setUserId(userId!);
      }
      const userRes = await fetch(`/api/user/${userId}`);
      if (!userRes.ok) {
        localStorage.removeItem(DEMO_USER_ID_KEY);
        const res = await apiRequest("POST", "/api/seed");
        const data = await res.json();
        userId = data.user.id;
        setUserId(userId!);
        const retryRes = await fetch(`/api/user/${userId}`);
        return retryRes.json();
      }
      return userRes.json();
    },
  });
}

export function useUser() {
  const userId = getUserId();
  return useQuery<Omit<User, "password">>({
    queryKey: ["/api/user", userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const userId = getUserId();
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await apiRequest("PATCH", `/api/user/${userId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seed-check"] });
    },
  });
}

export function useEarnings() {
  const userId = getUserId();
  return useQuery<Earning[]>({
    queryKey: ["/api/earnings", userId],
    queryFn: async () => {
      const res = await fetch(`/api/earnings/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch earnings");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useTiers() {
  const userId = getUserId();
  return useQuery<SubscriptionTier[]>({
    queryKey: ["/api/tiers", userId],
    queryFn: async () => {
      const res = await fetch(`/api/tiers/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch tiers");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUpdateTier() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubscriptionTier> }) => {
      const res = await apiRequest("PATCH", `/api/tiers/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tiers"] });
    },
  });
}

export function useQuests() {
  const userId = getUserId();
  return useQuery<DragonQuest[]>({
    queryKey: ["/api/quests", userId],
    queryFn: async () => {
      const res = await fetch(`/api/quests/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch quests");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useClaimQuest() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/quests/${id}`, { status: "claimed", progress: 100 });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
    },
  });
}

export function usePosts() {
  const userId = getUserId();
  return useQuery<CommunityPost[]>({
    queryKey: ["/api/posts", userId],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: async (data: { userId: string; authorName: string; authorTier: string; content: string }) => {
      const res = await apiRequest("POST", "/api/posts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });
}

export function useLikePost() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/posts/${id}/like`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });
}

export function useAnalytics() {
  const userId = getUserId();
  return useQuery<AnalyticsSnapshot[]>({
    queryKey: ["/api/analytics", userId],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: !!userId,
  });
}

// ── AI HOOKS ──
// These connect to the 6 Azure OpenAI endpoints in server/routes.ts

/** Heidi AI Chat — free-form AI assistant for creators */
export function useAiChat() {
  return useMutation<{ reply: string }, Error, { prompt: string; personality?: string }>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ai/chat", data);
      return res.json();
    },
  });
}

/** Podcast Ad Read Generator — generates natural-sounding sponsor reads */
export function useAiAdRead() {
  return useMutation<{ script: string }, Error, { sponsorName: string; sponsorDescription?: string; personality?: string }>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ai/ad-read", data);
      return res.json();
    },
  });
}

/** Auto Comment Reply — generates contextual replies to fan comments */
export function useAiCommentReply() {
  return useMutation<{ reply: string }, Error, { comment: string; personality?: string }>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ai/reply", data);
      return res.json();
    },
  });
}

/** Social Clip Post — generates platform-specific promo copy for clips */
export function useAiClipPost() {
  return useMutation<{ post: string }, Error, { clipDescription: string; platform?: string }>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ai/clip-post", data);
      return res.json();
    },
  });
}

/** Sponsor Match Analyzer — analyzes creator + audience fit for brands */
export function useAiSponsorMatch() {
  return useMutation<{ analysis: string }, Error, { creatorBio: string; audienceData?: string }>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ai/sponsor-match", data);
      return res.json();
    },
  });
}

/** Course Outline Generator — turns expertise into structured curriculum */
export function useAiCourseOutline() {
  return useMutation<{ outline: string }, Error, { topic: string; expertise?: string }>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ai/course-outline", data);
      return res.json();
    },
  });
}
