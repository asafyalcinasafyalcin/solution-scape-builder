import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Copy, Check, Languages } from "lucide-react";

async function generateContent(payload: object) {
  const resp = await fetch("/api/content/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error("İçerik üretimi başarısız");
  return resp.json();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-gray-400 hover:text-gray-600 p-1">
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function ContentBlock({ label, content, isAr = false }: { label: string; content: string; isAr?: boolean }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        <CopyButton text={content} />
      </div>
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm ${isAr ? "text-right font-arabic" : ""}`} dir={isAr ? "rtl" : "ltr"}>
        {content}
      </div>
    </div>
  );
}

export default function ContentGenerator() {
  const [form, setForm] = useState({
    product_name: "Türk Pamuklu Banyo Havlusu 70x140cm",
    category: "Home Textiles",
    brand: "",
    platform: "both",
    features: "100% pamuk\n70x140cm\nMade in Turkey\nFastboya dayanıklı\n500g/m²",
    keywords: "turkish towel, bath towel, cotton towel UAE, منشفة قطنية",
  });

  const { mutate, data, isPending, error } = useMutation({ mutationFn: generateContent });

  const handleSubmit = () => {
    mutate({
      product_name: form.product_name,
      category: form.category,
      brand: form.brand,
      platform: form.platform,
      key_features: form.features.split("\n").filter(Boolean),
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    });
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-dubai-gold" />
          Claude AI ile İçerik Üretimi
        </h1>
        <p className="text-gray-500 mt-1">
          Amazon.ae ve noon.com için İngilizce + Arapça (EN/AR) SEO listing içeriği
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="font-bold mb-4">Ürün Bilgileri</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">Ürün Adı</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500">Kategori</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Marka</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Marka adı"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">Platform</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
              >
                <option value="both">Amazon.ae + noon.com (ikisi için optimize)</option>
                <option value="amazon">Yalnızca Amazon.ae</option>
                <option value="noon">Yalnızca noon.com</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">Temel Özellikler (her satıra bir özellik)</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 h-28 resize-none"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">
                Anahtar Kelimeler (virgülle ayır — Helium 10'dan al)
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="turkish towel, bath towel, منشفة"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isPending || !form.product_name}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isPending ? "Claude ile oluşturuluyor..." : "İçerik Üret (EN + AR)"}
            </button>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                Hata: ANTHROPIC_API_KEY ayarlandığından emin olun
              </p>
            )}
          </div>
        </div>

        {/* Sonuç */}
        <div>
          {data ? (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-dubai-gold" />
                <h2 className="font-bold">Üretilen İçerik</h2>
              </div>

              <div className="border-b border-gray-100 mb-4 pb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">İngilizce (EN)</span>
              </div>
              <ContentBlock label="Başlık (EN)" content={data.title_en} />
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Madde İşaretleri (EN)</label>
                </div>
                <ul className="space-y-1">
                  {data.bullet_points_en?.map((bp: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-gray-400">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ContentBlock label="Açıklama (EN)" content={data.description_en} />

              <div className="border-b border-gray-100 mb-4 pb-2 mt-6">
                <span className="text-xs font-bold text-gray-400 uppercase">العربية (AR)</span>
              </div>
              <ContentBlock label="العنوان (AR)" content={data.title_ar} isAr />
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">النقاط الرئيسية (AR)</label>
                <ul className="space-y-1 mt-1" dir="rtl">
                  {data.bullet_points_ar?.map((bp: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm font-arabic text-right">
                      <span className="text-gray-400">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ContentBlock label="الوصف (AR)" content={data.description_ar} isAr />
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center h-full text-gray-400 py-16">
              <Sparkles className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">İçerik burada görünecek</p>
              <p className="text-sm mt-1">Formu doldurun ve "İçerik Üret" butonuna tıklayın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
