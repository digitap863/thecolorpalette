import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GalleryImage from "@/models/GalleryImage";
import { getCurrentAdmin } from "@/lib/auth";
import { deleteCloudinaryImage, extractPublicId } from "@/lib/cloudinary";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** GET /api/gallery/[id] - Fetch a single gallery image */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const image = await GalleryImage.findById(id).lean();
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery image" },
      { status: 500 }
    );
  }
}

/** PATCH /api/gallery/[id] - Update a gallery image */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const body = await request.json();
    const { src, alt, category, title, order, isActive, socialUrl, socialPlatform, isSocialPost } = body;

    const updateData: Record<string, unknown> = {};
    if (src !== undefined) updateData.src = src;
    if (alt !== undefined) updateData.alt = alt;
    if (category !== undefined) updateData.category = category;
    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (socialUrl !== undefined) {
      updateData.socialUrl = socialUrl;
      updateData.isSocialPost = Boolean(isSocialPost !== undefined ? isSocialPost : socialUrl);
    }
    if (socialPlatform !== undefined) updateData.socialPlatform = socialPlatform;
    if (isSocialPost !== undefined && socialUrl === undefined) updateData.isSocialPost = isSocialPost;

    const updated = await GalleryImage.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

/** DELETE /api/gallery/[id] - Delete a gallery image and remove from Cloudinary */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const image = (await GalleryImage.findById(id).lean()) as { src?: string } | null;
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Attempt to delete from Cloudinary if it's a Cloudinary URL
    if (image.src && image.src.includes("res.cloudinary.com")) {
      const publicId = extractPublicId(image.src);
      if (publicId) {
        try {
          await deleteCloudinaryImage(publicId);
        } catch (cloudErr) {
          console.error("Cloudinary delete failed (continuing):", cloudErr);
        }
      }
    }

    await GalleryImage.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
