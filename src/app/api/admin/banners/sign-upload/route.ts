import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const folder = (body?.folder as string) || "banners";

    const signatureData = generateUploadSignature(folder);

    return NextResponse.json(signatureData, { status: 200 });
  } catch (error) {
    console.error("Error generating banner upload signature:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
