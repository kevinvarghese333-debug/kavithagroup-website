import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";

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
    await env.DB.prepare(
      "INSERT INTO inquiries (id, name, email, phone, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    ).bind(crypto.randomUUID(), name, email, phone || null, subject, message, "new", Date.now()).run();
    return NextResponse.json({ status: "received" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Enquiry service unavailable" }, { status: 503 });
  }
}
