import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.title || !body.fileKey || !body.fileName) return NextResponse.json({ error: "Missing document details" }, { status: 400 });
  const id = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO documents (id, title, category, year, file_key, file_name, mime_type, size, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).bind(id, String(body.title).trim().slice(0, 180), String(body.category || "policy").slice(0, 40), Number(body.year || new Date().getFullYear()), String(body.fileKey), String(body.fileName), String(body.mimeType || "application/pdf"), Number(body.size || 0), body.published === false ? 0 : 1, now, now).run();
  return NextResponse.json({ id }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const row = await env.DB.prepare("SELECT file_key FROM documents WHERE id = ? LIMIT 1").bind(id).first<{ file_key: string }>();
  if (row?.file_key) await env.FILES.delete(row.file_key);
  await env.DB.prepare("DELETE FROM documents WHERE id = ?").bind(id).run();
  return NextResponse.json({ status: "deleted" });
}
