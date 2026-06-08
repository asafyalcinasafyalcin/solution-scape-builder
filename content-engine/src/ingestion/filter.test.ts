import { describe, it, expect } from "vitest";
import { filterItems, hashItem, scoreItem } from "./filter.ts";
import type { NewsConfig, RawNewsItem } from "./sources.ts";

const keywords: NewsConfig["keywords"] = {
  include: ["süt", "salça", "export", "packaging machinery"],
  exclude: ["tarif", "recipe"],
};

const baseConfig: NewsConfig = {
  feeds: [],
  apiSources: [],
  keywords,
  maxItemsPerRun: 10,
  lookbackHours: 48,
  minScore: 1,
};

function item(p: Partial<RawNewsItem>): RawNewsItem {
  return {
    source: "Test",
    url: p.url ?? "https://example.com/" + Math.random(),
    title: p.title ?? "Başlık",
    summary: p.summary ?? "Özet",
    publishedAt: p.publishedAt ?? new Date().toISOString(),
    lang: p.lang ?? "tr",
    topic: p.topic ?? "industry",
  };
}

describe("scoreItem", () => {
  it("başlık eşleşmesine 2, özet eşleşmesine 1 puan verir", () => {
    expect(scoreItem(item({ title: "Süt fiyatları", summary: "boş" }), keywords)).toBe(2);
    expect(scoreItem(item({ title: "boş", summary: "süt sektörü" }), keywords)).toBe(1);
  });

  it("exclude kelimesi varsa -1 döner", () => {
    expect(scoreItem(item({ title: "Süt tarifi", summary: "süt" }), keywords)).toBe(-1);
  });

  it("Türkçe büyük/küçük harfe duyarsızdır (İ/ı)", () => {
    expect(scoreItem(item({ title: "SÜT ÜRETİMİ" }), keywords)).toBeGreaterThan(0);
  });

  it("eşleşme yoksa 0 döner", () => {
    expect(scoreItem(item({ title: "alakasız", summary: "alakasız" }), keywords)).toBe(0);
  });
});

describe("hashItem", () => {
  it("aynı URL için kararlı hash üretir", () => {
    expect(hashItem({ url: "https://a.com/x", title: "A" })).toBe(
      hashItem({ url: "https://a.com/x", title: "B" })
    );
  });
  it("farklı URL için farklı hash üretir", () => {
    expect(hashItem({ url: "https://a.com/x", title: "A" })).not.toBe(
      hashItem({ url: "https://a.com/y", title: "A" })
    );
  });
});

describe("filterItems", () => {
  it("minScore altındakileri eler", () => {
    const items = [item({ title: "alakasız haber", summary: "alakasız" })];
    expect(filterItems(items, baseConfig)).toHaveLength(0);
  });

  it("exclude eşleşmelerini eler", () => {
    const items = [item({ title: "Süt tarifi nasıl yapılır", summary: "süt" })];
    expect(filterItems(items, baseConfig)).toHaveLength(0);
  });

  it("hash ile tekilleştirir", () => {
    const items = [
      item({ url: "https://x.com/1", title: "Süt yatırımı" }),
      item({ url: "https://x.com/1", title: "Süt yatırımı (kopya)" }),
    ];
    expect(filterItems(items, baseConfig)).toHaveLength(1);
  });

  it("puana göre sıralar (yüksek önce)", () => {
    const items = [
      item({ url: "https://x.com/low", title: "boş", summary: "süt" }), // 1
      item({ url: "https://x.com/high", title: "süt salça", summary: "export" }), // 4+1
    ];
    const out = filterItems(items, baseConfig);
    expect(out[0].item.url).toBe("https://x.com/high");
  });

  it("lookback penceresi dışındakileri eler", () => {
    const old = new Date(Date.now() - 100 * 3600_000).toISOString();
    const items = [item({ title: "Süt yatırımı", publishedAt: old })];
    expect(filterItems(items, baseConfig)).toHaveLength(0);
  });

  it("maxItemsPerRun ile sınırlar", () => {
    const items = Array.from({ length: 15 }, (_, i) =>
      item({ url: `https://x.com/${i}`, title: "süt salça export" })
    );
    expect(filterItems(items, { ...baseConfig, maxItemsPerRun: 5 })).toHaveLength(5);
  });
});
