import "dotenv/config";
import { generatePost } from "../generation/generate.ts";
import { insertDraft } from "../db/client.ts";
import type { NewsContext } from "../generation/templates.ts";

// API anahtarının ve üretim akışının çalıştığını doğrulamak için örnek bir haber.
// (Gerçek RSS kaynakları config/news-sources.json içinde etkinleştirildiğinde
//  günlük pipeline bunu otomatik yapar — bu sadece hızlı bir testtir.)
const sampleNews: NewsContext = {
  title: "Türkiye'nin gıda makineleri ihracatı geçen yıl rekor kırdı",
  summary:
    "Sektör temsilcileri, gıda işleme ve paketleme makinelerinde Türkiye'nin " +
    "Afrika ve Körfez pazarlarına ihracatının önemli ölçüde arttığını açıkladı. " +
    "Anahtar teslim üretim hatlarına talep yükseliyor.",
  source: "Test Kaynağı",
  url: "https://example.com/haber/gida-makineleri-ihracat",
};

async function main() {
  console.log("Örnek haberden TR+EN taslak üretiliyor...\n");
  const { post, cacheReadTokens, cacheCreateTokens } = await generatePost(
    "news_commentary",
    sampleNews
  );

  for (const lang of ["tr", "en"] as const) {
    const v = post[lang];
    console.log(`================= ${lang.toUpperCase()} =================`);
    console.log("HOOK:", v.hook);
    console.log("\n" + v.body);
    console.log("\nHASHTAG:", v.hashtags.join(" "));
    console.log("HEDEF:", v.suggestedTarget);
    console.log("");

    // Panelde görünmesi için veritabanına da kaydet
    insertDraft({
      newsItemId: null,
      type: "news_commentary",
      lang,
      hook: v.hook,
      body: v.body,
      hashtags: v.hashtags,
      suggestedTarget: v.suggestedTarget,
    });
  }

  console.log(
    `✅ Taslaklar üretildi ve panele kaydedildi. (cache: write=${cacheCreateTokens}, read=${cacheReadTokens} token)`
  );
  console.log("Paneli açmak için: bun run start  +  cd dashboard && bun run dev");
}

main().catch((err) => {
  console.error("\n❌ Hata:", err.message);
  if (String(err.message).includes("ANTHROPIC_API_KEY")) {
    console.error("→ content-engine/.env içinde ANTHROPIC_API_KEY dolu mu, kontrol et.");
  }
  process.exit(1);
});
