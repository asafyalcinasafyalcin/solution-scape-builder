import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  Upload,
  AlertTriangle,
  Loader2,
  Video,
  MessageSquare,
  Mail,
  RefreshCw,
  Play,
  XCircle,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CompanyProfile {
  company_name: string;
  free_zone_address: string;
  owner_name: string;
  email: string;
  phone: string;
  iban: string;
  password: string;
}

interface DocumentStatus {
  uploaded: boolean;
  filename: string | null;
}

interface RegistrationStatus {
  platform: string;
  state: string;
  current_step: number;
  total_steps: number;
  current_step_name: string;
  progress_pct: number;
  waiting_prompt: string | null;
  latest_screenshot: string | null;
  screenshot_url: string | null;
  steps_completed: any[];
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  human_action_required: boolean;
  human_action_description: string | null;
}

// ─── API helpers ────────────────────────────────────────────────────────────────

async function apiJson(path: string, opts?: RequestInit) {
  const r = await fetch(path, opts);
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: r.statusText }));
    throw new Error(err.detail || r.statusText);
  }
  return r.json();
}

async function fetchDocs(): Promise<Record<string, DocumentStatus>> {
  return apiJson("/api/setup/documents");
}

async function fetchStatus(platform: string): Promise<RegistrationStatus> {
  return apiJson(`/api/setup/registration-status/${platform}`);
}

