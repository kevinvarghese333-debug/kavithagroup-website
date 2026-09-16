import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { documents } from "@/db/schema";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.title || !body.fileKey || !body.fileName) return NextResponse.json({ error: "Missing document details" }, { status: 400 });
  const id = crypto.randomUUID();
  const now = Date.now();
  await getDb().insert(documents).values({
    id,
    title: String(body.title).trim().slice(0, 180),
    category: String(body.category || "policy").slice(0, 40),
    year: Number(body.year || new Date().getFullYear()),
    fileKey: String(body.fileKey).slice(0, 500),
    fileName: String(body.fileName).slice(0, 220),
    mimeType: String(body.mimeType || "application/pdf").slice(0, 120),
    size: Number(body.size || 0),
    published: body.published !== false,
    createdAt: now,
    updatedAt: now,
  });
  return NextResponse.json({ id }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const db = getDb();
  const [row] = await db.select({ fileKey: documents.fileKey }).from(documents).where(eq(documents.id, id)).limit(1);
  if (row?.fileKey) await del(row.fileKey);
  await db.delete(documents).where(eq(documents.id, id));
  return NextResponse.json({ status: "deleted" });
}
