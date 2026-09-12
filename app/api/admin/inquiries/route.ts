import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const status = String(body?.status || "");
  if (!body?.id || !["new", "in-progress", "closed"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  await env.DB.prepare("UPDATE inquiries SET status = ? WHERE id = ?").bind(status, String(body.id)).run();
  return NextResponse.json({ status: "saved" });
}
