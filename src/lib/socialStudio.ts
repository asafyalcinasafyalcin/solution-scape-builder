// ProcessTürk — Sosyal Medya Stüdyosu
// Kurumsal kimlikle birebir uyumlu görsel şablon (canvas) render motoru
// ve paylaşım metni (caption) üreticisi. Bağımlılık gerektirmez.

export const BRAND = {
  navy: '#071739',
  navyDeep: '#050F26',
  navyLight: '#1E4E79',
  copper: '#A68868',
  copperDark: '#8A6E51',
  beige: '#E3C39D',
  offwhite: '#F6F4F0',
  white: '#FFFFFF',
};

export type FormatId = 'post' | 'story' | 'landscape';

export interface FormatDef {
  id: FormatId;
  labelTr: string;
  labelEn: string;
  w: number;
  h: number;
  hint: string;
}

export const FORMATS: FormatDef[] = [
  { id: 'post', labelTr: 'Kare Gönderi', labelEn: 'Feed Post', w: 1080, h: 1080, hint: 'Instagram / LinkedIn 1:1' },
  { id: 'story', labelTr: 'Story / Reels Kapağı', labelEn: 'Story / Reel Cover', w: 1080, h: 1920, hint: 'Instagram Story & Reels 9:16' },
  { id: 'landscape', labelTr: 'Yatay Kapak', labelEn: 'Wide Banner', w: 1200, h: 675, hint: 'X (Twitter) / LinkedIn 16:9' },
];

export type ThemeId = 'navy' | 'light' | 'copper';

export const THEMES: { id: ThemeId; labelTr: string; labelEn: string }[] = [
  { id: 'navy', labelTr: 'Lacivert', labelEn: 'Navy' },
  { id: 'light', labelTr: 'Açık', labelEn: 'Light' },
  { id: 'copper', labelTr: 'Bakır', labelEn: 'Copper' },
];

export type CategoryId = 'duyuru' | 'proje' | 'ipucu' | 'soz' | 'etkinlik' | 'kisisel';

export interface CategoryDef {
  id: CategoryId;
  labelTr: string;
  labelEn: string;
  eyebrowTr: string;
  eyebrowEn: string;
  hashtags: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'duyuru',
    labelTr: 'Duyuru',
    labelEn: 'Announcement',
    eyebrowTr: 'DUYURU',
    eyebrowEn: 'ANNOUNCEMENT',
    hashtags: ['#ProcessTürk', '#duyuru', '#endüstri', '#üretim'],
  },
  {
    id: 'proje',
    labelTr: 'Yeni Proje / Referans',
    labelEn: 'New Project / Reference',
    eyebrowTr: 'YENİ PROJE',
    eyebrowEn: 'NEW PROJECT',
    hashtags: ['#ProcessTürk', '#proje', '#referans', '#anahtarteslim', '#üretimhattı'],
  },
  {
    id: 'ipucu',
    labelTr: 'Teknik İpucu / Bilgi',
    labelEn: 'Technical Tip',
    eyebrowTr: 'TEKNİK İPUCU',
    eyebrowEn: 'TECHNICAL TIP',
    hashtags: ['#ProcessTürk', '#mühendislik', '#gıdateknolojisi', '#üretim', '#bilgi'],
  },
  {
    id: 'soz',
    labelTr: 'Söz / Motivasyon',
    labelEn: 'Quote / Insight',
    eyebrowTr: 'BUGÜNÜN NOTU',
    eyebrowEn: "TODAY'S NOTE",
    hashtags: ['#ProcessTürk', '#girişimcilik', '#üretim', '#vizyon'],
  },
  {
    id: 'etkinlik',
    labelTr: 'Fuar / Etkinlik',
    labelEn: 'Fair / Event',
    eyebrowTr: 'ETKİNLİK',
    eyebrowEn: 'EVENT',
    hashtags: ['#ProcessTürk', '#fuar', '#etkinlik', '#buluşma', '#endüstri'],
  },
  {
    id: 'kisisel',
    labelTr: 'Kişisel / Perde Arkası',
    labelEn: 'Personal / Behind the Scenes',
    eyebrowTr: 'PERDE ARKASI',
    eyebrowEn: 'BEHIND THE SCENES',
    hashtags: ['#ProcessTürk', '#perdearkası', '#üretim', '#ekip'],
  },
];

