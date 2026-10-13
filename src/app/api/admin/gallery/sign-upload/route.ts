import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

/**
 * POST /api/admin/gallery/sign-upload
 * Returns a signed upload signature for direct browser-to-Cloudinary upload.
 * Requires admin authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const folder = (body?.folder as string) || "gallery";

    const signatureData = generateUploadSignature(folder);

    return NextResponse.json(signatureData, { status: 200 });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
