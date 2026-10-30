import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BannerSlide from "@/models/BannerSlide";

export const dynamic = "force-dynamic";

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
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json([], { status: 200 });
    }

    const slides = await BannerSlide.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (!slides || slides.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const items = (slides as unknown as RawBannerSlide[]).map((s) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      title: s.title || "",
      subtitle: s.subtitle || "",
      images: Array.isArray(s.images) && s.images.length > 0 ? s.images : [],
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
    console.error("Error in GET /api/banners:", error);
    return NextResponse.json([], { status: 200 });
  }
}
