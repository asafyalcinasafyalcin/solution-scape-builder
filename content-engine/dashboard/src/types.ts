export type Lang = "tr" | "en";
export type Target = "company" | "personal" | "both";
export type DraftStatus =
  | "pending_review"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected";

export interface Draft {
  id: string;
  newsItemId: string | null;
  type: string;
  lang: Lang;
  hook: string;
  body: string;
  hashtags: string[];
  suggestedTarget: Target;
  status: DraftStatus;
  editedBody: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostLogEntry {
  id: string;
  draftId: string;
  target: Target;
  platform: string;
  externalPostId: string | null;
  postedAt: string;
  status: string;
  error: string | null;
}
