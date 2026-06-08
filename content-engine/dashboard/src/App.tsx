import { useEffect, useState } from "react";
import { api, getToken, setToken } from "./api.ts";
import type { Draft, DraftStatus, Target } from "./types.ts";

const TABS: { key: DraftStatus; label: string }[] = [
  { key: "pending_review", label: "Onay Bekleyenler" },
  { key: "approved", label: "Onaylananlar" },
  { key: "published", label: "Paylaşıldı" },
  { key: "rejected", label: "Reddedilenler" },
];

const TARGET_LABEL: Record<Target, string> = {
  company: "Şirket sayfası",
  personal: "Kişisel profil",
  both: "İkisi de",
};

export default function App() {
  const [tab, setTab] = useState<DraftStatus>("pending_review");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setTokenState] = useState(getToken());
  const [generating, setGenerating] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setDrafts(await api.listDrafts(tab));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const r = await api.generate();
      alert(`Tamamlandı: ${r.ingested} yeni haber, ${r.draftsCreated} taslak üretildi.`);
      if (tab === "pending_review") await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold">ProcessTürk İçerik Paneli</h1>
            <p className="text-xs text-slate-500">LinkedIn taslak üretim ve onay sistemi · Faz 1</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Panel token"
              defaultValue={token}
              onBlur={(e) => {
                setToken(e.target.value);
                setTokenState(e.target.value);
              }}
              className="w-40 rounded border border-slate-300 px-2 py-1 text-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {generating ? "Üretiliyor…" : "Şimdi Üret"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                tab === t.key ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button onClick={refresh} className="ml-auto text-sm text-slate-500 hover:text-slate-900">
            ↻ Yenile
          </button>
        </div>

        {error && <div className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
        {loading && <p className="text-sm text-slate-500">Yükleniyor…</p>}
        {!loading && drafts.length === 0 && (
          <p className="text-sm text-slate-500">Bu sekmede taslak yok.</p>
        )}

        <div className="space-y-4">
          {drafts.map((d) => (
            <DraftCard key={d.id} draft={d} onChange={refresh} />
          ))}
        </div>
      </main>
    </div>
  );
}

function DraftCard({ draft, onChange }: { draft: Draft; onChange: () => void }) {
  const [body, setBody] = useState(draft.editedBody ?? draft.body);
  const [hashtags, setHashtags] = useState(draft.hashtags.join(" "));
  const [target, setTarget] = useState<Target>(draft.suggestedTarget);
  const [busy, setBusy] = useState(false);
  const [copyText, setCopyText] = useState<string | null>(null);
  const dirty = body !== (draft.editedBody ?? draft.body) || hashtags !== draft.hashtags.join(" ") || target !== draft.suggestedTarget;

  async function save() {
    setBusy(true);
    await api.patchDraft(draft.id, {
      editedBody: body,
      hashtags: hashtags.split(/\s+/).filter(Boolean),
      suggestedTarget: target,
    });
    setBusy(false);
    onChange();
  }

  async function approve() {
    setBusy(true);
    if (dirty) {
      await api.patchDraft(draft.id, {
        editedBody: body,
        hashtags: hashtags.split(/\s+/).filter(Boolean),
        suggestedTarget: target,
      });
    }
    const r = await api.approve(draft.id);
    setCopyText(r.text);
    setBusy(false);
    onChange();
  }

  async function reject() {
    setBusy(true);
    await api.reject(draft.id);
    setBusy(false);
    onChange();
  }

  async function markPublished() {
    setBusy(true);
    const r = await api.publish(draft.id, target);
    setCopyText(r.text);
    setBusy(false);
    onChange();
  }

  const previewText = `${body}\n\n${hashtags}`.trim();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className={`rounded px-2 py-0.5 font-medium ${draft.lang === "tr" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
          {draft.lang.toUpperCase()}
        </span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">{draft.type}</span>
        <span className="ml-auto text-slate-400">{new Date(draft.createdAt).toLocaleString("tr-TR")}</span>
      </div>

      <p className="mb-2 font-medium text-slate-800">{draft.hook}</p>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        className="w-full rounded border border-slate-200 p-2 text-sm"
      />
      <input
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        className="mt-2 w-full rounded border border-slate-200 p-2 text-sm text-blue-600"
        placeholder="#hashtag #hashtag"
      />

      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <span>{previewText.length} karakter</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value as Target)}
          className="rounded border border-slate-300 px-2 py-1.5 text-sm"
        >
          {(["company", "personal", "both"] as Target[]).map((t) => (
            <option key={t} value={t}>
              {TARGET_LABEL[t]}
            </option>
          ))}
        </select>

        {dirty && (
          <button onClick={save} disabled={busy} className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
            Kaydet
          </button>
        )}

        {draft.status === "pending_review" && (
          <>
            <button onClick={approve} disabled={busy} className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
              Onayla
            </button>
            <button onClick={reject} disabled={busy} className="rounded px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
              Reddet
            </button>
          </>
        )}

        {(draft.status === "approved" || draft.status === "scheduled") && (
          <button onClick={markPublished} disabled={busy} className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
            Paylaşıldı olarak işaretle
          </button>
        )}

        <CopyButton text={previewText} />
      </div>

      {copyText && (
        <div className="mt-3 rounded bg-slate-50 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">LinkedIn'e yapıştırmaya hazır</span>
            <CopyButton text={copyText} label="Kopyala" />
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-800">{copyText}</pre>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text, label = "Metni kopyala" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
    >
      {copied ? "✓ Kopyalandı" : label}
    </button>
  );
}
