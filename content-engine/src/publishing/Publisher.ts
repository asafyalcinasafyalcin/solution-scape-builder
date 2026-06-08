import type { Draft, Target } from "../db/schema.ts";

export interface PublishRequest {
  draft: Draft;
  target: Target;
}

export interface PublishResult {
  platform: string;
  status: "success" | "manual" | "error";
  externalPostId: string | null;
  /** Faz 1: kullanıcının elle yapıştıracağı hazır metin. */
  text?: string;
  error?: string;
}

/** Tüm yayın adaptörlerinin (kopyala-yapıştır, LinkedIn, X) ortak arayüzü. */
export interface Publisher {
  readonly platform: string;
  publish(req: PublishRequest): Promise<PublishResult>;
}

/** Bir taslağı LinkedIn'e uygun nihai metne dönüştürür (düzenleme varsa onu kullanır). */
export function renderPostText(draft: Draft): string {
  const body = draft.editedBody ?? draft.body;
  const hashtags = draft.hashtags.join(" ");
  return [body.trim(), "", hashtags].join("\n").trim();
}
