import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contentBlocks } from "@/db/schema";
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
  await getDb()
    .insert(contentBlocks)
    .values({ key: "site_content", value: JSON.stringify(content), updatedAt: Date.now(), updatedBy: admin.email })
    .onConflictDoUpdate({
      target: contentBlocks.key,
      set: { value: JSON.stringify(content), updatedAt: Date.now(), updatedBy: admin.email },
    });
  return NextResponse.json({ content });
}
