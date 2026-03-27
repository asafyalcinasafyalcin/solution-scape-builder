

# Birleşik Konfigüratör Sayfası - Uygulama Planı

## Konsept

Diğer 3 projede ayrı ayrı hazırladığımız konfigüratör/seçici araçları tek bir sayfada (`/konfigurator`) birleştiriyoruz. Sayfa üstte 4 kategori sekmesi sunacak, her sekme ilgili ürün grubunun interaktif konfigüratörünü gösterecek. Mevcut "Komple dolum hattı" CTA bölümü kaldırılıp LineBuilder bu yeni sayfaya taşınacak.

## Sayfa Yapısı

```text
┌─────────────────────────────────────────────┐
│  Hero: "Üretim Hattınızı Konfigüre Edin"   │
├─────────────────────────────────────────────┤
│  [Salça/Domates] [Sos Hatları] [Süt] [Dolum]│  ← Tab Navigation
├─────────────────────────────────────────────┤
│                                             │
│   Aktif sekmenin konfigüratör içeriği       │
│                                             │
├─────────────────────────────────────────────┤
│   Ortak Teklif Formu (tüm sekmelerden       │
│   seçimler toplanarak mailto gönderilir)    │
└─────────────────────────────────────────────┘
```

## 4 Sekme Detayları

### 1. Salça & Domates (MACLINE)
Diğer projeden (`salca-sos-configurator`) alınacak:
- Paket karşılaştırma ve seçici (ECO, PLUS, PRO, PREMIUM, JUICE)
- Kapasite hesaplayıcı (hammadde Brix, günlük kapasite slider)
- Opsiyonel ekipmanlar (etiketleme, kapak kapama vb.)
- Paket fiyatları ve teknik detaylar

### 2. Sos Hatları (SAUCE)
Diğer projeden (`sauce-sparkle-flow`) alınacak:
- Hat seçici (SAUCE 500, 1000, 1500)
- Fiyat ve konfigüratör (dahil olan / opsiyonel ekipmanlar)
- Teknik detaylar paneli

### 3. Süt Prosesi
Diğer projeden (`processmate-builder`) alınacak:
- Makine kategori seçimi (Pastörizatör, Homojenizatör, Separatör, vb.)
- Model ve kapasite seçimi
- Kapasite hesaplayıcı (günlük/haftalık/aylık üretim)
- Ürün tipi seçimi (süt, yoğurt, peynir, vb.)

### 4. Dolum & Paketleme
Mevcut `LineBuilder` bileşeni buraya taşınacak:
- 5 adımlı hat oluşturucu (ürün tipi → kapasite → ambalaj → hacim → ekipman)
- Otomatik ekipman önerisi
- Özet ve teklif formu

## Teknik Değişiklikler

| Dosya | Değişiklik |
|---|---|
| `src/pages/Configurator.tsx` | Yeni sayfa: Hero + Tab navigation + 4 sekme içeriği + ortak teklif formu |
| `src/components/configurator/MaclineConfigurator.tsx` | Salça/Domates konfigüratör (paket seçici + kapasite hesaplayıcı + opsiyoneller) |
| `src/components/configurator/SauceConfigurator.tsx` | Sos hattı konfigüratör (hat seçici + fiyat + teknik detay) |
| `src/components/configurator/DairyConfigurator.tsx` | Süt makine konfigüratör (kategori/model/kapasite seçici + hesaplayıcı) |
| `src/data/maclineData.ts` | MACLINE paket verileri (fiyat, kapasite, ürünler, opsiyoneller) |
| `src/data/sauceData.ts` | SAUCE hat verileri (500/1000/1500 fiyat ve ekipmanlar) |
| `src/data/dairyData.ts` | Süt makine modelleri ve kapasite verileri |
| `src/App.tsx` | `/konfigurator` route ekleme |
| `src/pages/FillingMachines.tsx` | "Komple dolum hattı" CTA kaldırılır, LineBuilder kaldırılır, yerine Konfigüratör sayfasına yönlendirme |
| `src/contexts/LanguageContext.tsx` | Konfigüratör çevirileri (TR/EN) |
| Header navigasyonu | Konfigüratör sayfasına link ekleme |

## Veri Kaynağı
Her projeden ilgili ürün verileri, fiyatlar ve teknik bilgiler ayrı data dosyalarına çekilecek. Konfigüratör bileşenleri bu datayı kullanacak. Framer-motion animasyonları yerine Tailwind CSS geçişleri kullanılacak (mevcut projeyle tutarlılık).

## Teklif Formu
Sayfanın alt kısmında tüm sekmelerden yapılan seçimleri toplayan tek bir teklif formu:
- Ad Soyad, Firma, E-posta, Telefon, Ek Not
- Seçilen konfigürasyon özeti otomatik eklenir
- `mailto:info@processturk.com` ile teknik ofise gönderilir

