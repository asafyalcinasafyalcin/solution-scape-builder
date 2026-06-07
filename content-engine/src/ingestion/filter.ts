import { createHash } from "node:crypto";
import type { RawNewsItem, NewsConfig } from "./sources.ts";

/** Bir öğe için kararlı tekilleştirme hash'i (URL öncelikli, yoksa başlık). */
export function hashItem(item: Pick<RawNewsItem, "url" | "title">): string {
  const key = (item.url || item.title).trim().toLowerCase();
  return createHash("sha256").update(key).digest("hex").slice(0, 32);
}

const norm = (s: string) => s.toLocaleLowerCase("tr-TR");

/**
 * Öğeyi anahtar kelimelere göre puanlar. Başlık eşleşmeleri 2, özet eşleşmeleri 1 puan.
 * Herhangi bir 'exclude' kelimesi eşleşirse -1 döner (elenir).
 */
export function scoreItem(item: RawNewsItem, keywords: NewsConfig["keywords"]): number {
  const title = norm(item.title);
  const summary = norm(item.summary);

  for (const ex of keywords.exclude) {
    const e = norm(ex);
    if (title.includes(e) || summary.includes(e)) return -1;
  }

  let score = 0;
  for (const inc of keywords.include) {
    const k = norm(inc);
    if (title.includes(k)) score += 2;
    else if (summary.includes(k)) score += 1;
  }
  return score;
}

function isWithinLookback(item: RawNewsItem, lookbackHours: number, nowMs: number): boolean {
  const t = Date.parse(item.publishedAt);
  if (Number.isNaN(t)) return true; // tarih okunamazsa tutmaya devam et
  return nowMs - t <= lookbackHours * 3600_000;
}

export interface ScoredItem {
  item: RawNewsItem;
  score: number;
  hash: string;
  topicTags: string[];
}

/**
 * Ham öğeleri filtreler: lookback penceresi + exclude + minScore, hash ile tekilleştirir,
 * puana göre sıralar ve maxItemsPerRun ile sınırlar. Saf fonksiyon (yan etkisiz).
 */
export function filterItems(
  items: RawNewsItem[],
  config: NewsConfig,
  nowMs: number = Date.now()
): ScoredItem[] {
  const seen = new Set<string>();
  const out: ScoredItem[] = [];

  for (const item of items) {
    if (!item.url && !item.title) continue;
    if (!isWithinLookback(item, config.lookbackHours, nowMs)) continue;

    const score = scoreItem(item, config.keywords);
    if (score < config.minScore) continue;

    const hash = hashItem(item);
    if (seen.has(hash)) continue;
    seen.add(hash);

    out.push({ item, score, hash, topicTags: [item.topic] });
  }

  out.sort((a, b) => b.score - a.score || Date.parse(b.item.publishedAt) - Date.parse(a.item.publishedAt));
  return out.slice(0, config.maxItemsPerRun);
}
