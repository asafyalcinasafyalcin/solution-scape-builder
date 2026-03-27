

# Ana Sayfa Hero Banner/Slider Ekleme

## Mevcut Durum
Ana sayfa şu an referans görseldeki gibi statik bir hero section'a sahip. Kullanıcı daha önce "en üst kısma bir ana sayfa slider'ı gibi bir şey ekle" demişti ama bu henüz eklenmemiş.

## Plan

### Hero Slider Bileşeni
Mevcut statik hero'nun üstüne veya yerine otomatik geçişli bir banner/slider eklenecek. 3 slide ile dönecek:

**Slide 1** — Anahtar Teslim Üretim Tesisleri (mevcut hero içeriği)
**Slide 2** — Konfigüratör tanıtımı ("Üretim hattınızı online konfigüre edin" → /konfigurator linki)
**Slide 3** — Referanslar / 30+ ülke ("Dünya genelinde 30+ ülkede üretim çözümleri")

### Teknik Detaylar
- `useState` + `useEffect` ile 5 saniyede bir otomatik geçiş
- Alt kısımda dot navigasyon (tıklanabilir)
- Geçiş animasyonu: `opacity` + `translate` ile fade/slide efekti (CSS transition)
- Her slide: tam genişlik, `bg-navy-deep`, farklı içerik/ikon/CTA
- Mevcut 2 sütunlu hero layout korunur, sadece sol taraf içeriği slide'a göre değişir
- Mobil uyumlu

### Dosyalar

| Dosya | Değişiklik |
|---|---|
| `src/pages/Index.tsx` | Hero section'a slider state + 3 slide içeriği + dot navigasyon + auto-rotate |
| `src/contexts/LanguageContext.tsx` | Slide 2 ve 3 için TR/EN çeviri anahtarları |

