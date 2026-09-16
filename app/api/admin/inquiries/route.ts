import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const status = String(body?.status || "");
  if (!body?.id || !["new", "in-progress", "closed"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  await getDb().update(inquiries).set({ status }).where(eq(inquiries.id, String(body.id)));
  return NextResponse.json({ status: "saved" });
}
