import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.formData();
  const file = data.get("file");
  const kind = data.get("kind") === "document" ? "documents" : "images";
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > 15_000_000) {
    return NextResponse.json({ error: "Use a PDF, JPG, PNG or WebP file under 15 MB" }, { status: 400 });
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const key = `${kind}/${crypto.randomUUID()}-${safeName}`;
  await env.FILES.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  return NextResponse.json({ key, url: `/media/${key}`, fileName: file.name, mimeType: file.type, size: file.size }, { status: 201 });
}
