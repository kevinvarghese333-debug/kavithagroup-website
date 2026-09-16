import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const name = text(body.name, 100);
  const email = text(body.email, 200);
  const phone = text(body.phone, 40);
  const subject = text(body.subject, 120);
  const message = text(body.message, 3000);
  if (name.length < 2 || !email.includes("@") || subject.length < 2 || message.length < 10) {
    return NextResponse.json({ error: "Please complete the required fields" }, { status: 400 });
  }
  try {
    await getDb().insert(inquiries).values({
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: "new",
      createdAt: Date.now(),
    });
    return NextResponse.json({ status: "received" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Enquiry service unavailable" }, { status: 503 });
  }
}
