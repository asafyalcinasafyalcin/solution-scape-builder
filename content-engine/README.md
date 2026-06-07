# ProcessTürk İçerik Motoru (LinkedIn) — Faz 1

ProcessTürk için güncel sektör/ekonomi haberlerini takip eden, bunları ProcessTürk
bakış açısıyla yorumlayan **Türkçe + İngilizce** LinkedIn taslakları üreten ve bir
**onay panelinden** geçiren yarı-otomatik içerik sistemi.

> **Faz 1 hedefi:** Hiçbir LinkedIn API onayı beklemeden, ilk günden değer üretmek.
> Sistem taslak üretir → sen düzenler/onaylarsın → "Kopyala" ile LinkedIn'e elle
> yapıştırırsın. Otomatik paylaşım (API) Faz 2/3'te eklenir.

## Mimari

```
RSS haberler → filtre/dedupe → Claude (TR+EN taslak) → SQLite → Onay paneli → Kopyala-yapıştır
        ▲                                                                    ▲
GitHub Actions cron (günlük)                                         "Şimdi Üret" (manuel)
```

- **Backend:** Node + TypeScript + Hono API, SQLite (`better-sqlite3`).
- **AI:** Anthropic SDK, `claude-sonnet-4-6`, statik marka profili **prompt caching** ile.
- **Panel:** React + Vite + Tailwind (`dashboard/`).
- **Haber:** `rss-parser` (kaynaklar `config/news-sources.json`).
- **Marka sesi:** `config/brand-profile.json` (web sitesindeki ürün verisinden seed edildi).

## Kurulum

```bash
cd content-engine
bun install                 # veya: npm install
cp .env.example .env        # ANTHROPIC_API_KEY ve DASHBOARD_AUTH_TOKEN'ı doldurun
```

### Çalıştırma

```bash
# 1) Haber çek + taslak üret (manuel pipeline)
bun run pipeline:daily

# 2) API sunucusunu başlat (panel buna bağlanır)
bun run start               # http://localhost:8787

# 3) Ayrı bir terminalde paneli başlat
cd dashboard && bun install && bun run dev   # http://localhost:5174
```

Panelde sağ üstteki kutuya `.env`'deki `DASHBOARD_AUTH_TOKEN` değerini girin.

## Yapılandırma

### `config/news-sources.json`
RSS kaynaklarını ve anahtar kelimeleri buradan yönetirsiniz.
> ⚠️ Mevcut feed URL'leri **örnektir** ve `enabled: false`'dur. Gerçek, geçerli XML
> dönen kaynaklarla değiştirip `enabled: true` yapın (Türk ekonomi/sanayi basını,
> gıda/paketleme sektör yayınları, ihracat/ticaret kaynakları).

- `keywords.include` / `exclude`: başlık eşleşmesi 2, özet eşleşmesi 1 puan; exclude eşleşmesi öğeyi eler.
- `minScore`, `lookbackHours`, `maxItemsPerRun` ile hassasiyeti ayarlayın.

### `config/brand-profile.json`
Marka sesi, ürün hatları, değer sütunları, yapılacaklar/yapılmayacaklar. Üretim
prompt'unun statik (cache'lenen) kısmını besler.

## API uçları (özet)
- `GET /api/drafts?status=pending_review` — taslakları listele
- `PATCH /api/drafts/:id` — gövde/hashtag/hedef düzenle
- `POST /api/drafts/:id/approve` — onayla, kopyala-yapıştır metni döner
- `POST /api/drafts/:id/reject` — reddet
- `POST /api/drafts/:id/publish` — "paylaşıldı" işaretle + kayıt
- `POST /api/generate` — manuel ingest + üretim
- `GET /api/postlog` — geçmiş

## Zamanlama (otomatik günlük taslak)
`.github/workflows/content-engine-daily.yml` her gün 06:00 UTC'de pipeline'ı çalıştırır
(`workflow_dispatch` ile elle de tetiklenir). GitHub'da **repo secret** olarak
`ANTHROPIC_API_KEY` tanımlayın.

> **Not:** GitHub Actions çalışanı geçicidir; üretilen SQLite veritabanı artifact
> olarak saklanır. Taslakların panelden her yerden sürekli görünmesi için kalıcı bir
> DB'ye (ör. Supabase/Postgres) geçilmesi önerilir — `src/db/client.ts` repository
> katmanı bu geçişi kolaylaştırır. Tek makinede yerel kullanımda SQLite yeterlidir.

## Test
```bash
bun run test        # filtreleme ve JSON ayıklama birim testleri
```

## Yol haritası
- **Faz 1 (bu sürüm):** Taslak + onay paneli + kopyala-yapıştır. ✅
- **Faz 2:** LinkedIn kişisel profile OAuth ile otomatik paylaşım (`w_member_social`).
- **Faz 3:** Şirket sayfası (`w_organization_social`, Community Management API onayı) + X.
