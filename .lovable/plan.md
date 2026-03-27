

# Konfigüratör Sayfasına Hero Banner/Slider Ekleme

## Plan

Ana sayfadaki (`Index.tsx`) hero slider bileşenini konfigüratör sayfasının (`Configurator.tsx`) üst kısmına ekleyeceğiz. Mevcut breadcrumb + statik hero kısmı kaldırılıp yerine aynı premium slider gelecek.

### Değişiklikler

**`src/pages/Configurator.tsx`**:
- Slider state'i ekle (`currentSlide`, `useEffect` auto-rotate, `useCallback`)
- Mevcut breadcrumb + statik hero bölümünü kaldır
- Yerine `Index.tsx`'deki hero section'ın aynısını ekle (navy-deep arka plan, 2 sütun layout, 3 slide, dot navigasyon)
- Sağ sütundaki "WE SUPPORT" listesi yerine konfigüratöre özel 4 madde koyulabilir (Salça & Domates, Sos Hatları, Süt Prosesi, Dolum & Paketleme — mevcut tab'lara karşılık)
- Slider içerikleri konfigüratöre uygun olacak (ör. "Üretim hattınızı konfigüre edin", "Salça hatları", "Sos & süt prosesi")
- Tabs bölümü slider'ın altında aynen kalacak

**`src/contexts/LanguageContext.tsx`**:
- Konfigüratör sayfası slider'ı için yeni TR/EN çeviri anahtarları

### Teknik Detaylar
- Slider: `useState` + `useEffect` ile 5sn auto-rotate
- Geçiş: `opacity` + `translateY` CSS transition (700ms)
- Dot navigasyon: tıklanabilir, aktif dot genişler
- Radial gradient arka plan pattern
- Mobil uyumlu: `lg:grid-cols-2` → tek sütun

| Dosya | Değişiklik |
|---|---|
| `src/pages/Configurator.tsx` | Statik hero → slider hero, slider state/logic, premium 2-sütun layout |
| `src/contexts/LanguageContext.tsx` | Konfigüratör slider çeviri anahtarları |

