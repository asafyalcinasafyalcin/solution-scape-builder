import Parser from "rss-parser";
import type { FeedConfig, NewsSource, RawNewsItem } from "./sources.ts";

const parser = new Parser({ timeout: 15000 });

/** Tek bir RSS feed'ini NewsSource'a saran adaptör. */
export class RssSource implements NewsSource {
  constructor(private feed: FeedConfig) {}

  async fetch(): Promise<RawNewsItem[]> {
    try {
      const parsed = await parser.parseURL(this.feed.url);
      return (parsed.items || []).map((item) => ({
        source: this.feed.name,
        url: item.link || "",
        title: (item.title || "").trim(),
        summary: stripHtml(item.contentSnippet || item.content || item.summary || "").slice(0, 600),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        lang: this.feed.lang,
        topic: this.feed.topic,
      }));
    } catch (err) {
      console.warn(`[rss] '${this.feed.name}' çekilemedi: ${(err as Error).message}`);
      return [];
    }
  }
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
