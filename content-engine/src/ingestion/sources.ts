import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

// Ham, normalize edilmiş haber öğesi (kaynaktan gelen)
export interface RawNewsItem {
  source: string;
  url: string;
  title: string;
  summary: string;
  publishedAt: string; // ISO 8601
  lang: "tr" | "en";
  topic: string;
}

export interface NewsSource {
  /** Bu kaynaktan güncel öğeleri çeker. Hata durumunda boş dizi döner (akışı bozmaz). */
  fetch(): Promise<RawNewsItem[]>;
}

// --- Config şeması ---
const FeedConfig = z.object({
  name: z.string(),
  url: z.string(),
  lang: z.enum(["tr", "en"]),
  topic: z.string(),
  enabled: z.boolean().default(true),
});

export const NewsConfig = z.object({
  feeds: z.array(FeedConfig).default([]),
  apiSources: z.array(z.unknown()).default([]),
  keywords: z.object({
    include: z.array(z.string()).default([]),
    exclude: z.array(z.string()).default([]),
  }),
  maxItemsPerRun: z.number().default(20),
  lookbackHours: z.number().default(36),
  minScore: z.number().default(1),
});
export type NewsConfig = z.infer<typeof NewsConfig>;
export type FeedConfig = z.infer<typeof FeedConfig>;

export function loadNewsConfig(path = "./config/news-sources.json"): NewsConfig {
  const raw = JSON.parse(readFileSync(resolve(path), "utf-8"));
  return NewsConfig.parse(raw);
}
