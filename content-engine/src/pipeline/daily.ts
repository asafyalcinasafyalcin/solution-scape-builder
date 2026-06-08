import "dotenv/config";
import { loadNewsConfig } from "../ingestion/sources.ts";
import { RssSource } from "../ingestion/rss.ts";
import { filterItems } from "../ingestion/filter.ts";
import {
  getUnusedNews,
  insertDraft,
  insertNewsItem,
  markNewsUsed,
} from "../db/client.ts";
import { generatePost } from "../generation/generate.ts";
import type { NewsContext } from "../generation/templates.ts";

/** Adım 1: Etkin RSS kaynaklarından haber çek, filtrele, DB'ye yaz. Eklenen sayısını döner. */
export async function ingest(): Promise<number> {
  const config = loadNewsConfig();
  const sources = config.feeds.filter((f) => f.enabled).map((f) => new RssSource(f));

  if (sources.length === 0) {
    console.warn("[ingest] Etkin RSS kaynağı yok. config/news-sources.json içinde 'enabled: true' yapın.");
    return 0;
  }

  const raw = (await Promise.all(sources.map((s) => s.fetch()))).flat();
  const scored = filterItems(raw, config);

  let inserted = 0;
  for (const s of scored) {
    const row = insertNewsItem({
      source: s.item.source,
      url: s.item.url,
      title: s.item.title,
      summary: s.item.summary,
      publishedAt: s.item.publishedAt,
      lang: s.item.lang,
      topicTags: s.topicTags,
      hash: s.hash,
    });
    if (row) inserted++;
  }
  console.log(`[ingest] ${raw.length} ham, ${scored.length} filtreli, ${inserted} yeni kayıt.`);
  return inserted;
}

/** Adım 2: Kullanılmamış haberlerden TR+EN taslak üret. Üretilen taslak sayısını döner. */
export async function generateDrafts(max = 5): Promise<number> {
  const news = getUnusedNews(max);
  if (news.length === 0) {
    console.log("[generate] Üretilecek yeni haber yok.");
    return 0;
  }

  let created = 0;
  for (const item of news) {
    const ctx: NewsContext = {
      title: item.title,
      summary: item.summary,
      source: item.source,
      url: item.url,
    };
    try {
      const { post, cacheReadTokens } = await generatePost("news_commentary", ctx);
      for (const lang of ["tr", "en"] as const) {
        const v = post[lang];
        insertDraft({
          newsItemId: item.id,
          type: "news_commentary",
          lang,
          hook: v.hook,
          body: v.body,
          hashtags: v.hashtags,
          suggestedTarget: v.suggestedTarget,
        });
        created++;
      }
      markNewsUsed(item.id);
      console.log(`[generate] "${item.title.slice(0, 50)}..." → TR+EN (cache okuma: ${cacheReadTokens} token)`);
    } catch (err) {
      console.error(`[generate] "${item.title.slice(0, 50)}..." başarısız: ${(err as Error).message}`);
    }
  }
  return created;
}

export async function runDaily(): Promise<void> {
  console.log("=== ProcessTürk İçerik Motoru — günlük pipeline ===");
  await ingest();
  const drafts = await generateDrafts();
  console.log(`=== Tamamlandı: ${drafts} taslak hazır (onay bekliyor) ===`);
}

// CLI girişi
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  runDaily().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