async function fetchProfile(): Promise<CompanyProfile & { exists: boolean }> {
  return apiJson("/api/setup/company-profile");
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
        active
          ? "bg-white text-dubai-navy shadow-sm"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
      {badge && (
        <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-dubai-gold h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    idle: { label: "Bekliyor", cls: "bg-gray-100 text-gray-600" },
    running: { label: "Çalışıyor", cls: "bg-blue-100 text-blue-700" },
    waiting_for_otp: { label: "OTP Bekleniyor", cls: "bg-amber-100 text-amber-700" },
    waiting_for_email: { label: "Email Bekleniyor", cls: "bg-amber-100 text-amber-700" },
    waiting_for_captcha: { label: "CAPTCHA", cls: "bg-orange-100 text-orange-700" },
    waiting_for_human_action: { label: "Manuel Eylem", cls: "bg-purple-100 text-purple-700" },
    completed: { label: "Tamamlandı", cls: "bg-green-100 text-green-700" },
    error: { label: "Hata", cls: "bg-red-100 text-red-700" },
  };
  const c = cfg[state] || { label: state, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.cls}`}>
      {c.label}
    </span>
  );
}

// ─── Tab 1: Company Profile ──────────────────────────────────────────────────────

function CompanyProfileTab({ onSaved }: { onSaved: () => void }) {
  const qc = useQueryClient();
  const { data: existing } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });

  const [form, setForm] = useState<CompanyProfile>({
    company_name: "",
    free_zone_address: "",
    owner_name: "",
    email: "",
    phone: "+971",
    iban: "AE",
    password: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existing?.exists) {
      setForm((f) => ({
        ...f,
        company_name: existing.company_name || "",
        free_zone_address: existing.free_zone_address || "",
        owner_name: existing.owner_name || "",
        email: existing.email || "",
        phone: existing.phone || "+971",
        iban: existing.iban || "AE",
      }));
    }
  }, [existing]);

  const set = (k: keyof CompanyProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setError("");
    setSaved(false);
    try {
      await apiJson("/api/setup/company-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["profile"] });
      onSaved();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const fields: { key: keyof CompanyProfile; label: string; placeholder: string; type?: string }[] = [
    { key: "company_name", label: "Şirket Adı (tam resmi adı)", placeholder: "ABC Trading FZCO" },
    { key: "free_zone_address", label: "Serbest Bölge Adresi", placeholder: "IFZA Business Park, Dubai, UAE" },
    { key: "owner_name", label: "Şirket Sahibi / Yetkili Ad Soyad", placeholder: "Asaf Yalçın" },
    { key: "email", label: "BAE İş Email Adresi", placeholder: "info@yourcompany.ae", type: "email" },
    { key: "phone", label: "BAE Telefon Numarası", placeholder: "+971501234567" },
    { key: "iban", label: "BAE Banka IBAN", placeholder: "AE070331234567890123456" },
    {
      key: "password",
      label: "Hesap Şifresi (platformlar için)",
      placeholder: "Güçlü bir şifre girin",
      type: "password",
    },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Bu bilgiler yalnızca bu sistemde saklanır ve kayıt formlarını otomatik doldurmak için
          kullanılır. Şifre asla dışarıya iletilmez.
        </p>
      </div>

      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          <input
            type={f.type || "text"}
            value={form[f.key]}
            onChange={set(f.key)}
            placeholder={f.placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dubai-gold"
          />
        </div>
      ))}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profil kaydedildi!
        </div>
      )}

      <button
        onClick={save}
        className="w-full py-2.5 bg-dubai-navy text-white rounded-lg font-medium hover:bg-dubai-navy/90 transition"
      >
        Profili Kaydet
      </button>
    </div>
  );
}

// ─── Tab 2: Document Upload ──────────────────────────────────────────────────────

function DocumentUploadTab() {
  const qc = useQueryClient();
  const { data: docs, refetch } = useQuery({ queryKey: ["documents"], queryFn: fetchDocs });

  const docDefs = [
    {
      key: "trade_license" as const,
      label: "Ticaret Lisansı",
      note: "Serbest Bölge ticaret sicili belgesi (PDF veya resim)",
      required: true,
    },
    {
      key: "passport" as const,
      label: "Pasaport",
      note: "Şirket sahibinin pasaport bilgi sayfası (PDF veya resim)",
      required: true,
    },
    {
      key: "bank_statement" as const,
      label: "Banka Ekstresi",
      note: "Son 3 aylık BAE banka hesabı ekstresi (opsiyonel)",
      required: false,
    },
  ];

  const upload = async (docType: string, file: File) => {
    const fd = new FormData();
    fd.append("document_type", docType);
    fd.append("file", file);
    try {
      await fetch("/api/setup/upload-document", { method: "POST", body: fd });
      qc.invalidateQueries({ queryKey: ["documents"] });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-gray-600">
        Belgeleri yükleyin. Otomasyon bu dosyaları kayıt formlarına otomatik ekleyecek.
      </p>

      {docDefs.map((def) => {
        const info = docs?.[def.key];
        const uploaded = info?.uploaded ?? false;

        return (
          <div
            key={def.key}
            className={`border-2 rounded-xl p-4 transition ${
              uploaded ? "border-green-300 bg-green-50" : "border-dashed border-gray-300 bg-gray-50"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) upload(def.key, file);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {uploaded ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {def.label}
                    {def.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{def.note}</p>
                  {uploaded && info?.filename && (
                    <p className="text-xs text-green-600 mt-1 font-mono">{info.filename}</p>
                  )}
                </div>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(def.key, file);
                  }}
                />
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    uploaded
                      ? "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                      : "bg-dubai-navy text-white hover:bg-dubai-navy/90"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  {uploaded ? "Değiştir" : "Yükle"}
                </span>
              </label>
            </div>

            {!uploaded && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                Dosyayı buraya sürükleyip bırakın veya yukarıdaki butonu kullanın
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab 3: Launch Registration ─────────────────────────────────────────────────

function LaunchTab({
  profileSaved,
  onLaunch,
}: {
  profileSaved: boolean;
  onLaunch: (platform: "noon" | "amazon") => void;
}) {
  const { data: docs } = useQuery({ queryKey: ["documents"], queryFn: fetchDocs });
  const { data: noonStatus } = useQuery({
    queryKey: ["registration-status", "noon"],
    queryFn: () => fetchStatus("noon"),
    refetchInterval: 3000,
  });
  const { data: amazonStatus } = useQuery({
    queryKey: ["registration-status", "amazon"],
    queryFn: () => fetchStatus("amazon"),
    refetchInterval: 3000,
  });

  const requiredDocsUploaded =
    docs?.trade_license?.uploaded && docs?.passport?.uploaded;

  const canLaunch = profileSaved && requiredDocsUploaded;

  const getStatusLabel = (status?: RegistrationStatus) => {
    if (!status || status.state === "idle") return null;
    if (status.state === "completed") return "Tamamlandı ✓";
    if (status.state === "error") return "Hata — Yeniden dene";
    if (status.state === "running") return `Devam ediyor (${status.progress_pct}%)`;
    if (status.state?.startsWith("waiting")) return "Kullanıcı girişi bekleniyor";
    return status.state;
  };

  const platforms = [
    {
      id: "noon" as const,
      name: "noon.com Seller Lab",
      color: "bg-noon-dark",
      textColor: "text-noon-yellow",
      letter: "N",
      steps: 12,
      approval: "~2-5 iş günü",
      note: "Başlamak için önerilen platform — onay süreci daha hızlı.",
      status: noonStatus,
      btnClass: "btn-noon",
    },
    {
      id: "amazon" as const,
      name: "Amazon.ae Seller Central",
      color: "bg-amazon-orange",
      textColor: "text-white",
      letter: "A",
      steps: 14,
      approval: "~5-10 iş günü",
      note: "Video kimlik doğrulama içeriyor — otomasyon bu adımda durur.",
      status: amazonStatus,
      btnClass: "btn-amazon",
    },
  ];

  return (
    <div className="space-y-4">
      {!canLaunch && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Kayıt başlatmak için:</p>
            <ul className="space-y-1">
              {!profileSaved && <li className="flex gap-2"><Circle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Sekme 1'de şirket profilini doldurun ve kaydedin</li>}
              {!docs?.trade_license?.uploaded && <li className="flex gap-2"><Circle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Ticaret lisansını yükleyin (Sekme 2)</li>}
              {!docs?.passport?.uploaded && <li className="flex gap-2"><Circle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Pasaportu yükleyin (Sekme 2)</li>}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {platforms.map((p) => {
          const statusLabel = getStatusLabel(p.status);
          const isRunning = p.status?.state === "running" || p.status?.state?.startsWith("waiting");
          const isCompleted = p.status?.state === "completed";

          return (
            <div key={p.id} className="card border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${p.color} rounded-lg flex items-center justify-center`}>
                  <span className={`${p.textColor} font-bold`}>{p.letter}</span>
                </div>
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-gray-500">Onay: {p.approval} · {p.steps} adım</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{p.note}</p>

              {statusLabel && (
                <div className="mb-3">
                  <ProgressBar pct={p.status?.progress_pct ?? 0} />
                  <p className="text-xs text-gray-500 mt-1">{statusLabel}</p>
                </div>
              )}

              <button
                onClick={() => onLaunch(p.id)}
                disabled={!canLaunch || isRunning || isCompleted}
                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${p.btnClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRunning ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Devam ediyor…</>
                ) : isCompleted ? (
                  <><CheckCircle2 className="w-4 h-4" /> Tamamlandı</>
                ) : (
                  <><Play className="w-4 h-4" /> {p.name.split(" ")[0]} Kaydını Başlat</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 4: Live Status ──────────────────────────────────────────────────────────

function OTPInput({ platform, prompt }: { platform: string; prompt: string }) {
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const qc = useQueryClient();

  const submit = async () => {
    setError("");
    try {
      await apiJson(`/api/setup/submit-otp/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: code, otp_type: "sms_otp" }),
      });
      setSent(true);
      setCode("");
      qc.invalidateQueries({ queryKey: ["registration-status", platform] });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-2">
        <MessageSquare className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-amber-800">{prompt}</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setSent(false); }}
          placeholder="6 haneli kod"
          maxLength={8}
          className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={submit}
          disabled={code.length < 4}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50"
        >
          Gönder
        </button>
      </div>
      {sent && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Kod iletildi — otomasyon devam ediyor…</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function EmailConfirmButton({ platform, prompt }: { platform: string; prompt: string }) {
  const [sent, setSent] = useState(false);
  const qc = useQueryClient();

  const confirm = async () => {
    await apiJson(`/api/setup/submit-otp/${platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: "confirmed", otp_type: "email_confirmed" }),
    });
    setSent(true);
    qc.invalidateQueries({ queryKey: ["registration-status", platform] });
  };

  return (
    <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-2">
        <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-blue-800">{prompt}</p>
      </div>
      <button
        onClick={confirm}
        disabled={sent}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        {sent ? <><CheckCircle2 className="w-4 h-4" /> Gönderildi</> : <><Mail className="w-4 h-4" /> Email Doğrulandı — Devam Et</>}
      </button>
    </div>
  );
}

function HumanActionPanel({ platform, description }: { platform: string; description: string }) {
  const [sent, setSent] = useState(false);
  const qc = useQueryClient();

  const confirm = async () => {
    await apiJson(`/api/setup/submit-otp/${platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: "completed", otp_type: "human_action_completed" }),
    });
    setSent(true);
    qc.invalidateQueries({ queryKey: ["registration-status", platform] });
  };

  return (
    <div className="bg-purple-50 border border-purple-300 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-2">
        <Video className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-800 mb-2">Manuel Eylem Gerekli</p>
          <p className="text-sm text-purple-700 whitespace-pre-line">{description}</p>
        </div>
      </div>
      <button
        onClick={confirm}
        disabled={sent}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
      >
        {sent ? <><CheckCircle2 className="w-4 h-4" /> Onaylandı</> : "Tamamladım — Devam Et"}
      </button>
    </div>
  );
}

function RegistrationStatusPanel({
  platform,
  label,
  onRetry,
}: {
  platform: "noon" | "amazon";
  label: string;
  onRetry: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const { data: status } = useQuery({
    queryKey: ["registration-status", platform],
    queryFn: () => fetchStatus(platform),
    refetchInterval: 3000,
  });

  if (!status || status.state === "idle") {
    return (
      <div className="text-center py-12 text-gray-400">
        <Circle className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p className="text-sm">{label} kaydı henüz başlatılmadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StateBadge state={status.state} />
          <span className="text-sm text-gray-600">
            Adım {status.current_step} / {status.total_steps}
          </span>
          {status.state === "running" && (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>
        {status.state === "error" && (
          <button
            onClick={onRetry}
            className="text-xs flex items-center gap-1 text-red-600 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Yeniden Dene
          </button>
        )}
      </div>

      {/* Progress */}
      <div>
        <ProgressBar pct={status.progress_pct} />
        <p className="text-sm font-medium text-gray-700 mt-1.5">{status.current_step_name}</p>
      </div>

      {/* Human interaction panels */}
      {status.state === "waiting_for_otp" && status.waiting_prompt && (
        <OTPInput platform={platform} prompt={status.waiting_prompt} />
      )}
      {status.state === "waiting_for_email" && status.waiting_prompt && (
        <EmailConfirmButton platform={platform} prompt={status.waiting_prompt} />
      )}
      {status.state === "waiting_for_human_action" && status.human_action_description && (
        <HumanActionPanel platform={platform} description={status.human_action_description} />
      )}

      {/* Error */}
      {status.state === "error" && status.error_message && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{status.error_message}</p>
        </div>
      )}

      {/* Completed */}
      {status.state === "completed" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Başvuru gönderildi!</p>
            <p className="text-xs text-green-700 mt-0.5">
              {platform === "noon"
                ? "noon ekibi 2-5 iş günü içinde onaylayacak. Email'inizi kontrol edin."
                : "Amazon ekibi 5-10 iş günü içinde onaylayacak. Video görüşme randevusu için email'inizi kontrol edin."}
            </p>
          </div>
        </div>
      )}

      {/* Screenshot */}
      {status.screenshot_url && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <p className="text-xs text-gray-500 px-3 py-2 bg-gray-50 border-b border-gray-200">
            Son ekran görüntüsü
          </p>
          <img
            ref={imgRef}
            src={`${status.screenshot_url}?t=${Date.now()}`}
            alt="Registration screenshot"
            className="w-full"
            onError={() => {}}
          />
        </div>
      )}

      {/* Step history */}
      {status.steps_completed.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Tamamlanan Adımlar
          </p>
          <div className="space-y-1">
            {status.steps_completed.map((step: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                <span>
                  {step.step_number}. {step.step_name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Setup page ─────────────────────────────────────────────────────────────

export default function Setup() {
  const [tab, setTab] = useState<"profile" | "documents" | "launch" | "status">("profile");
  const [statusPlatform, setStatusPlatform] = useState<"noon" | "amazon">("noon");
  const [profileSaved, setProfileSaved] = useState(false);
  const qc = useQueryClient();

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const { data: noonStatus } = useQuery({
    queryKey: ["registration-status", "noon"],
    queryFn: () => fetchStatus("noon"),
    refetchInterval: 3000,
  });
  const { data: amazonStatus } = useQuery({
    queryKey: ["registration-status", "amazon"],
    queryFn: () => fetchStatus("amazon"),
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (profile?.exists) setProfileSaved(true);
  }, [profile]);

  // Auto-switch to status tab when a registration becomes active
  useEffect(() => {
    const needsAttention = (s?: RegistrationStatus) =>
      s && s.state !== "idle" && s.state !== "completed";
    if (needsAttention(noonStatus)) {
      setStatusPlatform("noon");
      setTab("status");
    } else if (needsAttention(amazonStatus)) {
      setStatusPlatform("amazon");
      setTab("status");
    }
  }, [noonStatus?.state, amazonStatus?.state]);

  const startRegistration = async (platform: "noon" | "amazon") => {
    try {
      await apiJson(`/api/setup/start-registration/${platform}`, { method: "POST" });
      setStatusPlatform(platform);
      setTab("status");
      qc.invalidateQueries({ queryKey: ["registration-status", platform] });
    } catch (e: any) {
      alert(e.message);
    }
  };

  const retryRegistration = async (platform: "noon" | "amazon") => {
    await startRegistration(platform);
  };

  const activePlatformStatus = statusPlatform === "noon" ? noonStatus : amazonStatus;
  const hasActiveSession =
    activePlatformStatus?.state && activePlatformStatus.state !== "idle";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hesap Kayıt Otomasyonu</h1>
        <p className="text-gray-500 mt-1">
          Belgelerinizi yükleyin — sistem noon.com ve Amazon.ae kayıt formlarını otomatik dolduracak.
        </p>
      </div>

      {/* Tab bar */}
      <div className="bg-gray-100 rounded-xl p-1 flex gap-1 mb-6">
        <TabButton active={tab === "profile"} onClick={() => setTab("profile")} badge={profileSaved ? "✓" : undefined}>
          1. Şirket Profili
        </TabButton>
        <TabButton active={tab === "documents"} onClick={() => setTab("documents")}>
          2. Belgeler
        </TabButton>
        <TabButton active={tab === "launch"} onClick={() => setTab("launch")}>
          3. Kayıt Başlat
        </TabButton>
        <TabButton
          active={tab === "status"}
          onClick={() => setTab("status")}
          badge={hasActiveSession ? "●" : undefined}
        >
          4. Durum Takibi
        </TabButton>
      </div>

      {/* Tab content */}
      {tab === "profile" && (
        <CompanyProfileTab onSaved={() => setProfileSaved(true)} />
      )}

      {tab === "documents" && <DocumentUploadTab />}

      {tab === "launch" && (
        <LaunchTab profileSaved={profileSaved} onLaunch={startRegistration} />
      )}

      {tab === "status" && (
        <div className="space-y-4">
          {/* Platform switcher */}
          <div className="flex gap-2">
            {(["noon", "amazon"] as const).map((p) => {
              const s = p === "noon" ? noonStatus : amazonStatus;
              return (
                <button
                  key={p}
                  onClick={() => setStatusPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    statusPlatform === p
                      ? "bg-dubai-navy text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p === "noon" ? "noon.com" : "Amazon.ae"}
                  {s?.state && s.state !== "idle" && (
                    <StateBadge state={s.state} />
                  )}
                </button>
              );
            })}
          </div>

          <RegistrationStatusPanel
            platform={statusPlatform}
            label={statusPlatform === "noon" ? "noon.com" : "Amazon.ae"}
            onRetry={() => retryRegistration(statusPlatform)}
          />
        </div>
      )}
    </div>
  );
}
