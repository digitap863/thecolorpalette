import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BannerSlide from "@/models/BannerSlide";
import { DEFAULT_BANNER_SLIDES } from "@/lib/defaultBanners";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(DEFAULT_BANNER_SLIDES, { status: 200 });
    }

    let slides = await BannerSlide.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // If database has no banner slides yet, seed with defaults
    if (!slides || slides.length === 0) {
      const count = await BannerSlide.countDocuments();
      if (count === 0) {
        await BannerSlide.insertMany(
          DEFAULT_BANNER_SLIDES.map((s, idx) => ({
            title: s.title,
            subtitle: s.subtitle,
            images: s.images,
            mobileImages: s.mobileImages,
            order: s.order ?? idx + 1,
            isActive: true,
          }))
        );
        slides = await BannerSlide.find({ isActive: true })
          .sort({ order: 1, createdAt: 1 })
          .lean();
      }
    }

    if (!slides || slides.length === 0) {
      return NextResponse.json(DEFAULT_BANNER_SLIDES, { status: 200 });
    }

    const items = slides.map((s: any) => ({
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
    return NextResponse.json(DEFAULT_BANNER_SLIDES, { status: 200 });
  }
}
