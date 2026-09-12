import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { jobs?: Array<Record<string, unknown>> } | null;
  if (!body?.jobs || body.jobs.length > 50) return NextResponse.json({ error: "Invalid jobs list" }, { status: 400 });
  const statements = body.jobs.map((job) => {
    const now = Date.now();
    return env.DB.prepare(
      "INSERT INTO jobs (id, title, location, type, description, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, location = excluded.location, type = excluded.type, description = excluded.description, published = excluded.published, updated_at = excluded.updated_at",
    ).bind(String(job.id || crypto.randomUUID()), String(job.title || "").trim().slice(0, 160), String(job.location || "Kerala").trim().slice(0, 160), String(job.type || "Full time").trim().slice(0, 80), String(job.description || "").trim().slice(0, 3000), job.published === false ? 0 : 1, Number(job.created_at || now), now);
  });
  if (statements.length) await env.DB.batch(statements);
  return NextResponse.json({ status: "saved" });
}
