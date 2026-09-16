import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { leaders } from "@/db/schema";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { leaders?: Array<Record<string, unknown>> } | null;
  if (!body?.leaders || body.leaders.length > 20) return NextResponse.json({ error: "Invalid leadership list" }, { status: 400 });
  const db = getDb();
  await Promise.all(body.leaders.map((leader, index) => {
    const values = {
      id: String(leader.id || crypto.randomUUID()).slice(0, 80),
      name: String(leader.name || "").trim().slice(0, 120),
      role: String(leader.role || "").trim().slice(0, 120),
      bio: String(leader.bio || "").trim().slice(0, 2000),
      imageKey: leader.imageKey ? String(leader.imageKey).slice(0, 500) : null,
      position: Number(leader.position ?? index + 1),
      published: leader.published !== false,
      updatedAt: Date.now(),
    };
    return db.insert(leaders).values(values).onConflictDoUpdate({
      target: leaders.id,
      set: {
        name: values.name,
        role: values.role,
        bio: values.bio,
        imageKey: values.imageKey,
        position: values.position,
        published: values.published,
        updatedAt: values.updatedAt,
      },
    });
  }));
  return NextResponse.json({ status: "saved" });
}
