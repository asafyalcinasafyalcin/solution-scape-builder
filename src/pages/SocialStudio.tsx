import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Instagram,
  Square,
  RectangleHorizontal,
  Smartphone,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BRAND,
  CATEGORIES,
  DEFAULT_CONFIG,
  FORMATS,
  THEMES,
  StudioConfig,
  buildCaption,
  ensureFont,
  renderTemplate,
  type CategoryId,
  type FormatId,
  type ThemeId,
} from '@/lib/socialStudio';

const formatIcon = (id: FormatId) =>
  id === 'post' ? Square : id === 'story' ? Smartphone : RectangleHorizontal;

const SocialStudio = () => {
  const { language } = useLanguage();
  const [cfg, setCfg] = useState<StudioConfig>({ ...DEFAULT_CONFIG, lang: language });
  const [copied, setCopied] = useState(false);
  const [fontTick, setFontTick] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const set = <K extends keyof StudioConfig>(key: K, value: StudioConfig[K]) =>
    setCfg((c) => ({ ...c, [key]: value }));

  // Font yükle (Inter) ve hazır olunca yeniden çiz
  useEffect(() => {
    ensureFont(() => setFontTick((t) => t + 1));
  }, []);

  // Canvas'ı her config değişiminde yeniden çiz
  useEffect(() => {
    if (canvasRef.current) renderTemplate(canvasRef.current, cfg);
  }, [cfg, fontTick]);

  const caption = useMemo(() => buildCaption(cfg), [cfg]);
  const tr = cfg.lang === 'tr';

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safe = (cfg.title || 'processturk').toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 40);
      a.href = url;
      a.download = `processturk-${cfg.format}-${safe || 'gonderi'}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* pano erişimi yoksa sessizce geç */
    }
  };

  const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A6E51] mb-2 block';
  const inputCls =
    'w-full rounded-lg border border-[#E0D8CC] bg-white px-4 py-3 text-sm text-[#071739] outline-none transition-colors focus:border-[#A68868] focus:ring-2 focus:ring-[#A68868]/20 placeholder:text-[#9A9488]';

  const chip = (active: boolean) =>
    `rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left ${
      active
        ? 'border-[#071739] bg-[#071739] text-[#F6F4F0] shadow-sm'
        : 'border-[#E0D8CC] bg-white text-[#3A4759] hover:border-[#A68868]'
    }`;

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#071739] to-[#050F26] text-[#F6F4F0]">
        <div className="container py-14 sm:py-20">
          <div className="inline-flex items-center gap-3">
            <span className="block h-px w-8 bg-[#A68868]" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#A68868]">
              {tr ? 'Sosyal Medya Stüdyosu' : 'Social Media Studio'}
            </span>
          </div>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight">
            {tr ? 'Paylaştığın her şeyi ' : 'Turn everything you share into '}
            <span className="italic font-light text-[#E3C39D]">
              {tr ? 'kurumsal kimlikle üret' : 'on-brand content'}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-[#F6F4F0]/75 leading-relaxed">
            {tr
              ? 'Reels, Story, gönderi — hepsini ProcessTürk kurumsal şablonuyla oluştur. Metnini yaz, görselini indir, paylaş.'
              : 'Reels, Stories, posts — all built with the ProcessTürk brand template. Write the caption, export the visual, share.'}
          </p>
        </div>
      </section>

      <div className="container py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* SOL: Kontroller */}
          <div className="space-y-8">
            {/* Format */}
            <div>
              <span className={labelCls}>{tr ? 'Format' : 'Format'}</span>
              <div className="grid grid-cols-3 gap-2.5">
                {FORMATS.map((f) => {
                  const Icon = formatIcon(f.id);
                  const active = cfg.format === f.id;
                  return (
                    <button key={f.id} onClick={() => set('format', f.id)} className={chip(active)}>
                      <Icon className="h-4 w-4 mb-1.5" />
                      <span className="block leading-tight">{tr ? f.labelTr : f.labelEn}</span>
                      <span className={`block text-[10px] mt-1 ${active ? 'text-[#E3C39D]' : 'text-[#9A9488]'}`}>
                        {f.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kategori */}
            <div>
              <span className={labelCls}>{tr ? 'İçerik Türü' : 'Content Type'}</span>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => set('category', c.id as CategoryId)}
                    className={chip(cfg.category === c.id)}
                  >
                    {tr ? c.labelTr : c.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Tema + Dil */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className={labelCls}>{tr ? 'Renk Teması' : 'Color Theme'}</span>
                <div className="flex gap-2.5">
                  {THEMES.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => set('theme', th.id as ThemeId)}
                      className={`flex-1 ${chip(cfg.theme === th.id)}`}
                    >
                      {tr ? th.labelTr : th.labelEn}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={labelCls}>{tr ? 'Dil' : 'Language'}</span>
                <div className="flex gap-2.5">
                  {(['tr', 'en'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => set('lang', l)}
                      className={`flex-1 ${chip(cfg.lang === l)}`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Metin alanları */}
            <div className="space-y-5 rounded-xl border border-[#E0D8CC] bg-white/60 p-5">
              <div>
                <span className={labelCls}>{tr ? 'Üst Etiket (opsiyonel)' : 'Eyebrow (optional)'}</span>
                <input
                  className={inputCls}
                  value={cfg.eyebrow}
                  onChange={(e) => set('eyebrow', e.target.value)}
                  placeholder={tr ? 'Örn. YENİ PROJE — otomatik doldurulur' : 'e.g. NEW PROJECT — auto-filled'}
                />
              </div>
              <div>
                <span className={labelCls}>{tr ? 'Başlık' : 'Title'}</span>
                <input
                  className={inputCls}
                  value={cfg.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder={tr ? 'Ana başlık' : 'Main title'}
                />
              </div>
              <div>
                <span className={labelCls}>{tr ? 'Vurgu (italik) — opsiyonel' : 'Accent (italic) — optional'}</span>
                <input
                  className={inputCls}
                  value={cfg.accent}
                  onChange={(e) => set('accent', e.target.value)}
                  placeholder={tr ? 'Vurgulanacak kelime/ifade' : 'Word/phrase to emphasize'}
                />
              </div>
              <div>
                <span className={labelCls}>{tr ? 'Açıklama' : 'Description'}</span>
                <textarea
                  className={`${inputCls} min-h-[92px] resize-y`}
                  value={cfg.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder={tr ? 'Kısa açıklama metni' : 'Short description text'}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={labelCls}>{tr ? 'İsim' : 'Name'}</span>
                  <input className={inputCls} value={cfg.authorName} onChange={(e) => set('authorName', e.target.value)} />
                </div>
                <div>
                  <span className={labelCls}>{tr ? 'Ünvan' : 'Role'}</span>
                  <input className={inputCls} value={cfg.authorTitle} onChange={(e) => set('authorTitle', e.target.value)} />
                </div>
                <div>
                  <span className={labelCls}>{tr ? 'Web Sitesi' : 'Website'}</span>
                  <input className={inputCls} value={cfg.website} onChange={(e) => set('website', e.target.value)} />
                </div>
                <div>
                  <span className={labelCls}>{tr ? 'Kullanıcı Adı' : 'Handle'}</span>
                  <input className={inputCls} value={cfg.handle} onChange={(e) => set('handle', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: Önizleme + Metin */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <span className={labelCls}>{tr ? 'Görsel Önizleme' : 'Visual Preview'}</span>
              <div className="rounded-xl border border-[#E0D8CC] bg-[#071739] p-4 sm:p-6 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto rounded-md shadow-lg"
                  style={{ maxHeight: '62vh' }}
                />
              </div>
              <button
                onClick={handleDownload}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#A68868] px-5 py-3.5 text-sm font-semibold text-[#071739] transition-colors hover:bg-[#8A6E51] hover:text-[#F6F4F0]"
              >
                <Download className="h-4 w-4" />
                {tr ? 'Görseli PNG olarak indir' : 'Download PNG'}
              </button>
            </div>

            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`${labelCls} mb-0`}>{tr ? 'Paylaşım Metni' : 'Caption'}</span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#071739] hover:text-[#A68868] transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? (tr ? 'Kopyalandı' : 'Copied') : tr ? 'Kopyala' : 'Copy'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl border border-[#E0D8CC] bg-white p-5 text-sm leading-relaxed text-[#3A4759] font-sans">
                {caption}
              </pre>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#8A6E51]">
                <Sparkles className="h-3.5 w-3.5" />
                {tr
                  ? 'Görseli indir, metni kopyala — Instagram, LinkedIn veya X üzerinde paylaş.'
                  : 'Download the visual, copy the caption — share on Instagram, LinkedIn or X.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* alt marka şeridi */}
      <div className="border-t border-[#E0D8CC]">
        <div className="container py-6 flex items-center gap-3 text-xs text-[#8A6E51]">
          <Instagram className="h-4 w-4" />
          <span style={{ color: BRAND.navy }} className="font-semibold">
            processturk.com
          </span>
          <span className="text-[#B7AE9F]">
            · {tr ? 'Kurumsal içerik stüdyosu' : 'Brand content studio'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialStudio;
