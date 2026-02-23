// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                    AZURE OPENAI INTEGRATION MODULE                         ║
// ║                                                                            ║
// ║  This file centralizes all Azure OpenAI connections for the Heidi AI       ║
// ║  features across the platform. Before publishing, you must set three       ║
// ║  environment variables (Secrets tab in Replit):                            ║
// ║                                                                            ║
// ║  1. AZURE_OPENAI_API_KEY         — Your Azure OpenAI resource key          ║
// ║     Found in: Azure Portal > Your OpenAI resource > Keys and Endpoint      ║
// ║                                                                            ║
// ║  2. AZURE_OPENAI_ENDPOINT        — Your resource endpoint URL              ║
// ║     Example: https://your-resource-name.openai.azure.com                   ║
// ║     Found in: Azure Portal > Your OpenAI resource > Keys and Endpoint      ║
// ║                                                                            ║
// ║  3. AZURE_OPENAI_DEPLOYMENT_NAME — Your model deployment name              ║
// ║     Example: gpt-4, gpt-35-turbo, gpt-4o                                  ║
// ║     Found in: Azure AI Studio > Deployments > Your deployment name         ║
// ║                                                                            ║
// ║  Optional (for future use):                                                ║
// ║  4. AZURE_OPENAI_API_VERSION     — API version (default: 2024-02-01)       ║
// ║  5. AZURE_SPEECH_KEY             — For voice synthesis (Podcast Studio)     ║
// ║  6. AZURE_SPEECH_REGION          — Azure region for Speech Services         ║
// ║  7. AZURE_CONTENT_SAFETY_KEY     — For content moderation                  ║
// ║  8. AZURE_CONTENT_SAFETY_ENDPOINT — Content Safety endpoint                ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || "2024-02-01";

// ── Check if Azure OpenAI is configured ──
export function isAzureConfigured(): boolean {
  return !!(AZURE_OPENAI_API_KEY && AZURE_OPENAI_ENDPOINT && AZURE_OPENAI_DEPLOYMENT_NAME);
}

// ── Build the Azure OpenAI completions URL ──
function getCompletionsUrl(): string {
  return `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;
}

// ══════════════════════════════════════════════════════════════════════════════
// AZURE CONNECTION POINT #1: Chat Completions
// Used by: Heidi AI Assistant, Comment Responder, Sponsor Match suggestions
// This sends a chat prompt to your Azure OpenAI deployment and returns the
// AI-generated response.
// ══════════════════════════════════════════════════════════════════════════════
export async function chatCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  if (!isAzureConfigured()) {
    throw new Error(
      "Azure OpenAI is not configured. Set AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, and AZURE_OPENAI_DEPLOYMENT_NAME in your Secrets."
    );
  }

  const response = await fetch(getCompletionsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_OPENAI_API_KEY!,
    },
    body: JSON.stringify({
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Azure OpenAI error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ══════════════════════════════════════════════════════════════════════════════
// AZURE CONNECTION POINT #2: Heidi AI — Content Generation
// Used by: Ad Generator (Podcast Studio), Merch descriptions, Course outlines
// Wraps chatCompletion with a Heidi-specific system prompt.
// ══════════════════════════════════════════════════════════════════════════════
export async function heidiGenerate(
  prompt: string,
  personality: string = "professional"
): Promise<string> {
  const personalityMap: Record<string, string> = {
    professional: "You are Heidi, a professional and crisp AI assistant for content creators. Be concise and actionable.",
    hype: "You are Heidi, a hype and energetic AI assistant! Use exclamation marks, be enthusiastic and motivating!",
    sarcastic: "You are Heidi, a witty and sarcastic AI assistant. Be clever, use dry humor, but still be helpful.",
    zen: "You are Heidi, a calm and zen AI assistant. Be thoughtful, measured, and peaceful in your responses.",
  };

  return chatCompletion([
    { role: "system", content: personalityMap[personality] || personalityMap.professional },
    { role: "user", content: prompt },
  ]);
}

// ══════════════════════════════════════════════════════════════════════════════
// AZURE CONNECTION POINT #3: Ad Read Generator
// Used by: Podcast Studio — "Generate Ad Read" button
// Takes sponsor info and generates a natural-sounding ad read script.
// ══════════════════════════════════════════════════════════════════════════════
export async function generateAdRead(
  sponsorName: string,
  sponsorDescription: string,
  hostPersonality: string = "professional"
): Promise<string> {
  return heidiGenerate(
    `Write a natural-sounding 30-second podcast ad read for "${sponsorName}". 
     Product description: ${sponsorDescription}. 
     Make it conversational, not salesy. Include a call-to-action.`,
    hostPersonality
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AZURE CONNECTION POINT #4: Comment Auto-Responder
// Used by: Community Hub — auto-reply to fan comments
// Generates contextual, on-brand replies to community posts.
// ══════════════════════════════════════════════════════════════════════════════
export async function generateCommentReply(
  originalComment: string,
  hostPersonality: string = "professional"
): Promise<string> {
  return heidiGenerate(
    `A fan posted this comment: "${originalComment}"
     Write a short, authentic reply (1-2 sentences) as the creator. Be genuine and engaging.`,
    hostPersonality
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AZURE CONNECTION POINT #5: Clip Description & Social Post Generator
// Used by: Clip Hunter tool, Auto-Promoter (Podcast Studio)
// Generates social media copy for clips across platforms.
// ══════════════════════════════════════════════════════════════════════════════
export async function generateClipPost(
  clipDescription: string,
  platform: "tiktok" | "youtube" | "twitter"
): Promise<string> {
  const platformGuidance: Record<string, string> = {
    tiktok: "Write a catchy TikTok caption with trending hashtags. Keep it under 150 characters.",
    youtube: "Write a YouTube Shorts title and description. Be searchable and click-worthy.",
    twitter: "Write a Twitter/X post. Be punchy, use 1-2 relevant hashtags. Under 280 characters.",
  };

  return heidiGenerate(
    `Generate a social media post for this clip: "${clipDescription}". 
     Platform: ${platform}. ${platformGuidance[platform]}`,
    "hype"
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AZURE CONNECTION POINT #6: Sponsor Match Analysis
// Used by: Sponsor Match tool
// Analyzes creator content/audience and suggests brand partnership ideas.
// ══════════════════════════════════════════════════════════════════════════════
export async function analyzeSponsorship(
  creatorBio: string,
  audienceData: string
): Promise<string> {
  return heidiGenerate(
    `As a brand partnership analyst, analyze this creator profile and suggest 3 ideal sponsor matches:
     Creator bio: ${creatorBio}
     Audience info: ${audienceData}
     For each sponsor, provide: Brand name, Why it's a fit, Estimated CPM range, Pitch angle.`,
    "professional"
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AZURE CONNECTION POINT #7: Course Outline Generator
// Used by: Course Architect tool
// Generates a structured course curriculum from a topic.
// ══════════════════════════════════════════════════════════════════════════════
export async function generateCourseOutline(
  topic: string,
  expertise: string
): Promise<string> {
  return heidiGenerate(
    `Create a detailed online course outline for teaching "${topic}".
     Creator's expertise level: ${expertise}.
     Include: Course title, 5-8 modules with lesson names, estimated duration per module, 
     and a compelling course description for the sales page.`,
    "professional"
  );
}
