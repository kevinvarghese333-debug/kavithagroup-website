import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { businesses } from "@/db/schema";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { businesses?: Array<Record<string, unknown>> } | null;
  if (!body?.businesses || body.businesses.length > 30) return NextResponse.json({ error: "Invalid business list" }, { status: 400 });
  const db = getDb();
  await Promise.all(body.businesses.map((business, index) => {
    const values = {
      id: String(business.id || crypto.randomUUID()).slice(0, 80),
      name: String(business.name || "").trim().slice(0, 140),
      category: String(business.category || "").trim().slice(0, 120),
      summary: String(business.summary || "").trim().slice(0, 2000),
      location: business.location ? String(business.location).trim().slice(0, 200) : null,
      imageKey: business.imageKey ? String(business.imageKey).slice(0, 500) : null,
      websiteUrl: business.websiteUrl ? String(business.websiteUrl).trim().slice(0, 500) : null,
      position: Number(business.position ?? index + 1),
      published: business.published !== false,
      updatedAt: Date.now(),
    };
    return db.insert(businesses).values(values).onConflictDoUpdate({
      target: businesses.id,
      set: {
        name: values.name,
        category: values.category,
        summary: values.summary,
        location: values.location,
        imageKey: values.imageKey,
        websiteUrl: values.websiteUrl,
        position: values.position,
        published: values.published,
        updatedAt: values.updatedAt,
      },
    });
  }));
  return NextResponse.json({ status: "saved" });
}
