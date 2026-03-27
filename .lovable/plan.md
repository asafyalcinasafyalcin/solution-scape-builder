

# Konfigüratör Geliştirmeleri + Tasarım Dili Güncelleme

## Referans Tasarım Analizi
[Project Proposal Hub](/projects/eddc885d-36f4-4c8f-bb53-3740c60ddb21) projesindeki tasarım dili:
- **Renkler**: `navy-deep` (222 58% 8%), `navy` (220 55% 11%), `amber` (345 100% 60%) accent olarak, `steel` (215 18% 52%), `warm-gray`, `surface`
- **Gölgeler**: `shadow-premium`, `shadow-premium-lg`, `shadow-premium-xl` — yumuşak, katmanlı
- **Kartlar**: `border-t-2 border-t-amber/30`, gradient navy ikonlar, `border-border-strong`
- **Tipografi**: `tracking-[0.25em] uppercase` etiketler, `font-light` başlıklar, daha ince/rafine
- **Genel**: Daha koyu lacivert tonları, kırmızı yerine amber-kırmızı accent, radial gradient arka planlar

## Plan

### 1. Tasarım Sistemi Güncelleme

**`src/index.css`**: Referans projedeki CSS değişkenlerini ekle:
- `--navy-deep`, `--warm-gray`, `--steel`, `--surface`, `--border-strong` ekle
- `--amber` / `--amber-dark` / `--amber-foreground` ekle (mevcut `--red` ile paralel)
- Utility class'ları ekle: `bg-navy-deep`, `text-steel`, `bg-warm-gray`, `bg-surface`, `border-border-strong`

**`tailwind.config.ts`**: Yeni renkleri Tailwind'e ekle:
- `navy.deep`, `amber`, `warm-gray`, `surface`, `steel`, `border-strong`
- `boxShadow`: `premium`, `premium-lg`, `premium-xl`

### 2. MACLINE — Brix/Kapasite Hesaplayıcı + Karşılaştırma Tablosu

**`MaclineConfigurator.tsx`**:
- **Brix hesaplayıcı bölümü**: 3 slider (Hammadde Brix 4-8, Hedef Brix 28-36, Günlük çalışma saati 8-24). Formül ile günlük salça çıktısı hesaplanır, uygun paket önerilir
- **Tam karşılaştırma tablosu**: Tüm paketler yan yana, tüm özellikler satır satır (fiyat, kapasite, ürünler, elektrik, buhar, su). Seçili paket vurgulu
- Kartlara büyük Lucide ikonları eklenir (Factory, Boxes, Crown vb.)
- Tasarım dili: `border-t-2 border-t-amber/30`, `shadow-premium`, gradient navy ikon kutuları

### 3. Sos & Süt Konfigüratörleri — Görsel İyileştirme

**`SauceConfigurator.tsx`**:
- Hat kartlarına büyük ikonlar (Beaker, FlaskConical, Warehouse)
- `shadow-premium` gölge, `border-t-2 border-t-amber/30` üst kenarlık
- Gradient navy ikon kutuları

**`DairyConfigurator.tsx`**:
- Makine kartlarına ikonlar (Thermometer, Gauge, Filter, Wind, Flame, CookingPot, Milk, PackageCheck)
- Aynı kart stili: premium gölge, amber accent, gradient ikon kutuları

### 4. Ana Konfigüratör Sayfası — Animasyon + Tab İkonları

**`Configurator.tsx`**:
- Tab ikonları büyütülür (h-5 w-5), her biri amber renkli ikon kutusunda
- TabsContent'e `animate-fade-in` class eklenir
- Hero bölümüne referanstaki gibi `tracking-[0.25em] uppercase` etiket + `font-light` başlık stili
- Arka plana hafif radial gradient pattern

### 5. Teklif Formu Tasarım Güncellemesi

**`ConfiguratorQuoteForm.tsx`**:
- Form kartına `shadow-premium-lg`, `border-t-2 border-t-amber/30`
- Submit buton: `bg-amber hover:bg-amber-dark` stili
- Input'lara `border-border-strong` kenarlık

## Dosya Listesi

| Dosya | Değişiklik |
|---|---|
| `src/index.css` | Yeni CSS değişkenleri + utility class'lar |
| `tailwind.config.ts` | Yeni renkler + premium shadow'lar |
| `src/components/configurator/MaclineConfigurator.tsx` | Brix hesaplayıcı, karşılaştırma tablosu, ikonlar, yeni tasarım |
| `src/components/configurator/SauceConfigurator.tsx` | İkonlar, premium kart stili |
| `src/components/configurator/DairyConfigurator.tsx` | İkonlar, premium kart stili |
| `src/pages/Configurator.tsx` | Tab animasyonları, büyük ikonlar, hero stili |
| `src/components/configurator/ConfiguratorQuoteForm.tsx` | Premium form tasarımı |

