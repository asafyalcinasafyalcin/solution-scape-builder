import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import {
  getDraft,
  insertPostLog,
  listDrafts,
  listPostLog,
  updateDraft,
} from "./db/client.ts";
import { DraftStatus, Target } from "./db/schema.ts";
import { CopyPastePublisher } from "./publishing/copyPaste.ts";
import { renderPostText } from "./publishing/Publisher.ts";
import { ingest, generateDrafts } from "./pipeline/daily.ts";

const app = new Hono();
const AUTH_TOKEN = process.env.DASHBOARD_AUTH_TOKEN;

app.use("/*", cors());

// Basit bearer koruması (token tanımlıysa /api altındaki her şeyi korur).
app.use("/api/*", async (c, next) => {
  if (!AUTH_TOKEN) return next(); // dev: token yoksa serbest
  const auth = c.req.header("Authorization");
  if (auth !== `Bearer ${AUTH_TOKEN}`) return c.json({ error: "unauthorized" }, 401);
  return next();
});

app.get("/", (c) => c.text("ProcessTürk Content Engine API — /api/health"));
app.get("/api/health", (c) => c.json({ ok: true }));

// Taslakları listele (opsiyonel ?status=)
app.get("/api/drafts", (c) => {
  const statusParam = c.req.query("status");
  const status = statusParam ? DraftStatus.parse(statusParam) : undefined;
  return c.json(listDrafts(status));
});

app.get("/api/drafts/:id", (c) => {
  const d = getDraft(c.req.param("id"));
  return d ? c.json(d) : c.json({ error: "not found" }, 404);
});

// Taslak düzenle (gövde, hashtag, hedef, zamanlama)
const PatchBody = z.object({
  editedBody: z.string().nullable().optional(),
  hashtags: z.array(z.string()).optional(),
  suggestedTarget: Target.optional(),
  scheduledFor: z.string().nullable().optional(),
});
app.patch("/api/drafts/:id", async (c) => {
  const body = PatchBody.parse(await c.req.json());
  const updated = updateDraft(c.req.param("id"), body);
  return updated ? c.json(updated) : c.json({ error: "not found" }, 404);
});

// Onayla → durum 'approved', hedefe göre kopyala-yapıştır metni döner
app.post("/api/drafts/:id/approve", async (c) => {
  const updated = updateDraft(c.req.param("id"), { status: "approved" });
  if (!updated) return c.json({ error: "not found" }, 404);
  const publisher = new CopyPastePublisher();
  const result = await publisher.publish({ draft: updated, target: updated.suggestedTarget });
  return c.json({ draft: updated, text: result.text });
});

app.post("/api/drafts/:id/reject", (c) => {
  const updated = updateDraft(c.req.param("id"), { status: "rejected" });
  return updated ? c.json(updated) : c.json({ error: "not found" }, 404);
});

// Yayın kaydı oluştur (Faz 1: elle paylaşıldı olarak işaretle)
const PublishBody = z.object({ target: Target.default("both") });
app.post("/api/drafts/:id/publish", async (c) => {
  const draft = getDraft(c.req.param("id"));
  if (!draft) return c.json({ error: "not found" }, 404);
  const { target } = PublishBody.parse(await c.req.json().catch(() => ({})));
  const publisher = new CopyPastePublisher();
  const result = await publisher.publish({ draft, target });
  insertPostLog({
    draftId: draft.id,
    target,
    platform: result.platform,
    externalPostId: result.externalPostId,
    status: result.status,
    error: result.error ?? null,
  });
  updateDraft(draft.id, { status: "published" });
  return c.json({ text: result.text ?? renderPostText(draft), status: result.status });
});

// Manuel "şimdi üret"
app.post("/api/generate", async (c) => {
  const added = await ingest();
  const drafts = await generateDrafts();
  return c.json({ ingested: added, draftsCreated: drafts });
});

app.get("/api/postlog", (c) => c.json(listPostLog()));

const port = Number(process.env.PORT || 8787);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`ProcessTürk Content Engine API → http://localhost:${info.port}`);
  if (!AUTH_TOKEN) console.warn("[uyarı] DASHBOARD_AUTH_TOKEN tanımlı değil — API korumasız (sadece dev).");
});

export { app };
