import type { Draft, DraftStatus, PostLogEntry, Target } from "./types.ts";

const TOKEN_KEY = "ce_auth_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (res.status === 401) throw new Error("Yetkisiz — panel token'ını kontrol edin.");
  if (!res.ok) throw new Error(`İstek başarısız (${res.status})`);
  return res.json() as Promise<T>;
}

export const api = {
  listDrafts: (status?: DraftStatus) =>
    req<Draft[]>(`/drafts${status ? `?status=${status}` : ""}`),
  patchDraft: (id: string, patch: Partial<Pick<Draft, "editedBody" | "hashtags" | "suggestedTarget" | "scheduledFor">>) =>
    req<Draft>(`/drafts/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  approve: (id: string) =>
    req<{ draft: Draft; text: string }>(`/drafts/${id}/approve`, { method: "POST" }),
  reject: (id: string) => req<Draft>(`/drafts/${id}/reject`, { method: "POST" }),
  publish: (id: string, target: Target) =>
    req<{ text: string; status: string }>(`/drafts/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ target }),
    }),
  generate: () => req<{ ingested: number; draftsCreated: number }>(`/generate`, { method: "POST" }),
  postLog: () => req<PostLogEntry[]>(`/postlog`),
};
