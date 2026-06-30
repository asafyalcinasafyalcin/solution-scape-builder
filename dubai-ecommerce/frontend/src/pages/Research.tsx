import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, TrendingUp, AlertTriangle, CheckCircle2, Plus, Trash2 } from "lucide-react";

interface Candidate {
  name: string;
  category: string;
  estimated_price_aed: number;
  estimated_cost_try: number;
  amazon_bsr: number | null;
  noon_demand_confirmed: boolean;
  turkey_supplier_available: boolean;
  requires_ecas_tdra: boolean;
  requires_distributor_auth: boolean;
}

const CATEGORIES = [
  { value: "home_textiles", label: "Ev Tekstili (noon ~%15)" },
  { value: "clothing", label: "Giyim / Moda (noon ~%27)" },
  { value: "baby", label: "Bebek & Çocuk (noon ~%15)" },
  { value: "kitchen", label: "Mutfak (noon ~%12)" },
  { value: "toys", label: "Oyuncak (noon ~%15)" },
];

const DEFAULT_CANDIDATE: Candidate = {
  name: "",
  category: "home_textiles",
  estimated_price_aed: 50,
  estimated_cost_try: 200,
  amazon_bsr: null,
  noon_demand_confirmed: false,
  turkey_supplier_available: true,
  requires_ecas_tdra: false,
  requires_distributor_auth: false,
};

async function scoreProducts(candidates: Candidate[]) {
  const resp = await fetch("/api/research/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidates),
  });
  return resp.json();
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : score >= 30 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-bold w-8 text-right">{Math.round(score)}</span>
    </div>
  );
}

export default function Research() {
  const [candidates, setCandidates] = useState<Candidate[]>([{ ...DEFAULT_CANDIDATE, name: "Türk Pamuklu Havlu 70x140" }]);

  const { mutate: runScore, data: results, isPending } = useMutation({
    mutationFn: scoreProducts,
  });

  const addCandidate = () => setCandidates((prev) => [...prev, { ...DEFAULT_CANDIDATE }]);
  const removeCandidate = (i: number) => setCandidates((prev) => prev.filter((_, idx) => idx !== i));
  const updateCandidate = (i: number, field: keyof Candidate, value: any) => {
    setCandidates((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ürün Araştırma & Fırsat Skoru</h1>
        <p className="text-gray-500 mt-1">
          Amazon.ae BSR + noon talebi + Türkiye tedarik + marj hesabı → 0-100 fırsat skoru
        </p>
      </div>

      {/* Araştırma ipuçları */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-blue-800 mb-1">Amazon.ae BSR Bulma</p>
          <p className="text-blue-700">Helium 10 Diamond → Avrupa bölgesi → Black Box/Xray ile BSR &lt; 5000 ara</p>
        </div>
        <div>
          <p className="font-semibold text-blue-800 mb-1">noon Talep Doğrulama</p>
          <p className="text-blue-700">NoonSeller.ae Chrome eklentisi → kategori en çok satanlar → satış tahmini rozeti</p>
        </div>
      </div>

      {/* Aday girişi */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Ürün Adayları</h2>
          <button onClick={addCandidate} className="btn-primary flex items-center gap-1 text-sm">
            <Plus className="w-4 h-4" /> Aday Ekle
          </button>
        </div>

        <div className="space-y-4">
          {candidates.map((c, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-500">Aday {i + 1}</span>
                {candidates.length > 1 && (
                  <button onClick={() => removeCandidate(i)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Ürün Adı</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                    value={c.name}
                    onChange={(e) => updateCandidate(i, "name", e.target.value)}
                    placeholder="ör. Türk Pamuklu Havlu 70x140"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Kategori</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                    value={c.category}
                    onChange={(e) => updateCandidate(i, "category", e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Satış Fiyatı (AED)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                    value={c.estimated_price_aed}
                    onChange={(e) => updateCandidate(i, "estimated_price_aed", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Maliyet (TRY)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                    value={c.estimated_cost_try}
                    onChange={(e) => updateCandidate(i, "estimated_cost_try", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Amazon BSR (boş=bilinmiyor)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                    value={c.amazon_bsr ?? ""}
                    onChange={(e) => updateCandidate(i, "amazon_bsr", e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="ör. 3200"
                  />
                </div>

                <div className="col-span-3 flex gap-6 text-sm">
                  {[
                    { field: "noon_demand_confirmed", label: "noon talebi doğrulandı" },
                    { field: "turkey_supplier_available", label: "Türkiye tedarikçi mevcut" },
                    { field: "requires_ecas_tdra", label: "ECAS/TDRA sertifikası gerekiyor" },
                    { field: "requires_distributor_auth", label: "Distribütör yetkisi gerekiyor" },
                  ].map(({ field, label }) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={c[field as keyof Candidate] as boolean}
                        onChange={(e) => updateCandidate(i, field as keyof Candidate, e.target.checked)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => runScore(candidates)}
          disabled={isPending || candidates.every((c) => !c.name)}
          className="mt-4 btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          {isPending ? "Hesaplanıyor..." : "Fırsat Skoru Hesapla"}
        </button>
      </div>

      {/* Sonuçlar */}
      {results && (
        <div className="card">
          <h2 className="font-bold mb-4">Sonuçlar — Sıralanmış</h2>
          <div className="space-y-4">
            {results.map((r: any, i: number) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs text-gray-400 mr-2">#{i + 1}</span>
                    <span className="font-semibold">{r.name}</span>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      r.total_score >= 70
                        ? "bg-green-100 text-green-700"
                        : r.total_score >= 50
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.recommendation}
                  </span>
                </div>

                <ScoreBar score={r.total_score} />

                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-orange-50 rounded-lg p-2">
                    <p className="text-xs text-orange-600">Amazon Marjı</p>
                    <p className={`font-bold text-lg ${r.amazon_margin_pct < 10 ? "text-red-600" : "text-orange-700"}`}>
                      %{r.amazon_margin_pct}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600">noon Marjı</p>
                    <p className={`font-bold text-lg ${r.noon_margin_pct < 10 ? "text-red-600" : "text-gray-700"}`}>
                      %{r.noon_margin_pct}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xs text-blue-600">Toplam Skor</p>
                    <p className="font-bold text-lg text-blue-700">{Math.round(r.total_score)}/100</p>
                  </div>
                </div>

                {r.warnings?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {r.warnings.map((w: string, wi: number) => (
                      <div key={wi} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
