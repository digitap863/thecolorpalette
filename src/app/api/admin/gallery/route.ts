import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GalleryImage from "@/models/GalleryImage";
import { getCurrentAdmin } from "@/lib/auth";

/**
 * GET /api/admin/gallery
 * Returns ALL gallery images (including inactive ones) for the admin dashboard.
 * Requires admin authentication.
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json([], { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");

    const query: Record<string, unknown> = {};
    if (categoryParam && categoryParam !== "all") {
      query.category = { $regex: new RegExp(`^${categoryParam}$`, "i") };
    }

    const images = await GalleryImage.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const items = images.map((img: any) => ({
      id: img._id.toString(),
      src: img.src,
      alt: img.alt,
      category: img.category,
      title: img.title,
      order: img.order ?? 0,
      isActive: img.isActive !== false,
    }));

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/gallery:", error);
    return NextResponse.json([], { status: 200 });
  }
}
