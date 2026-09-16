import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { jobs } from "@/db/schema";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PUT(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { jobs?: Array<Record<string, unknown>> } | null;
  if (!body?.jobs || body.jobs.length > 50) return NextResponse.json({ error: "Invalid jobs list" }, { status: 400 });
  const db = getDb();
  await Promise.all(body.jobs.map((job) => {
    const now = Date.now();
    const values = {
      id: String(job.id || crypto.randomUUID()).slice(0, 80),
      title: String(job.title || "").trim().slice(0, 160),
      location: String(job.location || "Kerala").trim().slice(0, 160),
      type: String(job.type || "Full time").trim().slice(0, 80),
      description: String(job.description || "").trim().slice(0, 3000),
      published: job.published !== false,
      createdAt: Number(job.createdAt || now),
      updatedAt: now,
    };
    return db.insert(jobs).values(values).onConflictDoUpdate({
      target: jobs.id,
      set: {
        title: values.title,
        location: values.location,
        type: values.type,
        description: values.description,
        published: values.published,
        updatedAt: values.updatedAt,
      },
    });
  }));
  return NextResponse.json({ status: "saved" });
}
