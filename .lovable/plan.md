

# Dolum Hattı Oluşturucu - Geliştirmeler

## 3 Ana Değişiklik

### 1. Yeni Adım: Ambalaj Kapasitesi (Adım 4)
Ambalaj tipi seçildikten sonra, ambalaj kapasitesi/hacmi sorulacak:
- 0.25 L / 250 ml
- 0.5 L / 500 ml
- 1 L
- 2 L
- 5 L
- 10 L / Bidon
- 25 L+

Toplam akış: Ürün Tipi → Kapasite → Ambalaj Tipi → **Ambalaj Hacmi** → Ekipman Seçimi (5 adım)

### 2. Teklif Akışı: Özet + İletişim Formu + E-posta
Şu an "Teklif Al" butonu iletişim sayfasına yönlendiriyor. Bunun yerine:
- Tüm adımlar tamamlanınca **özet kartı** gösterilecek
- "Bu Hat İçin Teklif İste" butonuna basınca **iletişim formu açılacak** (inline, aynı sayfada)
  - Ad Soyad, Firma, E-posta, Telefon, Ek Not alanları
- Form doldurulup gönderildiğinde hat konfigürasyonu + iletişim bilgileri birleştirilerek **teknik ofise mailto ile e-posta** oluşturulacak
- Gönderim sonrası başarı mesajı

### 3. Butonlar: Daha Büyük, Görsel, Modern
`LineBuilderStep` bileşenindeki seçim kartları yeniden tasarlanacak:
- Daha büyük boyut (min-height: 120px)
- Her seçenek için ilgili ikon (Lucide)
- Hover animasyonu (scale, shadow, border glow)
- Seçili durumda belirgin accent arka plan + büyük onay ikonu
- Grid: mobilde 2 sütun, masaüstünde 3-4 sütun

## Teknik Değişiklikler

| Dosya | Değişiklik |
|-------|-----------|
| `LineBuilder.tsx` | Yeni `packagingCapacity` state, 5 adımlı akış, inline iletişim formu state'i, mailto gönderim |
| `LineBuilderStep.tsx` | Büyük kartlar, ikon desteği, hover/scale animasyonları |
| `LineSummary.tsx` | Ambalaj hacmi alanı ekleme, "Teklif İste" → inline form açma, form submit → mailto |
| `LanguageContext.tsx` | Ambalaj hacmi çevirileri (TR/EN), form alan çevirileri |

