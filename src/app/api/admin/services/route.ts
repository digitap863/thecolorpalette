import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";
import { getCurrentAdmin } from "@/lib/auth";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * GET /api/admin/services
 * Returns ALL services (including inactive) for admin management.
 * Supports ?category=..., ?search=..., ?status=...
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
    const searchParam = searchParams.get("search");
    const statusParam = searchParams.get("status"); // 'all' | 'active' | 'inactive'

    const query: Record<string, any> = {};

    if (categoryParam && categoryParam !== "all") {
      query.categoryId = categoryParam;
    }

    if (statusParam === "active") {
      query.isActive = true;
    } else if (statusParam === "inactive") {
      query.isActive = false;
    }

    if (searchParam) {
      const term = searchParam.trim();
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { shortDescription: { $regex: term, $options: "i" } },
        { slug: { $regex: term, $options: "i" } },
      ];
    }

    const services = await Service.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const formatted = (services || []).map((s: any) => ({
      id: s._id ? s._id.toString() : s.id,
      categoryId: s.categoryId,
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription,
      description: s.description || "",
      image: s.image || "",
      images: Array.isArray(s.images) ? s.images : [],
      points: Array.isArray(s.points) ? s.points : [],
      pdfUrl: s.pdfUrl || null,
      isActive: s.isActive !== false,
      order: s.order ?? 0,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/services
 * Create a new service from the admin panel.
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
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    let {
      name,
      slug,
      categoryId,
      shortDescription,
      description,
      image,
      images,
      points,
      pdfUrl,
      isActive,
      order,
    } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Service name is required" },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== "string" || !categoryId.trim()) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!shortDescription || typeof shortDescription !== "string" || !shortDescription.trim()) {
      return NextResponse.json(
        { error: "Short description is required" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    let cleanSlug = slug && typeof slug === "string" && slug.trim()
      ? slugify(slug)
      : slugify(cleanName);

    if (!cleanSlug) {
      cleanSlug = `service-${Date.now()}`;
    }

    // Ensure slug uniqueness
    const existing = await Service.findOne({ slug: cleanSlug });
    if (existing) {
      // Append incremental or timestamp suffix
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Clean array fields
    const cleanImages = Array.isArray(images)
      ? images.map((i: any) => String(i || "").trim()).filter(Boolean)
      : [];

    const cleanPoints = Array.isArray(points)
      ? points.map((p: any) => String(p || "").trim()).filter(Boolean)
      : [];

    const newService = await Service.create({
      name: cleanName,
      slug: cleanSlug,
      categoryId: categoryId.trim(),
      shortDescription: shortDescription.trim(),
      description: (description || "").trim(),
      image: (image || "").trim(),
      images: cleanImages,
      points: cleanPoints,
      pdfUrl: pdfUrl ? String(pdfUrl).trim() : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: typeof order === "number" ? order : parseInt(order || "0", 10) || 0,
    });

    return NextResponse.json(
      {
        id: newService._id.toString(),
        name: newService.name,
        slug: newService.slug,
        categoryId: newService.categoryId,
        shortDescription: newService.shortDescription,
        description: newService.description,
        image: newService.image,
        images: newService.images,
        points: newService.points,
        pdfUrl: newService.pdfUrl,
        isActive: newService.isActive,
        order: newService.order,
        createdAt: newService.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/admin/services:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A service with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to create service" },
      { status: 500 }
    );
  }
}
