import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { documents, inquiries, jobs } from "@/db/schema";
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
    const db = getDb();
    const [documentRows, jobRows, inquiryRows] = await Promise.all([
      db.select().from(documents).orderBy(desc(documents.year), desc(documents.createdAt)),
      db.select().from(jobs).orderBy(desc(jobs.createdAt)),
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(100),
    ]);
    return NextResponse.json({ content, leaders, businesses, documents: documentRows, jobs: jobRows, inquiries: inquiryRows });
  } catch {
    return NextResponse.json({ content, leaders, businesses, documents: [], jobs: [], inquiries: [] });
  }
}
