# VPS Kurulum Rehberi

Platform tek Docker container olarak çalışır: React arayüz + FastAPI backend +
Google Chrome + sanal ekran (xvfb). Tek port: **8000**.

## Gereksinimler

- Ubuntu/Debian VPS (min 2 GB RAM — Chrome için)
- Docker + Docker Compose eklentisi

Docker kurulu değilse:

```bash
curl -fsSL https://get.docker.com | sh
```

## Kurulum (ilk kez)

```bash
git clone https://github.com/asafyalcinasafyalcin/solution-scape-builder.git
cd solution-scape-builder
git checkout claude/dubai-company-setup-s7wh6y
cd dubai-ecommerce
docker compose up -d --build
```

İlk build ~5-10 dakika sürer (Chrome + Python bağımlılıkları iniyor).

## Giriş

Tarayıcıdan: `http://VPS_IP_ADRESI:8000`

Kullanıcı adı/şifre sorar (Basic Auth):
- Kullanıcı: `asaf`
- Şifre: `Dubai2026!`

Şifreyi değiştirmek için `docker-compose.yml` içindeki `BASIC_AUTH_USER` /
`BASIC_AUTH_PASS` değerlerini düzenleyip `docker compose up -d` çalıştırın.

## Kullanım

1. **Hesap Kurulum → Sekme 1**: Şirket bilgilerini doldur (VPS'te ilk sefer yeniden gerekir)
2. **Sekme 2**: 3 belgeyi yükle (ticaret lisansı, pasaport, banka ekstresi)
3. **Sekme 3**: "noon Kaydını Başlat"
4. **Sekme 4**: Canlı takip — ekran görüntüleri, OTP girişi

Belgeler ve durum `backend/uploads/` klasöründe kalıcıdır (container yeniden
başlasa da silinmez).

## Güncelleme (yeni kod geldiğinde)

```bash
cd solution-scape-builder
git pull
cd dubai-ecommerce
docker compose up -d --build
```

## Loglar / Sorun Giderme

```bash
docker logs -f dubai-ecommerce      # canlı log
docker compose restart              # yeniden başlat
docker compose down                 # durdur
```

## Notlar

- Otomasyon gerçek Google Chrome ile sanal ekranda (xvfb) çalışır — headless
  bot tespitine takılmaz.
- noon/Amazon, datacenter IP'lerine karşı ek doğrulama isteyebilir. SMS OTP
  adımları zaten telefonunuza düşer; ekstra CAPTCHA çıkarsa Sekme 4'teki ekran
  görüntüsünde görünür.
- Amazon video doğrulama adımı otomatikleştirilemez — sistem o adımda durup
  yönlendirme gösterir.
