import type { DraftType } from "../db/schema.ts";

export interface NewsContext {
  title: string;
  summary: string;
  source: string;
  url: string;
}

const FORMAT_RULES = `BİÇİM KURALLARI (her iki dil için ayrı ayrı):
- Güçlü bir ilk satır (hook) — dikkat çeksin, clickbait olmasın.
- Kısa paragraflar / satır araları (LinkedIn okunabilirliği).
- Gövde ~120-180 kelime.
- 3-5 alakalı, profesyonel hashtag (# ile).
- Tek net ve yumuşak bir CTA.
- TR ve EN BAĞIMSIZ, idiomatik metinlerdir — birebir çeviri DEĞİL.
- suggestedTarget: "company" (kurumsal/ürün odaklı), "personal" (kişisel/düşünce liderliği) veya "both".`;

const OUTPUT_CONTRACT = `Yalnızca şu şemada GEÇERLİ JSON döndür (başka metin yok):
{
  "tr": { "hook": string, "body": string, "hashtags": string[], "suggestedTarget": "company"|"personal"|"both" },
  "en": { "hook": string, "body": string, "hashtags": string[], "suggestedTarget": "company"|"personal"|"both" }
}`;

export function buildUserPrompt(type: DraftType, ctx?: NewsContext): string {
  if (type === "news_commentary") {
    if (!ctx) throw new Error("news_commentary için haber bağlamı gerekli");
    return `GÖREV: Aşağıdaki güncel haberi alıntıla ve ProcessTürk bakış açısıyla yorumla.
Yapı: (1) haberi kısaca aktar/alıntıla ve kaynağı atfet, (2) bir değer sütununa bağlayarak ProcessTürk perspektifiyle yorumla, (3) yumuşak CTA.

HABER
- Başlık: ${ctx.title}
- Özet: ${ctx.summary}
- Kaynak: ${ctx.source}
- URL: ${ctx.url}

${FORMAT_RULES}

${OUTPUT_CONTRACT}`;
  }

  if (type === "promo") {
    return `GÖREV: ProcessTürk'ün yeteneklerini, ürün hatlarını ve uzmanlığını anlatan ÖZGÜN bir tanıtım gönderisi üret (habere dayanmaz). Bir değer sütununu öne çıkar.

${FORMAT_RULES}

${OUTPUT_CONTRACT}`;
  }

  // quote
  if (!ctx) throw new Error("quote için bağlam (alıntı) gerekli");
  return `GÖREV: Aşağıdaki açıklama/alıntıyı temel alarak gündem yorumu üret. Alıntıyı ver, kaynağı atfet, ardından ProcessTürk perspektifiyle yorumla.

ALINTI / AÇIKLAMA
- İçerik: ${ctx.title}
- Bağlam: ${ctx.summary}
- Kaynak: ${ctx.source}
- URL: ${ctx.url}

${FORMAT_RULES}

${OUTPUT_CONTRACT}`;
}
