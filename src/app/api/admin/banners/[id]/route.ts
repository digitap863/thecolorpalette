import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BannerSlide from "@/models/BannerSlide";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/banners/[id]
 * Updates an existing banner slide.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, images, mobileImages, order, isActive } = body;

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (Array.isArray(images)) updateData.images = images;
    if (Array.isArray(mobileImages)) updateData.mobileImages = mobileImages;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await BannerSlide.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Banner slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: (updated as any)._id.toString(),
        _id: (updated as any)._id.toString(),
        title: (updated as any).title,
        subtitle: (updated as any).subtitle,
        images: (updated as any).images,
        mobileImages: (updated as any).mobileImages,
        order: (updated as any).order,
        isActive: (updated as any).isActive,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/admin/banners/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update banner slide" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/banners/[id]
 * Deletes a banner slide.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const deleted = await BannerSlide.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Banner slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Banner slide deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/admin/banners/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete banner slide" },
      { status: 500 }
    );
  }
}
