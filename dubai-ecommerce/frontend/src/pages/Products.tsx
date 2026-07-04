import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Package, CheckCircle2, Clock, XCircle } from "lucide-react";

async function fetchProducts() {
  const resp = await fetch("/api/products");
  return resp.json();
}

async function createProduct(data: object) {
  const resp = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error("Ürün oluşturulamadı");
  return resp.json();
}

const STATUS_ICONS = {
  active: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  pending: <Clock className="w-4 h-4 text-amber-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  inactive: <XCircle className="w-4 h-4 text-gray-400" />,
};

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-xs text-gray-400">—</span>;
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    pending_qc: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function Products() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    sku: "", title_en: "", title_ar: "", brand: "", category: "",
    price_aed: "", cost_try: "", color: "", size: "",
    image_main_url: "", origin_country: "TR",
  });

  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { mutate: create, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false);
      setForm({ sku: "", title_en: "", title_ar: "", brand: "", category: "", price_aed: "", cost_try: "", color: "", size: "", image_main_url: "", origin_country: "TR" });
    },
  });

  const downloadNIS = () => {
    window.open("/api/noon/nis-export", "_blank");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Kataloğu</h1>
          <p className="text-gray-500 mt-1">Amazon.ae + noon.com çapraz platform ürün yönetimi</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadNIS} className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            <Download className="w-4 h-4" /> noon NIS Excel İndir
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ürün Ekle
          </button>
        </div>
      </div>

      {/* Yeni ürün formu */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-bold mb-4">Yeni Ürün</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { field: "sku", label: "SKU *", placeholder: "MY-SKU-001" },
              { field: "title_en", label: "Başlık (EN) *", placeholder: "Cotton Towel 70x140cm" },
              { field: "title_ar", label: "Başlık (AR)", placeholder: "منشفة قطنية" },
              { field: "brand", label: "Marka", placeholder: "MyBrand" },
              { field: "category", label: "Kategori", placeholder: "Home Textiles" },
              { field: "price_aed", label: "Fiyat (AED)", placeholder: "49.99" },
              { field: "cost_try", label: "Maliyet (TRY)", placeholder: "200" },
              { field: "color", label: "Renk", placeholder: "White" },
              { field: "size", label: "Boyut", placeholder: "70x140" },
              { field: "image_main_url", label: "Ana Görsel URL", placeholder: "https://..." },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="text-xs text-gray-500">{label}</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  value={(form as any)[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() =>
                create({
                  ...form,
                  price_aed: form.price_aed ? parseFloat(form.price_aed) : null,
                  cost_try: form.cost_try ? parseFloat(form.cost_try) : null,
                })
              }
              disabled={isPending || !form.sku || !form.title_en}
              className="btn-primary disabled:opacity-50"
            >
              {isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-gray-200 px-4 py-2 rounded-lg text-sm">
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Ürün tablosu */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["SKU", "Ürün Adı", "Kategori", "Fiyat (AED)", "Amazon", "noon", ""].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">Yükleniyor...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Henüz ürün yok — "Ürün Ekle" ile başlayın</p>
                </td>
              </tr>
            ) : (
              products.map((p: any) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.title_en}</p>
                    {p.title_ar && <p className="text-xs text-gray-400 text-right font-arabic">{p.title_ar}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.category || "—"}</td>
                  <td className="px-4 py-3 font-medium">{p.price_aed ? `${p.price_aed} AED` : "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.amazon_status} />
                    {p.amazon_asin && <p className="text-xs text-gray-400 mt-0.5">{p.amazon_asin}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.noon_status} />
                    {p.noon_sku_parent && <p className="text-xs text-gray-400 mt-0.5">{p.noon_sku_parent}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-blue-600 hover:underline">Düzenle</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