export interface StudioConfig {
  format: FormatId;
  theme: ThemeId;
  category: CategoryId;
  lang: 'tr' | 'en';
  eyebrow: string;
  title: string;
  accent: string; // vurgulanan (italik) kelime/ifade
  description: string;
  authorName: string;
  authorTitle: string;
  website: string;
  handle: string;
  overlay: number; // fotoğraf arka planda perde koyuluğu (0-100)
}

export const DEFAULT_CONFIG: StudioConfig = {
  format: 'post',
  theme: 'navy',
  category: 'proje',
  lang: 'tr',
  eyebrow: '',
  title: 'Yeni bir üretim hattını',
  accent: 'devreye aldık',
  description:
    'Anahtar teslim proje: tasarımdan sahada çalışan sisteme kadar tüm süreci ProcessTürk mühendisliğiyle tamamladık.',
  authorName: 'Asaf Yalçın',
  authorTitle: 'Kurucu · ProcessTürk',
  website: 'processturk.com',
  handle: '@processturk',
  overlay: 68,
};

// ---- Hazır şablonlar (presetler) ------------------------------------------
interface PresetContent {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
}

export interface Preset {
  id: string;
  labelTr: string;
  labelEn: string;
  category: CategoryId;
  theme?: ThemeId;
  format?: FormatId;
  tr: PresetContent;
  en: PresetContent;
}

