import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface BrandProfile {
  company: string;
  url: string;
  email: string;
  location: string;
  positioning_tr: string;
  positioning_en: string;
  about_tr: string;
  sectors: string[];
  markets: string[];
  reach: string;
  product_lines: { name: string; summary: string }[];
  value_pillars: string[];
  values: string[];
  why_turkey: string[];
  audience: string;
  tone: string[];
  dos: string[];
  donts: string[];
  cta_default_tr: string;
  cta_default_en: string;
}

export function loadBrandProfile(path = "./config/brand-profile.json"): BrandProfile {
  return JSON.parse(readFileSync(resolve(path), "utf-8")) as BrandProfile;
}

/**
 * Web sitesindeki ürün verisinden (src/data/*.ts) canlı bir ürün kataloğu özeti çıkarır.
 * Cross-import kırılgan olabileceğinden hata durumunda boş döner (profil yine de çalışır).
 */
async function loadProductCatalog(): Promise<string> {
  try {
    const [sauce, macline, dairy] = await Promise.all([
      import("../../../src/data/sauceData.ts"),
      import("../../../src/data/maclineData.ts"),
      import("../../../src/data/dairyData.ts"),
    ]);

    const lines: string[] = [];

    const sosPackages = (sauce as any).sosPackages || {};
    for (const p of Object.values<any>(sosPackages)) {
      lines.push(`- ${p.name}: ${p.capacity}, ${p.usage}. ${p.description}`);
    }

    const packages = (macline as any).packages || {};
    for (const p of Object.values<any>(packages)) {
      lines.push(`- ${p.name}: ${p.capacity}, ürünler: ${(p.products || []).join(", ")} (${p.idealFor})`);
    }

    const machines = (dairy as any).dairyMachines || [];
    for (const m of machines) {
      lines.push(`- ${m.nameTr} (${m.name}): ${m.description}`);
    }

    return lines.length ? `\nGÜNCEL ÜRÜN KATALOĞU (web sitesinden):\n${lines.join("\n")}` : "";
  } catch {
    return "";
  }
}

/**
 * Claude system bloğunu oluşturur. Bu blok statiktir ve gün boyunca değişmez,
 * bu yüzden generate.ts içinde prompt caching ile işaretlenir.
 */
export async function buildSystemPrompt(profile: BrandProfile): Promise<string> {
  const catalog = await loadProductCatalog();
  return `Sen ${profile.company} için kurumsal bir LinkedIn içerik editörüsün.
Görevin, marka sesine sadık kalarak profesyonel, B2B LinkedIn gönderileri üretmek.

ŞİRKET
- Ad: ${profile.company} (${profile.url}, ${profile.email}, ${profile.location})
- Konumlandırma (TR): ${profile.positioning_tr}
- Konumlandırma (EN): ${profile.positioning_en}
- Hakkında: ${profile.about_tr}
- Erişim: ${profile.reach}
- Pazarlar: ${profile.markets.join(", ")}

FAALİYET ALANLARI
${profile.sectors.map((s) => `- ${s}`).join("\n")}

ÜRÜN HATLARI
${profile.product_lines.map((p) => `- ${p.name}: ${p.summary}`).join("\n")}${catalog}

DEĞER SÜTUNLARI (gönderiyi mutlaka birine bağla)
${profile.value_pillars.map((v) => `- ${v}`).join("\n")}

DEĞERLER: ${profile.values.join(", ")}
NEDEN TÜRKİYE: ${profile.why_turkey.join(", ")}
HEDEF KİTLE: ${profile.audience}
TON: ${profile.tone.join(", ")}

YAP
${profile.dos.map((d) => `- ${d}`).join("\n")}

YAPMA
${profile.donts.map((d) => `- ${d}`).join("\n")}

VARSAYILAN CTA — TR: "${profile.cta_default_tr}" | EN: "${profile.cta_default_en}"`;
}
