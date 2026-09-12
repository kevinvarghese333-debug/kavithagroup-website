import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { businesses?: Array<Record<string, unknown>> } | null;
  if (!body?.businesses || body.businesses.length > 30) return NextResponse.json({ error: "Invalid business list" }, { status: 400 });
  const statements = body.businesses.map((business, index) => env.DB.prepare(
    "INSERT INTO businesses (id, name, category, summary, location, image_key, website_url, position, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, category = excluded.category, summary = excluded.summary, location = excluded.location, image_key = excluded.image_key, website_url = excluded.website_url, position = excluded.position, published = excluded.published, updated_at = excluded.updated_at",
  ).bind(
    String(business.id || crypto.randomUUID()).slice(0, 80),
    String(business.name || "").trim().slice(0, 140),
    String(business.category || "").trim().slice(0, 120),
    String(business.summary || "").trim().slice(0, 2000),
    business.location ? String(business.location).trim().slice(0, 200) : null,
    business.imageKey ? String(business.imageKey).replace(/^\/media\//, "").slice(0, 400) : null,
    business.websiteUrl ? String(business.websiteUrl).trim().slice(0, 500) : null,
    Number(business.position ?? index + 1),
    business.published === false ? 0 : 1,
    Date.now(),
  ));
  if (statements.length) await env.DB.batch(statements);
  return NextResponse.json({ status: "saved" });
}
