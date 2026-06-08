import Anthropic from "@anthropic-ai/sdk";
import { GeneratedPost, type GeneratedPost as TGeneratedPost, type DraftType } from "../db/schema.ts";
import { buildSystemPrompt, loadBrandProfile, type BrandProfile } from "./brandProfile.ts";
import { buildUserPrompt, type NewsContext } from "./templates.ts";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

let cachedSystemPrompt: string | null = null;
let cachedProfile: BrandProfile | null = null;

async function getSystemPrompt(): Promise<string> {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  cachedProfile = cachedProfile || loadBrandProfile();
  cachedSystemPrompt = await buildSystemPrompt(cachedProfile);
  return cachedSystemPrompt;
}

export interface GenerateResult {
  post: TGeneratedPost;
  cacheReadTokens: number;
  cacheCreateTokens: number;
}

/**
 * Tek bir Claude çağrısıyla TR + EN gönderi üretir.
 * Statik marka profili system bloğu prompt caching ile işaretlenir (cache_control).
 */
export async function generatePost(type: DraftType, ctx?: NewsContext): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY tanımlı değil (.env)");

  const client = new Anthropic({ apiKey });
  const system = await getSystemPrompt();
  const userPrompt = buildUserPrompt(type, ctx);

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: system,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const post = GeneratedPost.parse(extractJson(text));

  const usage = res.usage as any;
  return {
    post,
    cacheReadTokens: usage?.cache_read_input_tokens ?? 0,
    cacheCreateTokens: usage?.cache_creation_input_tokens ?? 0,
  };
}

/** Modelin etrafına metin koyma ihtimaline karşı ilk JSON nesnesini ayıklar. */
export function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Yanıtta JSON bulunamadı");
  return JSON.parse(candidate.slice(start, end + 1));
}