export const PRESETS: Preset[] = [
  {
    id: 'yolda',
    labelTr: '✈️ Yolda / Sıradaki proje',
    labelEn: '✈️ On the road / Next project',
    category: 'kisisel',
    theme: 'navy',
    format: 'post',
    tr: {
      eyebrow: 'YOLDAYIZ',
      title: 'Sıradaki durak,',
      accent: 'sıradaki proje',
      description:
        'Bir üretim hattını teslim ettik, şimdi yeni bir sahaya doğru yoldayız. Bu işin ofiste değil, tesiste bittiğine inanıyoruz — her uçuş yeni bir üretim hattı demek.',
    },
    en: {
      eyebrow: 'ON THE ROAD',
      title: 'Next stop,',
      accent: 'next project',
      description:
        "One line delivered, already on the way to the next site. This work isn't finished at the office — it's finished on the factory floor. Every flight means another production line.",
    },
  },
  {
    id: 'vizyon',
    labelTr: '🌍 Vizyon / Büyüme notu',
    labelEn: '🌍 Vision / Growth note',
    category: 'soz',
    theme: 'navy',
    format: 'post',
    tr: {
      eyebrow: 'BUGÜNÜN NOTU',
      title: 'Bir sahadan',
      accent: 'diğerine',
      description:
        'Mesafe uzuyor, standart aynı kalıyor: sahada çalışan sistemler. Her hafta yeni bir şehir, yeni bir tesis, aynı mühendislik disiplini.',
    },
    en: {
      eyebrow: "TODAY'S NOTE",
      title: 'From one site',
      accent: 'to the next',
      description:
        'The distance grows, the standard stays the same: systems that work on the floor. A new city and a new plant every week, with the same engineering discipline.',
    },
  },
  {
    id: 'siradaki-story',
    labelTr: '📱 SIRADAKİ (Story)',
    labelEn: '📱 NEXT (Story)',
    category: 'kisisel',
    theme: 'navy',
    format: 'story',
    tr: {
      eyebrow: 'PERDE ARKASI',
      title: 'SIRADAKİ.',
      accent: 'Yeni saha, yeni hat.',
      description: 'Yeni proje, yeni yolculuk. Süreci buradan takip edin.',
    },
    en: {
      eyebrow: 'BEHIND THE SCENES',
      title: 'NEXT.',
      accent: 'New site, new line.',
      description: 'New project, new journey. Follow the process here.',
    },
  },
  {
    id: 'proje-teslim',
    labelTr: '🚀 Yeni proje teslim',
    labelEn: '🚀 Project delivered',
    category: 'proje',
    theme: 'navy',
    format: 'post',
    tr: {
      eyebrow: 'YENİ PROJE',
      title: 'Yeni bir üretim hattını',
      accent: 'devreye aldık',
      description:
        'Anahtar teslim proje: tasarımdan sahada çalışan sisteme kadar tüm süreci ProcessTürk mühendisliğiyle tamamladık.',
    },
    en: {
      eyebrow: 'NEW PROJECT',
      title: 'A new production line,',
      accent: 'now live',
      description:
        'A turnkey project: from design to a system running on the floor, delivered end-to-end with ProcessTürk engineering.',
    },
  },
  {
    id: 'teknik-ipucu',
    labelTr: '🔧 Teknik ipucu',
    labelEn: '🔧 Technical tip',
    category: 'ipucu',
    theme: 'light',
    format: 'post',
    tr: {
      eyebrow: 'TEKNİK İPUCU',
      title: 'Doğru hat tasarımı',
      accent: 'kapasiteyle başlar',
      description:
        'Bir üretim hattını planlarken ilk soru makine değil, hedef kapasitedir. Kapasiteyi netleştirin; makine seçimi ve yerleşim kendiliğinden şekillenir.',
    },
    en: {
      eyebrow: 'TECHNICAL TIP',
      title: 'Good line design',
      accent: 'starts with capacity',
      description:
        'When planning a line, the first question is not the machine but the target capacity. Nail the capacity, and machine choice and layout follow naturally.',
    },
  },
  {
    id: 'fuar',
    labelTr: '📍 Fuar / Etkinlik duyurusu',
    labelEn: '📍 Fair / Event',
    category: 'etkinlik',
    theme: 'copper',
    format: 'post',
    tr: {
      eyebrow: 'ETKİNLİK',
      title: 'Fuarda',
      accent: 'buluşalım',
      description:
        'Standımızda gıda ve endüstriyel üretim çözümlerimizi konuşmak, projenizi birlikte planlamak için sizi bekliyoruz.',
    },
    en: {
      eyebrow: 'EVENT',
      title: "Let's meet",
      accent: 'at the fair',
      description:
        'Visit our stand to talk through our food and industrial production solutions and plan your project together.',
    },
  },
];

export function applyPreset(cfg: StudioConfig, preset: Preset): StudioConfig {
  const content = cfg.lang === 'en' ? preset.en : preset.tr;
  return {
    ...cfg,
    category: preset.category,
    theme: preset.theme ?? cfg.theme,
    format: preset.format ?? cfg.format,
    eyebrow: content.eyebrow ?? '',
    title: content.title,
    accent: content.accent ?? '',
    description: content.description ?? '',
  };
}

// ---- Font yükleme (Inter) --------------------------------------------------
let fontLoaded = false;
export function ensureFont(onReady: () => void) {
  if (typeof document === 'undefined') return;
  if (!fontLoaded) {
    fontLoaded = true;
    const id = 'inter-font-studio';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap';
      document.head.appendChild(link);
    }
  }
  if ((document as any).fonts?.ready) {
    (document as any).fonts.ready.then(() => onReady());
  } else {
    onReady();
  }
}

// ---- Yardımcılar -----------------------------------------------------------
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface Palette {
  bgTop: string;
  bgBottom: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  line: string;
  footerText: string;
  chipBg: string;
  chipText: string;
}

