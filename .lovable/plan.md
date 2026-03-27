

# Ana Sayfa Premium Tasarım + Hero Slider Güncellemesi

## 1. Ana Sayfa Hero - Referans Stilinde Yeniden Tasarım

Mevcut hero section'ı referans görseldeki gibi koyu navy (`bg-navy-deep`) arka planlı, 2 sütunlu layout'a dönüştüreceğiz:

**Sol taraf:**
- `INDUSTRIAL SOLUTIONS` / `ENDÜSTRİYEL ÇÖZÜMLER` — `tracking-[0.25em] uppercase text-amber` etiket
- `Request a Proposal for` — `font-light text-4xl`
- `Your Production Project` — `font-bold italic text-5xl` (amber alt çizgi)
- Açıklama metni — `text-steel`
- 2 buton: `SEND PROJECT DETAILS` (amber bg) + `Explore Solutions` (ghost)

**Sag taraf:**
- "WE SUPPORT" kart listesi — koyu kart arka plan, her item'da amber tonlu ikon + baslik + aciklama
- Items: Ready Lines, Single Machines, Custom Projects, Technical Coordination

**Alt bar:**
- 4 ikon + metin: Turnkey Coordination, Flexible Sourcing, Multi-Sector Expertise, Structured Proposals
- Amber ikonlar, `tracking-[0.15em] uppercase text-xs` etiketler

## 2. Quick Access Cards - Premium Stil

Mevcut kartlara premium tasarim uygula:
- `border-t-2 border-t-amber/30`, `shadow-premium`
- Gradient navy ikon kutulari (`bg-gradient-to-br from-navy-deep to-navy`)
- `hover:shadow-premium-lg hover:scale-[1.02]` animasyonlar

## 3. Process Steps - Premium Stil

- Arka plan: `bg-navy-deep` yerine koyu navy gradient
- Step ikonlari: amber hover efekti, gradient ikon kutulari
- Baslık: `font-light`, üstte `tracking-[0.25em] uppercase` etiket

## 4. CTA Banner - Premium Stil

- `bg-gradient-to-r from-amber to-amber-dark` arka plan
- Veya navy arka plan + amber buton kombinasyonu

## 5. Konfigüratör Mobil Kontrol + Test

Konfigüratör sayfasındaki tablo ve slider'ların mobil uyumluluğu kontrol edilecek, gerekirse `overflow-x-auto` ve responsive düzeltmeler yapılacak.

## Dosya Listesi

| Dosya | Degisiklik |
|---|---|
| `src/pages/Index.tsx` | Hero section yeniden tasarım (referans stilinde 2 sütun), kartlar premium stil, process steps premium, CTA güncelleme |
| `src/contexts/LanguageContext.tsx` | Yeni hero çeviri anahtarları (TR/EN) |

