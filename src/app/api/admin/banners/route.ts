import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BannerSlide from "@/models/BannerSlide";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/banners
 * Returns ALL banner slides for admin management.
 */
interface RawBannerSlide {
  _id: { toString: () => string } | string;
  title?: string;
  subtitle?: string;
  images?: string[];
  mobileImages?: string[];
  order?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json([], { status: 200 });
    }

    const slides = await BannerSlide.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const items = (slides as unknown as RawBannerSlide[]).map((s) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      title: s.title || "",
      subtitle: s.subtitle || "",
      images: Array.isArray(s.images) ? s.images : [],
      mobileImages:
        Array.isArray(s.mobileImages) && s.mobileImages.length > 0
          ? s.mobileImages
          : s.images && s.images.length >= 2
          ? s.images.slice(0, 2)
          : [],
      order: s.order ?? 0,
      isActive: s.isActive !== false,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/banners:", error);
    return NextResponse.json({ error: "Failed to fetch banner slides" }, { status: 500 });
  }
}

/**
 * POST /api/admin/banners
 * Creates a new banner slide.
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { error: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, subtitle, images, mobileImages, order, isActive } = body;

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "At least one desktop image is required" },
        { status: 400 }
      );
    }

    const newSlide = await BannerSlide.create({
      title: title || "",
      subtitle: subtitle || "",
      images,
      mobileImages:
        Array.isArray(mobileImages) && mobileImages.length > 0
          ? mobileImages
          : images.slice(0, 2),
      order: typeof order === "number" ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      {
        id: newSlide._id.toString(),
        _id: newSlide._id.toString(),
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        images: newSlide.images,
        mobileImages: newSlide.mobileImages,
        order: newSlide.order,
        isActive: newSlide.isActive,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/admin/banners:", error);
    return NextResponse.json(
      { error: "Failed to create banner slide" },
      { status: 500 }
    );
  }
}
