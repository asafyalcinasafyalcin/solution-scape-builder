import { z } from "zod";

// --- Paylaşımlı enumlar ---
export const Lang = z.enum(["tr", "en"]);
export type Lang = z.infer<typeof Lang>;

export const DraftType = z.enum(["news_commentary", "promo", "quote"]);
export type DraftType = z.infer<typeof DraftType>;

// Paylaşım hedefi: ProcessTürk şirket sayfası, kişisel profil, veya her ikisi.
export const Target = z.enum(["company", "personal", "both"]);
export type Target = z.infer<typeof Target>;

export const DraftStatus = z.enum([
  "pending_review", // AI üretti, onay bekliyor
  "approved", // onaylandı (Faz 1: kopyala-yapıştır hazır)
  "scheduled", // ileri tarihe planlandı
  "published", // yayınlandı (Faz 2/3) veya elle paylaşıldı olarak işaretlendi
  "rejected", // reddedildi
]);
export type DraftStatus = z.infer<typeof DraftStatus>;

// --- Haber öğesi ---
export const NewsItem = z.object({
  id: z.string(),
  source: z.string(),
  url: z.string().url(),
  title: z.string(),
  summary: z.string(),
  publishedAt: z.string(), // ISO 8601
  lang: Lang,
  topicTags: z.array(z.string()),
  hash: z.string(), // tekilleştirme için
  usedAt: z.string().nullable(), // taslak üretildiğinde işaretlenir
  createdAt: z.string(),
});
export type NewsItem = z.infer<typeof NewsItem>;

// --- Taslak ---
export const Draft = z.object({
  id: z.string(),
  newsItemId: z.string().nullable(), // özgün gönderilerde null olabilir
  type: DraftType,
  lang: Lang,
  hook: z.string(),
  body: z.string(),
  hashtags: z.array(z.string()),
  suggestedTarget: Target,
  status: DraftStatus,
  editedBody: z.string().nullable(), // kullanıcı düzenlemesi
  scheduledFor: z.string().nullable(), // ISO 8601
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Draft = z.infer<typeof Draft>;

// --- Yayın kaydı ---
export const PostLog = z.object({
  id: z.string(),
  draftId: z.string(),
  target: Target,
  platform: z.string(), // "linkedin" | "manual" | "x"
  externalPostId: z.string().nullable(),
  postedAt: z.string(),
  status: z.enum(["success", "manual", "error"]),
  error: z.string().nullable(),
});
export type PostLog = z.infer<typeof PostLog>;

// --- AI üretim çıktısı sözleşmesi (tek dil) ---
export const GeneratedVariant = z.object({
  hook: z.string().min(1),
  body: z.string().min(1),
  hashtags: z.array(z.string()).min(2).max(6),
  suggestedTarget: Target,
});
export type GeneratedVariant = z.infer<typeof GeneratedVariant>;

// AI bir çağrıda TR + EN döndürür
export const GeneratedPost = z.object({
  tr: GeneratedVariant,
  en: GeneratedVariant,
});
export type GeneratedPost = z.infer<typeof GeneratedPost>;

// --- SQLite DDL ---
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS news_items (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  published_at TEXT NOT NULL,
  lang TEXT NOT NULL,
  topic_tags TEXT NOT NULL DEFAULT '[]',
  hash TEXT NOT NULL UNIQUE,
  used_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  news_item_id TEXT REFERENCES news_items(id),
  type TEXT NOT NULL,
  lang TEXT NOT NULL,
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  hashtags TEXT NOT NULL DEFAULT '[]',
  suggested_target TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  edited_body TEXT,
  scheduled_for TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS post_log (
  id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL REFERENCES drafts(id),
  target TEXT NOT NULL,
  platform TEXT NOT NULL,
  external_post_id TEXT,
  posted_at TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_drafts_status ON drafts(status);
CREATE INDEX IF NOT EXISTS idx_news_used ON news_items(used_at);
`;