function palette(theme: ThemeId): Palette {
  switch (theme) {
    case 'light':
      return {
        bgTop: BRAND.offwhite,
        bgBottom: '#EBE6DE',
        eyebrow: BRAND.copperDark,
        title: BRAND.navy,
        accent: BRAND.navyLight,
        body: '#3A4759',
        line: BRAND.copper,
        footerText: BRAND.navy,
        chipBg: BRAND.navy,
        chipText: BRAND.offwhite,
      };
    case 'copper':
      return {
        bgTop: BRAND.copper,
        bgBottom: BRAND.copperDark,
        eyebrow: BRAND.navy,
        title: BRAND.offwhite,
        accent: BRAND.navy,
        body: 'rgba(255,255,255,0.92)',
        line: BRAND.navy,
        footerText: BRAND.offwhite,
        chipBg: BRAND.navy,
        chipText: BRAND.beige,
      };
    case 'navy':
    default:
      return {
        bgTop: BRAND.navy,
        bgBottom: BRAND.navyDeep,
        eyebrow: BRAND.copper,
        title: BRAND.offwhite,
        accent: BRAND.beige,
        body: 'rgba(246,244,240,0.82)',
        line: BRAND.copper,
        footerText: 'rgba(246,244,240,0.85)',
        chipBg: 'rgba(166,136,104,0.18)',
        chipText: BRAND.beige,
      };
  }
}

