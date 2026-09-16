import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

const documentTypes = ["application/pdf"];
const imageTypes = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  if (!(await getAuthorizedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });

  try {
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload ?? "{}") as { kind?: string };
        const kind = payload.kind === "document" ? "documents" : "images";
        if (!pathname.startsWith(`${kind}/`)) throw new Error("Invalid upload path");

        return {
          allowedContentTypes: kind === "documents" ? documentTypes : imageTypes,
          maximumSizeInBytes: 15_000_000,
          addRandomSuffix: false,
        };
      },
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Upload could not be authorised" }, { status: 400 });
  }
}
