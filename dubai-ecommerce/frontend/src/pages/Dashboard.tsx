import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

async function fetchStats() {
  const resp = await fetch("/api/dashboard/stats");
  if (!resp.ok) return null;
  return resp.json();
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function SetupStep({
  step,
  title,
  status,
  note,
}: {
  step: number;
  title: string;
  status: "done" | "pending" | "next";
  note: string;
}) {
  const icons = {
    done: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    pending: <Clock className="w-5 h-5 text-amber-500" />,
    next: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className={`flex gap-4 p-4 rounded-lg border ${status === "next" ? "border-blue-200 bg-blue-50" : "border-gray-100"}`}>
      <div className="flex-shrink-0 flex items-start gap-2">
        <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-bold">
          {step}
        </span>
        {icons[status]}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{note}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dubai E-Ticaret Kontrol Paneli</h1>
        <p className="text-gray-500 mt-1">Amazon.ae & noon.com — Türkiye İhracatı Operasyon Merkezi</p>
      </div>

      {/* Platform durumu */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card border-l-4 border-amazon-orange">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amazon-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <p className="font-semibold">Amazon.ae</p>
              <p className="text-xs text-gray-500">Marketplace: A2VIGQ35RCS4UG · EU Endpoint</p>
            </div>
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              Kurulum Gerekli
            </span>
          </div>
        </div>

        <div className="card border-l-4 border-noon-yellow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-noon-dark rounded-lg flex items-center justify-center">
              <span className="text-noon-yellow font-bold text-sm">N</span>
            </div>
            <div>
              <p className="font-semibold">noon.com</p>
              <p className="text-xs text-gray-500">UAE · FBN + FBPI · Haftalık Ödeme</p>
            </div>
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              Kurulum Gerekli
            </span>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Toplam Ürün"
          value={isLoading ? "—" : stats?.total_products ?? 0}
          icon={Package}
          color="bg-dubai-navy"
          sub="Katalogdaki ürünler"
        />
        <StatCard
          label="Amazon Aktif"
          value={isLoading ? "—" : stats?.amazon_active_listings ?? 0}
          icon={TrendingUp}
          color="bg-amazon-orange"
          sub="Amazon.ae'de aktif"
        />
        <StatCard
          label="noon Aktif"
          value={isLoading ? "—" : stats?.noon_active_listings ?? 0}
          icon={TrendingUp}
          color="bg-gray-700"
          sub="noon UAE'de aktif"
        />
        <StatCard
          label="Toplam Sipariş"
          value={isLoading ? "—" : stats?.total_orders ?? 0}
          icon={ShoppingCart}
          color="bg-green-600"
          sub="Tüm platformlar"
        />
      </div>

      {/* Kurulum yol haritası */}
      <div className="card mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Kurulum Yol Haritası</h2>
        <div className="space-y-3">
          <SetupStep
            step={1}
            title="Şirket Belgelerini Hazırla"
            status="next"
            note="Ticaret lisansı, pasaport, BAE banka hesabı, iş e-posta, BAE telefon"
          />
          <SetupStep
            step={2}
            title="noon Seller Lab Kaydı (Önce noon — daha hızlı)"
            status="pending"
            note="sell.noon.com → Müşteri hesabı → Seller Lab → Belgeler → ~2-5 iş günü onay"
          />
          <SetupStep
            step={3}
            title="Amazon.ae Seller Central Kaydı"
            status="pending"
            note="sell.amazon.ae → Profesyonel plan (39 USD/ay) → Video doğrulama → ~5-10 iş günü"
          />
          <SetupStep
            step={4}
            title="API Kimlik Bilgilerini Al"
            status="pending"
            note="Amazon: SP-API OAuth credentials · noon: Seller Lab API Users → .json key"
          />
          <SetupStep
            step={5}
            title="İlk Ürünleri Araştır ve Listele"
            status="pending"
            note="Helium 10 (Amazon.ae BSR) + NoonSeller → 5 pilot ürün → Claude ile EN/AR içerik"
          />
        </div>
      </div>

      {/* Kritik notlar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-amber-50 border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> noon Tekstil Uyarısı
          </h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Giyim komisyonu: <strong>~%27</strong> (en yüksek)</li>
            <li>• Ev tekstili komisyonu: <strong>~%15</strong></li>
            <li>• Fiyat + maliyet hesabı yapın</li>
            <li>• Hedef: <strong>%20+ net marj</strong></li>
          </ul>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Avantajlar (Serbest Bölge)
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Amazon FBA + noon FBN tam erişim</li>
            <li>• %100 yabancı sahiplik</li>
            <li>• KDV erteleme (anakaraya çıkana kadar)</li>
            <li>• Türkiye → BAE ihracat avantajı</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