// Fotoğrafı canvas'a "cover" (kırparak kaplama) yerleştirir
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number) {
  const ir = img.width / img.height;
  const cr = W / H;
  let dw = W;
  let dh = H;
  let dx = 0;
  let dy = 0;
  if (ir > cr) {
    dh = H;
    dw = H * ir;
    dx = (W - dw) / 2;
  } else {
    dw = W;
    dh = W / ir;
    dy = (H - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

// ---- Ana render ------------------------------------------------------------
export function renderTemplate(
  canvas: HTMLCanvasElement,
  cfgIn: StudioConfig,
  opts?: { bgImage?: HTMLImageElement | null },
) {
  const fmt = FORMATS.find((f) => f.id === cfgIn.format)!;
  const cat = CATEGORIES.find((c) => c.id === cfgIn.category)!;
  const W = fmt.w;
  const H = fmt.h;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const hasPhoto = !!opts?.bgImage;
  // Fotoğraf varsa metin okunabilirliği için sabit "foto" paleti kullan
  const pal = hasPhoto ? palette('navy') : palette(cfgIn.theme);
  const s = W / 1080; // ölçek

  const eyebrowText = (cfgIn.eyebrow || (cfgIn.lang === 'tr' ? cat.eyebrowTr : cat.eyebrowEn)).toUpperCase();
  const catLabel = cfgIn.lang === 'tr' ? cat.labelTr : cat.labelEn;

  if (hasPhoto && opts?.bgImage) {
    // Fotoğraf arka plan + okunabilirlik perdesi (alt tarafta koyu)
    drawCover(ctx, opts.bgImage, W, H);
    const k = Math.min(100, Math.max(0, cfgIn.overlay)) / 100;
    const scrim = ctx.createLinearGradient(0, 0, 0, H);
    scrim.addColorStop(0, `rgba(7,23,57,${0.15 + 0.35 * k})`);
    scrim.addColorStop(0.45, `rgba(7,23,57,${0.1 + 0.45 * k})`);
    scrim.addColorStop(1, `rgba(5,15,38,${0.55 + 0.44 * k})`);
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, W, H);
  } else {
    // Arka plan gradyanı
    const grad = ctx.createLinearGradient(0, 0, W * 0.4, H);
    grad.addColorStop(0, pal.bgTop);
    grad.addColorStop(1, pal.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Köşe geometrik aksan (bakır ince çizgiler)
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.globalAlpha = cfgIn.theme === 'light' ? 0.5 : 0.35;
    ctx.lineWidth = Math.max(1, 1.5 * s);
    // sağ üst diyagonal desen
    for (let i = 0; i < 5; i++) {
      const off = i * 42 * s;
      ctx.beginPath();
      ctx.moveTo(W - 260 * s + off, -10);
      ctx.lineTo(W + 10, 250 * s - off);
      ctx.stroke();
    }
    ctx.restore();
  }

  const margin = 96 * s;
  let y = margin + 44 * s;

  // Üst şerit: kategori chip + monogram
  const chipH = 52 * s;
  ctx.font = `600 ${22 * s}px Inter, system-ui, sans-serif`;
  const chipTextW = ctx.measureText(catLabel.toUpperCase()).width;
  const chipW = chipTextW + 56 * s;
  roundRect(ctx, margin, y - chipH + 8 * s, chipW, chipH, chipH / 2);
  ctx.fillStyle = pal.chipBg;
  ctx.fill();
  ctx.fillStyle = pal.chipText;
  ctx.textBaseline = 'middle';
  ctx.fillText(catLabel.toUpperCase(), margin + 28 * s, y - chipH / 2 + 8 * s);

  // Monogram (sağ üst) — PT bakır kare
  const monoS = 64 * s;
  const monoX = W - margin - monoS;
  const monoY = y - chipH + 4 * s;
  roundRect(ctx, monoX, monoY, monoS, monoS, 14 * s);
  ctx.fillStyle = cfgIn.theme === 'copper' ? BRAND.navy : BRAND.copper;
  ctx.fill();
  ctx.fillStyle = cfgIn.theme === 'copper' ? BRAND.beige : BRAND.navy;
  ctx.font = `800 ${30 * s}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('PT', monoX + monoS / 2, monoY + monoS / 2 + 2 * s);
  ctx.textAlign = 'left';

  // Dikey konum: içeriği format yüksekliğine göre yerleştir
  // Fotoğraf varsa metni alt bölgeye (koyu perde) kaydır
  let contentTop: number;
  if (hasPhoto) {
    contentTop = fmt.id === 'landscape' ? H * 0.5 : H * (fmt.id === 'story' ? 0.56 : 0.5);
  } else {
    contentTop = fmt.id === 'landscape' ? margin + 150 * s : H * (fmt.id === 'story' ? 0.42 : 0.34);
  }
  y = contentTop;

  // Eyebrow (çizgi + uppercase)
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(margin + 48 * s, y);
  ctx.stroke();
  ctx.fillStyle = pal.eyebrow;
  ctx.font = `600 ${20 * s}px Inter, system-ui, sans-serif`;
  ctx.textBaseline = 'middle';
  const ebLetters = eyebrowText.split('').join(' ');
  ctx.save();
  (ctx as any).letterSpacing = `${6 * s}px`;
  ctx.fillText(eyebrowText, margin + 68 * s, y);
  ctx.restore();
  if (!(ctx as any).letterSpacing) {
    // letterSpacing desteklenmiyorsa manuel aralıklı yeniden çiz (üstteki görünmez olur)
  }
  y += 60 * s;

  // Başlık (bold) + accent (italik light) — Sunum stilini yansıtır
  const maxTextW = W - margin * 2;
  const titleSize = fmt.id === 'story' ? 82 * s : fmt.id === 'landscape' ? 62 * s : 76 * s;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 ${titleSize}px Inter, system-ui, sans-serif`;
  const titleLines = wrapText(ctx, cfgIn.title, maxTextW);
  const lineGap = titleSize * 1.12;
  y += titleSize * 0.9;
  for (const line of titleLines) {
    ctx.fillStyle = pal.title;
    ctx.font = `700 ${titleSize}px Inter, system-ui, sans-serif`;
    ctx.fillText(line, margin, y);
    y += lineGap;
  }
  // accent satırı (italik)
  if (cfgIn.accent.trim()) {
    ctx.fillStyle = pal.accent;
    ctx.font = `italic 300 ${titleSize}px Inter, system-ui, sans-serif`;
    const accentLines = wrapText(ctx, cfgIn.accent, maxTextW);
    for (const line of accentLines) {
      ctx.fillText(line, margin, y);
      y += lineGap;
    }
  }

  // Açıklama
  if (cfgIn.description.trim()) {
    y += 24 * s;
    const bodySize = fmt.id === 'landscape' ? 26 * s : 30 * s;
    ctx.font = `400 ${bodySize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = pal.body;
    const bodyLines = wrapText(ctx, cfgIn.description, Math.min(maxTextW, 820 * s));
    const bodyGap = bodySize * 1.45;
    for (const line of bodyLines.slice(0, fmt.id === 'landscape' ? 3 : 5)) {
      ctx.fillText(line, margin, y);
      y += bodyGap;
    }
  }

  // Alt bilgi şeridi
  const footerY = H - margin - 24 * s;
  ctx.strokeStyle = pal.line;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(margin, footerY - 54 * s);
  ctx.lineTo(W - margin, footerY - 54 * s);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = pal.footerText;
  ctx.font = `700 ${26 * s}px Inter, system-ui, sans-serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(cfgIn.authorName, margin, footerY);
  ctx.font = `400 ${20 * s}px Inter, system-ui, sans-serif`;
  ctx.globalAlpha = 0.8;
  ctx.fillText(cfgIn.authorTitle, margin, footerY + 28 * s);
  ctx.globalAlpha = 1;

  // sağ alt: website / handle
  ctx.textAlign = 'right';
  ctx.fillStyle = pal.eyebrow;
  ctx.font = `600 ${22 * s}px Inter, system-ui, sans-serif`;
  ctx.fillText(cfgIn.website, W - margin, footerY);
  ctx.fillStyle = pal.footerText;
  ctx.globalAlpha = 0.8;
  ctx.font = `400 ${20 * s}px Inter, system-ui, sans-serif`;
  ctx.fillText(cfgIn.handle, W - margin, footerY + 28 * s);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';

  // eyebrow harf aralığı fallback (letterSpacing yoksa)
  void ebLetters;
}

// ---- Paylaşım metni (caption) üretici -------------------------------------
export function buildCaption(cfg: StudioConfig): string {
  const cat = CATEGORIES.find((c) => c.id === cfg.category)!;
  const title = [cfg.title.trim(), cfg.accent.trim()].filter(Boolean).join(' ');
  const desc = cfg.description.trim();
  const site = cfg.website;
  const tags = cat.hashtags.join(' ');

  if (cfg.lang === 'en') {
    const hookMap: Record<CategoryId, string> = {
      duyuru: '📣 Announcement',
      proje: '🚀 New project delivered',
      ipucu: '🔧 Technical tip',
      soz: '💬 A note from today',
      etkinlik: '📍 See you at the event',
      kisisel: '👋 Behind the scenes',
    };
    const cta: Record<CategoryId, string> = {
      duyuru: `Details 👉 ${site}`,
      proje: `Planning a similar line? Let's talk 👉 ${site}`,
      ipucu: `More insights & solutions 👉 ${site}`,
      soz: `Let's build together 👉 ${site}`,
      etkinlik: `Reach out to meet 👉 ${site}`,
      kisisel: `Follow the journey 👉 ${site}`,
    };
    return [`${hookMap[cfg.category]}`, ``, title ? `${title}` : '', desc, ``, cta[cfg.category], ``, tags]
      .filter((l) => l !== undefined)
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  const hookMap: Record<CategoryId, string> = {
    duyuru: '📣 Duyuru',
    proje: '🚀 Yeni bir projeyi tamamladık',
    ipucu: '🔧 Teknik ipucu',
    soz: '💬 Bugünün notu',
    etkinlik: '📍 Etkinlikte görüşelim',
    kisisel: '👋 Perde arkası',
  };
  const cta: Record<CategoryId, string> = {
    duyuru: `Detaylar 👉 ${site}`,
    proje: `Benzer bir hat mı planlıyorsunuz? Konuşalım 👉 ${site}`,
    ipucu: `Daha fazlası ve çözümler 👉 ${site}`,
    soz: `Birlikte üretelim 👉 ${site}`,
    etkinlik: `Buluşmak için yazın 👉 ${site}`,
    kisisel: `Süreci takip edin 👉 ${site}`,
  };
  return [`${hookMap[cfg.category]}`, ``, title ? `${title}` : '', desc, ``, cta[cfg.category], ``, tags]
    .filter((l) => l !== undefined)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
