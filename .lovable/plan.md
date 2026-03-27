

# Dolum & Paketleme - İnteraktif Hat Oluşturucu

## Konsept
Kullanıcılar adım adım kendi dolum hattını oluşturabilecek bir "Line Builder" arayüzü. Sayfanın üst kısmında mevcut makine kataloğu kalacak, altına interaktif hat oluşturucu eklenecek.

## Hat Oluşturucu Akışı (4 Adım)

**Adım 1 - Ürün Tipi Seç**
- Sıvı (su, süt, meyve suyu)
- Yarı akışkan (yoğurt, bal, reçel)
- Viskoz (salça, ketçap, mayonez)
- Toz / Granül

**Adım 2 - Kapasite Seç**
- Küçük (500-2.000 adet/saat)
- Orta (2.000-5.000 adet/saat)
- Büyük (5.000-10.000 adet/saat)
- Endüstriyel (10.000+ adet/saat)

**Adım 3 - Ambalaj Tipi Seç**
- Cam Şişe
- Pet Şişe
- Teneke Kutu
- Pouch / Doypack
- Kavanoz
- Bidon / IBC

**Adım 4 - Hat Ekipmanları Seç**
Seçimlere göre önerilen makineler otomatik işaretlenir, kullanıcı ekleyip çıkarabilir:
- Dolum makinesi (tip otomatik önerilir)
- Kapak kapama (ambalaja göre önerilir)
- Etiketleme
- Shrink ambalaj
- Konveyör sistemi
- UV / Sterilizasyon
- Birikim masası

## Özet & Teklif
Seçimler tamamlandığında görsel bir hat özeti gösterilir (seçilen makineler sıralı akış şeklinde). "Bu Hat İçin Teklif Al" butonu ile seçimler iletişim formuna parametre olarak aktarılır (mailto veya Contact sayfasına yönlendirme).

## Teknik Detaylar

### Dosya Değişiklikleri
1. **`src/pages/FillingMachines.tsx`** - Mevcut sayfa korunur, altına `<LineBuilder />` bileşeni eklenir
2. **`src/components/filling/LineBuilder.tsx`** (yeni) - Ana hat oluşturucu bileşeni. State ile adım yönetimi, seçim mantığı, öneri algoritması
3. **`src/components/filling/LineBuilderStep.tsx`** (yeni) - Tekrar kullanılabilir adım kartı bileşeni
4. **`src/components/filling/LineSummary.tsx`** (yeni) - Seçim özeti ve görsel akış diyagramı
5. **`src/contexts/LanguageContext.tsx`** - Hat oluşturucu için TR/EN çeviri anahtarları eklenir

### UI Tasarımı
- Stepper/progress bar ile adım takibi
- Kart bazlı seçim (tıkla-seç, çoklu seçim desteği)
- Seçili öğeler accent rengiyle vurgulanır
- Özet bölümünde yatay akış diyagramı (makine ikonları → oklar)
- Mobil uyumlu: dikey akış

