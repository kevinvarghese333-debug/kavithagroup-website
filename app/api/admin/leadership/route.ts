import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { leaders?: Array<Record<string, unknown>> } | null;
  if (!body?.leaders || body.leaders.length > 20) return NextResponse.json({ error: "Invalid leadership list" }, { status: 400 });
  const statements = body.leaders.map((leader, index) => env.DB.prepare(
    "INSERT INTO leaders (id, name, role, bio, image_key, position, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, role = excluded.role, bio = excluded.bio, image_key = excluded.image_key, position = excluded.position, published = excluded.published, updated_at = excluded.updated_at",
  ).bind(
    String(leader.id || crypto.randomUUID()).slice(0, 80),
    String(leader.name || "").trim().slice(0, 120),
    String(leader.role || "").trim().slice(0, 120),
    String(leader.bio || "").trim().slice(0, 2000),
    leader.imageKey ? String(leader.imageKey).replace(/^\/media\//, "").slice(0, 400) : null,
    Number(leader.position ?? index + 1),
    leader.published === false ? 0 : 1,
    Date.now(),
  ));
  if (statements.length) await env.DB.batch(statements);
  return NextResponse.json({ status: "saved" });
}
