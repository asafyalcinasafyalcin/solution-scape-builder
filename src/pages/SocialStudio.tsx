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
  ImagePlus,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BRAND,
  CATEGORIES,
  DEFAULT_CONFIG,
  FORMATS,
  PRESETS,
  THEMES,
  StudioConfig,
  applyPreset,
  buildCaption,
  ensureFont,
  renderTemplate,
  type CategoryId,
  type FormatId,
  type ThemeId,
} from '@/lib/socialStudio';

const formatIcon = (id: FormatId) =>
  id === 'post' ? Square : id === 'story' ? Smartphone : RectangleHorizontal;

// Tüm slaytlarda ortak kalması gereken alanlar (carousel tutarlılığı)
const SHARED_KEYS: (keyof StudioConfig)[] = [
  'format',
  'theme',
  'lang',
  'authorName',
  'authorTitle',
  'website',
  'handle',
];

const MAX_SLIDES = 10;

const SocialStudio = () => {
  const { language } = useLanguage();
  const [slides, setSlides] = useState<StudioConfig[]>([{ ...DEFAULT_CONFIG, lang: language }]);
  const [photos, setPhotos] = useState<(HTMLImageElement | null)[]>([null]);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fontTick, setFontTick] = useState(0);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const cfg = slides[active];
  const photo = photos[active];

  const set = <K extends keyof StudioConfig>(key: K, value: StudioConfig[K]) => {
    const shared = SHARED_KEYS.includes(key);
    setSlides((all) => all.map((s, i) => (shared || i === active ? { ...s, [key]: value } : s)));
  };

  // Font yükle (Inter) ve hazır olunca yeniden çiz
  useEffect(() => {
    ensureFont(() => setFontTick((t) => t + 1));
  }, []);

  // Canvas'ı aktif slayt / fotoğraf değişiminde yeniden çiz
  useEffect(() => {
    if (canvasRef.current) renderTemplate(canvasRef.current, cfg, { bgImage: photo });
  }, [cfg, photo, fontTick]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setPhotos((ps) => ps.map((p, i) => (i === active ? img : p)));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearPhoto = () => setPhotos((ps) => ps.map((p, i) => (i === active ? null : p)));

  // ---- Slayt yönetimi ----
  const addSlide = () => {
    if (slides.length >= MAX_SLIDES) return;
    setSlides((all) => {
      const base = all[active];
      const fresh: StudioConfig = { ...base, title: '', accent: '', description: '', eyebrow: '' };
      const next = [...all];
      next.splice(active + 1, 0, fresh);
      return next;
    });
    setPhotos((ps) => {
      const next = [...ps];
      next.splice(active + 1, 0, null);
      return next;
    });
    setActive((a) => a + 1);
  };

  const removeSlide = () => {
    if (slides.length <= 1) return;
    setSlides((all) => all.filter((_, i) => i !== active));
    setPhotos((ps) => ps.filter((_, i) => i !== active));
    setActive((a) => Math.max(0, a - (a === slides.length - 1 ? 1 : 0)));
  };

  const moveSlide = (dir: -1 | 1) => {
    const j = active + dir;
    if (j < 0 || j >= slides.length) return;
    const swap = <T,>(arr: T[]) => {
      const next = [...arr];
      [next[active], next[j]] = [next[j], next[active]];
      return next;
    };
    setSlides((all) => swap(all));
    setPhotos((ps) => swap(ps));
    setActive(j);
  };

  const applyPresetToActive = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    setSlides((all) => {
      const applied = applyPreset(all[active], preset);
      // preset format/tema tüm slaytlara yayılır (tutarlılık)
      return all.map((s, i) =>
        i === active ? applied : { ...s, format: applied.format, theme: applied.theme },
      );
    });
  };

  const caption = useMemo(() => buildCaption(slides[0]), [slides]);
  const tr = cfg.lang === 'tr';
  const isCarousel = slides.length > 1;

  const downloadCanvas = (canvas: HTMLCanvasElement, name: string) =>
    new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    });

  const safeName = (c: StudioConfig) =>
    (c.title || 'processturk').toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 40) || 'gonderi';

  const handleDownload = () => {
    if (canvasRef.current) downloadCanvas(canvasRef.current, `processturk-${cfg.format}-${safeName(cfg)}.png`);
  };

  const handleDownloadAll = async () => {
    setExporting(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const tmp = document.createElement('canvas');
        renderTemplate(tmp, slides[i], { bgImage: photos[i] });
        await downloadCanvas(tmp, `processturk-carousel-${String(i + 1).padStart(2, '0')}.png`);
        await new Promise((r) => setTimeout(r, 350)); // tarayıcı çoklu indirmeyi engellemesin
      }
    } finally {
      setExporting(false);
    }
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

  const chip = (isActive: boolean) =>
    `rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left ${
      isActive
        ? 'border-[#071739] bg-[#071739] text-[#F6F4F0] shadow-sm'
        : 'border-[#E0D8CC] bg-white text-[#3A4759] hover:border-[#A68868]'
    }`;

  const iconBtn =
    'inline-flex items-center justify-center h-9 w-9 rounded-lg border border-[#E0D8CC] bg-white text-[#3A4759] transition-colors hover:border-[#A68868] disabled:opacity-40 disabled:cursor-not-allowed';

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
              ? 'Reels, Story, gönderi ve carousel — hepsini ProcessTürk kurumsal şablonuyla oluştur. Metnini yaz, görselini indir, paylaş.'
              : 'Reels, Stories, posts and carousels — all built with the ProcessTürk brand template. Write the caption, export the visual, share.'}
          </p>
        </div>
      </section>

      <div className="container py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* SOL: Kontroller */}
          <div className="space-y-8">
            {/* Slaytlar (Carousel) */}
            <div>
              <span className={labelCls}>{tr ? 'Slaytlar (Carousel)' : 'Slides (Carousel)'}</span>
              <div className="flex flex-wrap items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-9 w-9 rounded-lg border text-sm font-semibold transition-all ${
                      i === active
                        ? 'border-[#071739] bg-[#071739] text-[#F6F4F0]'
                        : 'border-[#E0D8CC] bg-white text-[#3A4759] hover:border-[#A68868]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={addSlide}
                  disabled={slides.length >= MAX_SLIDES}
                  className={iconBtn}
                  title={tr ? 'Slayt ekle' : 'Add slide'}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="mx-1 h-5 w-px bg-[#E0D8CC]" />
                <button onClick={() => moveSlide(-1)} disabled={active === 0} className={iconBtn} title={tr ? 'Sola al' : 'Move left'}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveSlide(1)}
                  disabled={active === slides.length - 1}
                  className={iconBtn}
                  title={tr ? 'Sağa al' : 'Move right'}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={removeSlide}
                  disabled={slides.length <= 1}
                  className={`${iconBtn} hover:border-[#c4293c] hover:text-[#c4293c]`}
                  title={tr ? 'Slaytı sil' : 'Delete slide'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-[#8A6E51]">
                {tr
                  ? `Slayt ${active + 1}/${slides.length} düzenleniyor. Format, tema, dil ve imza tüm slaytlarda ortaktır.`
                  : `Editing slide ${active + 1}/${slides.length}. Format, theme, language and signature are shared across slides.`}
              </p>
            </div>

            {/* Hazır Şablonlar */}
            <div>
              <span className={labelCls}>{tr ? 'Hazır Şablonlar' : 'Ready Templates'}</span>
              <div className="flex flex-wrap gap-2.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => applyPresetToActive(i)}
                    className="rounded-full border border-[#A68868]/50 bg-white px-4 py-2 text-sm font-medium text-[#071739] transition-all hover:border-[#A68868] hover:bg-[#A68868] hover:text-[#F6F4F0]"
                  >
                    {tr ? p.labelTr : p.labelEn}
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-xs text-[#8A6E51]">
                {tr
                  ? 'Tek tıkla aktif slaytı örnek içerikle doldur, sonra düzenle.'
                  : 'One click fills the active slide with an example, then edit.'}
              </p>
            </div>

            {/* Format */}
            <div>
              <span className={labelCls}>{tr ? 'Format' : 'Format'}</span>
              <div className="grid grid-cols-3 gap-2.5">
                {FORMATS.map((f) => {
                  const Icon = formatIcon(f.id);
                  const isActive = cfg.format === f.id;
                  return (
                    <button key={f.id} onClick={() => set('format', f.id)} className={chip(isActive)}>
                      <Icon className="h-4 w-4 mb-1.5" />
                      <span className="block leading-tight">{tr ? f.labelTr : f.labelEn}</span>
                      <span className={`block text-[10px] mt-1 ${isActive ? 'text-[#E3C39D]' : 'text-[#9A9488]'}`}>
                        {f.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fotoğraf arka plan */}
            <div>
              <span className={labelCls}>
                {tr ? `Fotoğraf · Slayt ${active + 1} (opsiyonel)` : `Photo · Slide ${active + 1} (optional)`}
              </span>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#071739] bg-[#071739] px-4 py-2.5 text-sm font-medium text-[#F6F4F0] transition-colors hover:bg-[#0d2450]"
                >
                  <ImagePlus className="h-4 w-4" />
                  {photo ? (tr ? 'Fotoğrafı değiştir' : 'Change photo') : tr ? 'Fotoğraf yükle' : 'Upload photo'}
                </button>
                {photo && (
                  <button
                    onClick={clearPhoto}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E0D8CC] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4759] transition-colors hover:border-[#c4293c] hover:text-[#c4293c]"
                  >
                    <Trash2 className="h-4 w-4" />
                    {tr ? 'Kaldır' : 'Remove'}
                  </button>
                )}
              </div>
              {photo && (
                <div className="mt-4">
                  <span className={labelCls}>
                    {tr ? `Perde Koyuluğu · %${cfg.overlay}` : `Overlay · ${cfg.overlay}%`}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={cfg.overlay}
                    onChange={(e) => set('overlay', Number(e.target.value))}
                    className="w-full accent-[#A68868]"
                  />
                </div>
              )}
              <p className="mt-2 text-xs text-[#8A6E51]">
                {tr
                  ? 'Bu slaytın arka planına fotoğraf koy; metin ve logo otomatik üzerine biner. Renk teması metin rengini etkilemez.'
                  : "Set a photo behind this slide; text and logo are placed on top. Color theme doesn't affect text color."}
              </p>
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
                    <button key={l} onClick={() => set('lang', l)} className={`flex-1 ${chip(cfg.lang === l)}`}>
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
              <div className="flex items-center justify-between mb-2">
                <span className={`${labelCls} mb-0`}>
                  {tr ? `Görsel Önizleme · Slayt ${active + 1}/${slides.length}` : `Preview · Slide ${active + 1}/${slides.length}`}
                </span>
                {isCarousel && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A6E51]">
                    <Images className="h-3.5 w-3.5" />
                    {slides.length} {tr ? 'slayt' : 'slides'}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-[#E0D8CC] bg-[#071739] p-4 sm:p-6 flex items-center justify-center">
                <canvas ref={canvasRef} className="max-w-full h-auto rounded-md shadow-lg" style={{ maxHeight: '62vh' }} />
              </div>

              {/* Slayt küçük gezinme noktaları */}
              {isCarousel && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-[#A68868]' : 'w-2 bg-[#D8CEBE]'}`}
                      aria-label={`Slayt ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={handleDownload}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#A68868] px-5 py-3.5 text-sm font-semibold text-[#071739] transition-colors hover:bg-[#8A6E51] hover:text-[#F6F4F0]"
              >
                <Download className="h-4 w-4" />
                {tr ? `Bu slaytı indir (PNG)` : `Download this slide (PNG)`}
              </button>
              {isCarousel && (
                <button
                  onClick={handleDownloadAll}
                  disabled={exporting}
                  className="mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#071739] px-5 py-3.5 text-sm font-semibold text-[#F6F4F0] transition-colors hover:bg-[#0d2450] disabled:opacity-60"
                >
                  <Images className="h-4 w-4" />
                  {exporting
                    ? tr
                      ? 'İndiriliyor…'
                      : 'Exporting…'
                    : tr
                      ? `Tüm slaytları indir (${slides.length})`
                      : `Download all slides (${slides.length})`}
                </button>
              )}
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
                {isCarousel
                  ? tr
                    ? 'Metin ilk slayta (kapak) göre üretilir. Tüm slaytları indir, sırayla carousel olarak paylaş.'
                    : 'Caption is generated from the first slide (cover). Export all slides and post them as a carousel in order.'
                  : tr
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
          <span className="text-[#B7AE9F]">· {tr ? 'Kurumsal içerik stüdyosu' : 'Brand content studio'}</span>
        </div>
      </div>
    </div>
  );
};

export default SocialStudio;
