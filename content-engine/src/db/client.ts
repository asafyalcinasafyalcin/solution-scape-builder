import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import {
  SCHEMA_SQL,
  type Draft,
  type DraftStatus,
  type NewsItem,
  type PostLog,
} from "./schema.ts";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const path = resolve(process.env.DATABASE_PATH || "./data/content-engine.db");
  if (!existsSync(dirname(path))) mkdirSync(dirname(path), { recursive: true });
  db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA_SQL);
  return db;
}

const now = () => new Date().toISOString();

// --- Satır <-> tip dönüşümü ---
function rowToNews(r: any): NewsItem {
  return {
    id: r.id,
    source: r.source,
    url: r.url,
    title: r.title,
    summary: r.summary,
    publishedAt: r.published_at,
    lang: r.lang,
    topicTags: JSON.parse(r.topic_tags),
    hash: r.hash,
    usedAt: r.used_at,
    createdAt: r.created_at,
  };
}

function rowToDraft(r: any): Draft {
  return {
    id: r.id,
    newsItemId: r.news_item_id,
    type: r.type,
    lang: r.lang,
    hook: r.hook,
    body: r.body,
    hashtags: JSON.parse(r.hashtags),
    suggestedTarget: r.suggested_target,
    status: r.status,
    editedBody: r.edited_body,
    scheduledFor: r.scheduled_for,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// --- Haberler ---
export type NewNewsItem = Omit<NewsItem, "id" | "usedAt" | "createdAt">;

/** Hash zaten varsa atlar. Eklendiyse satırı, atlandıysa null döner. */
export function insertNewsItem(item: NewNewsItem): NewsItem | null {
  const d = getDb();
  const exists = d.prepare("SELECT 1 FROM news_items WHERE hash = ?").get(item.hash);
  if (exists) return null;
  const row: NewsItem = { ...item, id: randomUUID(), usedAt: null, createdAt: now() };
  d.prepare(
    `INSERT INTO news_items (id, source, url, title, summary, published_at, lang, topic_tags, hash, used_at, created_at)
     VALUES (@id, @source, @url, @title, @summary, @publishedAt, @lang, @topicTags, @hash, @usedAt, @createdAt)`
  ).run({ ...row, topicTags: JSON.stringify(row.topicTags) });
  return row;
}

/** Henüz taslağa dönüştürülmemiş haberleri döner (en yeni önce). */
export function getUnusedNews(limit = 10): NewsItem[] {
  return getDb()
    .prepare("SELECT * FROM news_items WHERE used_at IS NULL ORDER BY published_at DESC LIMIT ?")
    .all(limit)
    .map(rowToNews);
}

export function markNewsUsed(id: string): void {
  getDb().prepare("UPDATE news_items SET used_at = ? WHERE id = ?").run(now(), id);
}

// --- Taslaklar ---
export type NewDraft = Omit<Draft, "id" | "createdAt" | "updatedAt" | "status" | "editedBody" | "scheduledFor"> &
  Partial<Pick<Draft, "status" | "editedBody" | "scheduledFor">>;

export function insertDraft(draft: NewDraft): Draft {
  const d = getDb();
  const row: Draft = {
    id: randomUUID(),
    status: "pending_review",
    editedBody: null,
    scheduledFor: null,
    createdAt: now(),
    updatedAt: now(),
    ...draft,
  };
  d.prepare(
    `INSERT INTO drafts (id, news_item_id, type, lang, hook, body, hashtags, suggested_target, status, edited_body, scheduled_for, created_at, updated_at)
     VALUES (@id, @newsItemId, @type, @lang, @hook, @body, @hashtags, @suggestedTarget, @status, @editedBody, @scheduledFor, @createdAt, @updatedAt)`
  ).run({ ...row, hashtags: JSON.stringify(row.hashtags) });
  return row;
}

export function listDrafts(status?: DraftStatus): Draft[] {
  const d = getDb();
  const rows = status
    ? d.prepare("SELECT * FROM drafts WHERE status = ? ORDER BY created_at DESC").all(status)
    : d.prepare("SELECT * FROM drafts ORDER BY created_at DESC").all();
  return rows.map(rowToDraft);
}

export function getDraft(id: string): Draft | null {
  const r = getDb().prepare("SELECT * FROM drafts WHERE id = ?").get(id);
  return r ? rowToDraft(r) : null;
}

export function updateDraft(
  id: string,
  patch: Partial<Pick<Draft, "status" | "editedBody" | "hashtags" | "suggestedTarget" | "scheduledFor">>
): Draft | null {
  const d = getDb();
  const existing = getDraft(id);
  if (!existing) return null;
  const merged = { ...existing, ...patch, updatedAt: now() };
  d.prepare(
    `UPDATE drafts SET status=@status, edited_body=@editedBody, hashtags=@hashtags,
       suggested_target=@suggestedTarget, scheduled_for=@scheduledFor, updated_at=@updatedAt WHERE id=@id`
  ).run({ ...merged, hashtags: JSON.stringify(merged.hashtags) });
  return merged;
}

// --- Yayın kaydı ---
export function insertPostLog(entry: Omit<PostLog, "id" | "postedAt">): PostLog {
  const d = getDb();
  const row: PostLog = { ...entry, id: randomUUID(), postedAt: now() };
  d.prepare(
    `INSERT INTO post_log (id, draft_id, target, platform, external_post_id, posted_at, status, error)
     VALUES (@id, @draftId, @target, @platform, @externalPostId, @postedAt, @status, @error)`
  ).run(row);
  return row;
}

export function listPostLog(): PostLog[] {
  return getDb()
    .prepare("SELECT * FROM post_log ORDER BY posted_at DESC")
    .all()
    .map((r: any) => ({
      id: r.id,
      draftId: r.draft_id,
      target: r.target,
      platform: r.platform,
      externalPostId: r.external_post_id,
      postedAt: r.posted_at,
      status: r.status,
      error: r.error,
    }));
}
