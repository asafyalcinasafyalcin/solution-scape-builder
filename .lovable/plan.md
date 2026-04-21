

# Menü Sadeleştirme + Görsel Sadeleşme

## Hedef
Karmaşıklığı azaltmak, ziyaretçinin ne yaptığımızı bir bakışta anlamasını sağlamak. Üst menüde sadece **3 ana giriş**: Ana Sayfa, Çözümler, Konfigüratör. Header alanı sade, modern ve kurumsal kalacak; iletişim bilgisi (telefon/e-posta) sağ tarafta küçük şekilde tutulacak.

## 1. Header sadeleştirme (`src/components/layout/Header.tsx`)

Mevcut menü öğeleri (Hazır Hatlar, Tekil Makineler, Özel Projeler, Hizmetler, Referanslar, Kurumsal, Blog, İletişim + dropdown'lar) kaldırılacak. Yerine:

- **Logo** (sol) — `processturk.com` yazısı küçük olarak logonun yanında
- **3 ana link** (orta): `Ana Sayfa` · `Çözümler` · `Konfigüratör`
- **Sağ taraf**: Dil seçici (TR/EN) + tek küçük "Teklif Al" butonu (amber)
- Aktif sayfa amber alt çizgi ile vurgulanacak
- Mobile menü de aynı 3 link

Diğer sayfa route'ları (Blog, Referanslar, Kurumsal vb.) silinmeyecek — sadece menüden kaldırılacak. Footer ve iç linkler üzerinden hâlâ erişilebilir kalacak (eski içerik kaybolmasın).

## 2. Footer sadeleştirme (`src/components/layout/Footer.tsx`)

Çok sütunlu footer yerine **tek satırlı sade footer**:
- Sol: Logo + kısa açıklama (1 cümle)
- Orta: 3 ana link (Ana Sayfa · Çözümler · Konfigüratör)
- Sağ: İletişim (telefon + e-posta) + WhatsApp ikonu
- Alt: Telif satırı

Floating WhatsApp butonu (sağ alt) korunacak.

## 3. Ana Sayfa sadeleşmesi (`src/pages/Index.tsx`)

Sayfa şu an çok bölümlü ve "support" listesi karmaşık görünüyor. Yeniden yapı:

1. **Hero Slider** (mevcut, korunur) — ama sağ sütundaki 4'lü "WE SUPPORT" listesi kaldırılıp yerine **tek büyük ürün/tesis görseli** veya minimal grafik konulacak. Daha az metin = daha güçlü mesaj.
2. **3 Ana Kart** (mevcut Quick Cards, korunur) — `Hazır Hatlar`, `Konfigüratör`, `Özel Projeler` — site ne sunuyor sorusunun cevabı. Konfigüratör kartı eklenecek (yerine Tekil Makineler çıkar).
3. **Süreç adımları** (mevcut, korunur, sadeleştirilir) — 6 adım görsel olarak akış halinde
4. **CTA Banner** (mevcut, korunur)

Feature bar (4'lü amber ikonlar) kaldırılacak — gereksiz tekrar.

## 4. Çözümler Sayfası (`src/pages/Solutions.tsx`)

Mevcut tasarım eski stilde (mavi/beyaz). Premium dile uyumlu hale getirilecek:
- Üstte navy-deep hero (tek sütun, başlık + açıklama, slider yok)
- 3 çözüm kartı: amber accent, gradient navy ikon kutuları, premium shadow
- Alt CTA banner premium stile uygun

## 5. Yönlendirmeler

Çözümler sayfasındaki 3 kart "İletişim" yerine ilgili konfigüratör veya kategori sayfasına yönlendirilecek (Hazır Hatlar kartı → konfigüratöre, Mühendislik → konfigüratöre, Kurulum → iletişime). Böylece kullanıcı somut adıma yönlendirilir.

## Değişen dosyalar

| Dosya | Değişiklik |
|---|---|
| `src/components/layout/Header.tsx` | Menü sadeleştirme: 3 link, dropdown'lar kaldırıldı |
| `src/components/layout/Footer.tsx` | Sade tek satırlı footer |
| `src/pages/Index.tsx` | Hero sağ sütun sadeleştirme, feature bar kaldırma, kart düzeni |
| `src/pages/Solutions.tsx` | Premium tasarım (navy-deep, amber, gradient ikonlar) |

## Korunan
- Tüm route'lar ve sayfalar dosya olarak korunur (Blog, Referanslar, Kurumsal, vb.)
- Konfigüratör sayfası ve hero slider'ı aynen kalır
- Dil sistemi (TR/EN) korunur
- WhatsApp floating buton korunur

