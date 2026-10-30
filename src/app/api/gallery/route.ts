import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GalleryImage from "@/models/GalleryImage";
import { GalleryItem } from "@/types/gallery";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const limitParam = searchParams.get("limit");

    const conn = await dbConnect();

    if (!conn) {
      return NextResponse.json([], { status: 200 });
    }

    const query: Record<string, unknown> = { isActive: true };

    if (categoryParam && categoryParam !== "all") {
      query.category = { $regex: new RegExp(`^${categoryParam}$`, "i") };
    }

    const dbImages = await GalleryImage.find(query).sort({ order: 1, createdAt: -1 }).lean();

    let items: GalleryItem[] = [];
    if (dbImages && dbImages.length > 0) {
      items = (dbImages as unknown as Array<{
        _id?: { toString: () => string } | string;
        src: string;
        alt: string;
        category: string;
        title: string;
        order?: number;
        isActive?: boolean;
        socialUrl?: string;
        socialPlatform?: string;
        isSocialPost?: boolean;
      }>).map((img, idx) => ({
        id: img._id ? img._id.toString() : String(idx + 1),
        src: img.src,
        alt: img.alt,
        category: img.category,
        title: img.title,
        order: img.order ?? idx + 1,
        isActive: img.isActive !== false,
        socialUrl: img.socialUrl || "",
        socialPlatform: img.socialPlatform || "",
        isSocialPost: img.isSocialPost || false,
      }));
    }

    if (limitParam) {
      const limitVal = parseInt(limitParam, 10);
      if (!isNaN(limitVal) && limitVal > 0) {
        items = items.slice(0, limitVal);
      }
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/gallery:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { error: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { src, alt, category, title, order, isActive, socialUrl, socialPlatform, isSocialPost } = body;

    const isReel = Boolean(isSocialPost || socialUrl);

    if (isReel) {
      if (!socialUrl || !title) {
        return NextResponse.json(
          { error: "Reel URL and Caption are required" },
          { status: 400 }
        );
      }
    } else {
      if (!src || !alt || !category || !title) {
        return NextResponse.json(
          { error: "Missing required fields: src, alt, category, title" },
          { status: 400 }
        );
      }
    }

    const newImage = await GalleryImage.create({
      src: src || socialUrl || "",
      alt: alt || title || "Reel",
      category: category || (isReel ? "Reel" : "General"),
      title: title.trim(),
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      socialUrl: socialUrl || "",
      socialPlatform: socialPlatform || "instagram",
      isSocialPost: isReel,
    });

    return NextResponse.json(
      {
        id: newImage._id.toString(),
        src: newImage.src,
        alt: newImage.alt,
        category: newImage.category,
        title: newImage.title,
        order: newImage.order,
        isActive: newImage.isActive,
        socialUrl: newImage.socialUrl,
        socialPlatform: newImage.socialPlatform,
        isSocialPost: newImage.isSocialPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
