import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, RefreshCw } from "lucide-react";

async function fetchAmazonOrders() {
  const resp = await fetch("/api/amazon/orders?status=Unshipped&days=30");
  if (!resp.ok) return { payload: { Orders: [] } };
  return resp.json();
}

async function fetchNoonOrders() {
  const resp = await fetch("/api/noon/orders?status=pending");
  if (!resp.ok) return { orders: [] };
  return resp.json();
}

export default function Orders() {
  const [platform, setPlatform] = useState<"amazon" | "noon">("amazon");

  const { data: amazonData, isLoading: amazonLoading, refetch: refetchAmazon } = useQuery({
    queryKey: ["amazon-orders"],
    queryFn: fetchAmazonOrders,
    enabled: platform === "amazon",
  });

  const { data: noonData, isLoading: noonLoading, refetch: refetchNoon } = useQuery({
    queryKey: ["noon-orders"],
    queryFn: fetchNoonOrders,
    enabled: platform === "noon",
  });

  const isLoading = platform === "amazon" ? amazonLoading : noonLoading;
  const amazonOrders = amazonData?.payload?.Orders ?? [];
  const noonOrders = noonData?.orders ?? [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
          <p className="text-gray-500 mt-1">Amazon.ae FBA + noon FBN/FBPI siparişleri</p>
        </div>
        <button
          onClick={() => platform === "amazon" ? refetchAmazon() : refetchNoon()}
          className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" /> Yenile
        </button>
      </div>

      {/* Platform seçici */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPlatform("amazon")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            platform === "amazon" ? "bg-amazon-orange text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Amazon.ae
        </button>
        <button
          onClick={() => setPlatform("noon")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            platform === "noon" ? "bg-noon-dark text-noon-yellow" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          noon.com
        </button>
      </div>

      {/* Amazon siparişleri */}
      {platform === "amazon" && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Sipariş ID", "Durum", "Tutar", "Tarih", "Şehir", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Yükleniyor... (Amazon API bağlantısı gerekli)</td></tr>
              ) : amazonOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>Amazon SP-API bağlantısı kurulduktan sonra siparişler burada görünecek</p>
                    <p className="text-xs mt-1">AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET, AMAZON_REFRESH_TOKEN gerekli</p>
                  </td>
                </tr>
              ) : (
                amazonOrders.map((order: any) => (
                  <tr key={order.AmazonOrderId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{order.AmazonOrderId}</td>
                    <td className="px-4 py-3">
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{order.OrderStatus}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">{order.OrderTotal?.Amount} {order.OrderTotal?.CurrencyCode}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(order.PurchaseDate).toLocaleDateString("tr-TR")}</td>
                    <td className="px-4 py-3 text-gray-500">{order.ShippingAddress?.City ?? "—"}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline">Detay</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* noon siparişleri */}
      {platform === "noon" && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Sipariş ID", "SKU", "Durum", "Miktar", "Tutar", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Yükleniyor... (noon API bağlantısı gerekli)</td></tr>
              ) : noonOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>noon store_credentials.json eklendikten sonra siparişler görünecek</p>
                    <p className="text-xs mt-1">Seller Lab → User & Access → API Users → .json key indir</p>
                  </td>
                </tr>
              ) : (
                noonOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3 font-mono text-xs">{order.sku}</td>
                    <td className="px-4 py-3">
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{order.status}</span>
                    </td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3 font-medium">{order.price_aed} AED</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline">Onayla</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Ödeme bilgisi */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="card bg-orange-50 border-orange-200">
          <p className="text-sm font-semibold text-orange-800">Amazon.ae Ödeme Takvimi</p>
          <p className="text-xs text-orange-700 mt-1">14 günde bir ödeme · AED olarak BAE banka hesabına</p>
        </div>
        <div className="card bg-gray-50">
          <p className="text-sm font-semibold text-gray-800">noon Ödeme Takvimi</p>
          <p className="text-xs text-gray-600 mt-1">Her Perşembe haftalık ödeme · AED olarak BAE banka hesabına</p>
        </div>
      </div>
    </div>
  );
}
