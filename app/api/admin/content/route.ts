import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { defaultContent, type SiteContent } from "@/lib/site-content";

export async function PUT(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Partial<SiteContent> | null;
  if (!body) return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  const content = Object.fromEntries(Object.keys(defaultContent).map((key) => {
    const value = body[key as keyof SiteContent];
    return [key, typeof value === "string" ? value.trim().slice(0, key === "storyBody" ? 3000 : 500) : defaultContent[key as keyof SiteContent]];
  })) as SiteContent;
  await env.DB.prepare(
    "INSERT INTO content_blocks (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by",
  ).bind("site_content", JSON.stringify(content), Date.now(), admin.email).run();
  return NextResponse.json({ content });
}
