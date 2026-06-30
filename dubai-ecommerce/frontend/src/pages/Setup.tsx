import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, ExternalLink, AlertTriangle } from "lucide-react";

async function fetchAmazonChecklist() {
  const resp = await fetch("/api/setup/amazon-checklist");
  return resp.json();
}

async function fetchNoonChecklist() {
  const resp = await fetch("/api/setup/noon-checklist");
  return resp.json();
}

function ChecklistItem({
  item,
  note,
  status,
}: {
  item: string;
  note: string;
  status: "pending" | "optional" | "later" | "done";
}) {
  const statusConfig = {
    pending: { icon: Circle, color: "text-gray-400", bg: "bg-white", label: "Gerekli" },
    optional: { icon: Circle, color: "text-blue-400", bg: "bg-blue-50", label: "Opsiyonel" },
    later: { icon: Circle, color: "text-amber-400", bg: "bg-amber-50", label: "İleride" },
    done: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", label: "Tamamlandı" },
  };
  const cfg = statusConfig[status];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg}`}>
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
      <div className="flex-1">
        <p className="font-medium text-sm text-gray-900">{item}</p>
        <p className="text-xs text-gray-500 mt-0.5">{note}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border flex-shrink-0`}>
        {cfg.label}
      </span>
    </div>
  );
}

export default function Setup() {
  const { data: amazon } = useQuery({ queryKey: ["amazon-checklist"], queryFn: fetchAmazonChecklist });
  const { data: noon } = useQuery({ queryKey: ["noon-checklist"], queryFn: fetchNoonChecklist });

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hesap Kurulum Rehberi</h1>
        <p className="text-gray-500 mt-1">
          Serbest Bölge şirketi ile Amazon.ae ve noon.com satıcı hesaplarının kurulumu
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800">Önerilen Sıra: Önce noon, sonra Amazon</p>
          <p className="text-sm text-blue-700 mt-1">
            noon onay süreci daha kısa (~2-5 iş günü). Türkiye'den sınır ötesi satış için BAE şirketi
            gerekmez ama Serbest Bölge şirketi olarak FBN'e tam erişim sağlarsınız.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* noon */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-noon-dark rounded-lg flex items-center justify-center">
              <span className="text-noon-yellow font-bold">N</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">noon.com Seller Lab</h2>
              <p className="text-xs text-gray-500">Onay: ~2-5 iş günü</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Gerekli Belgeler</h3>
            {noon?.required_documents?.map((doc: any, i: number) => (
              <ChecklistItem key={i} item={doc.item} note={doc.note} status={doc.status} />
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Kayıt Adımları</h3>
            <ol className="space-y-1">
              {noon?.steps?.map((step: string, i: number) => (
                <li key={i} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-800 mb-1">Komisyon Oranları</p>
            {noon?.commission_rates && Object.entries(noon.commission_rates).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs text-amber-700">
                <span>{key.replace(/_/g, " ")}</span>
                <span className="font-medium">{String(val)}</span>
              </div>
            ))}
          </div>

          <a
            href="https://sell.noon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full btn-noon"
          >
            noon Seller Lab'a Git <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Amazon */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amazon-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Amazon.ae Seller Central</h2>
              <p className="text-xs text-gray-500">Onay: ~5-10 iş günü · Video doğrulama</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Gerekli Belgeler</h3>
            {amazon?.required_documents?.map((doc: any, i: number) => (
              <ChecklistItem key={i} item={doc.item} note={doc.note} status={doc.status} />
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Kayıt Adımları</h3>
            <ol className="space-y-1">
              {amazon?.steps?.map((step: string, i: number) => (
                <li key={i} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-orange-800 mb-1">Ücretler</p>
            {amazon?.fees && Object.entries(amazon.fees).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs text-orange-700">
                <span>{key.replace(/_/g, " ")}</span>
                <span className="font-medium">{String(val)}</span>
              </div>
            ))}
          </div>

          <a
            href="https://sell.amazon.ae"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full btn-amazon"
          >
            Amazon Seller Central'a Git <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* API Bilgileri */}
      <div className="mt-8 card bg-gray-900 text-green-400">
        <h3 className="font-bold text-white mb-3">API Entegrasyon Bilgileri (Onay Sonrası)</h3>
        <div className="font-mono text-sm space-y-1">
          <p><span className="text-gray-500"># Amazon SP-API</span></p>
          <p>AMAZON_MARKETPLACE_ID=<span className="text-yellow-400">A2VIGQ35RCS4UG</span></p>
          <p>AMAZON_ENDPOINT=<span className="text-yellow-400">https://sellingpartnerapi-eu.amazon.com</span></p>
          <p className="mt-2"><span className="text-gray-500"># .env dosyasına eklenecekler:</span></p>
          <p>AMAZON_CLIENT_ID=<span className="text-gray-500">{"<Seller Central'dan>"}</span></p>
          <p>AMAZON_CLIENT_SECRET=<span className="text-gray-500">{"<Seller Central'dan>"}</span></p>
          <p>AMAZON_REFRESH_TOKEN=<span className="text-gray-500">{"<OAuth flow'dan>"}</span></p>
          <p className="mt-2"><span className="text-gray-500"># noon — .json key dosyasını buraya koy:</span></p>
          <p>NOON_CREDENTIALS_PATH=<span className="text-yellow-400">./noon/store_credentials.json</span></p>
        </div>
      </div>
    </div>
  );
}
