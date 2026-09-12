import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { getBusinesses, getLeaders, getSiteContent } from "@/lib/site-content";

export async function GET() {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [content, leaders, businesses] = await Promise.all([
    getSiteContent(),
    getLeaders(true),
    getBusinesses(true),
  ]);
  try {
    const [documentRows, jobRows, inquiryRows] = await Promise.all([
      env.DB.prepare("SELECT * FROM documents ORDER BY year DESC, created_at DESC").all(),
      env.DB.prepare("SELECT * FROM jobs ORDER BY created_at DESC").all(),
      env.DB.prepare("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 100").all(),
    ]);
    return NextResponse.json({ content, leaders, businesses, documents: documentRows.results, jobs: jobRows.results, inquiries: inquiryRows.results });
  } catch {
    return NextResponse.json({ content, leaders, businesses, documents: [], jobs: [], inquiries: [] });
  }
}
