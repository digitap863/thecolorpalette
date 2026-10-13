import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ServiceCategory from "@/models/ServiceCategory";
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
 * GET /api/admin/service-categories
 * Returns all categories (including inactive) with their linked service count.
 */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [categories, serviceCounts] = await Promise.all([
      ServiceCategory.find().sort({ order: 1, name: 1 }).lean(),
      Service.aggregate([
        {
          $group: {
            _id: "$categoryId",
            count: { $sum: 1 },
          },
        },
      ]).catch(() => []),
    ]);

    const countMap: Record<string, number> = {};
    serviceCounts.forEach((sc: any) => {
      if (sc._id) {
        countMap[sc._id] = sc.count;
      }
    });

    const formatted = (categories || []).map((c: any) => {
      const idStr = c._id ? c._id.toString() : c.id;
      const count = (countMap[c.slug] || 0) + (countMap[idStr] || 0);
      return {
        id: idStr,
        name: c.name,
        slug: c.slug,
        shortDescription: c.shortDescription || "",
        image: c.image || "",
        order: c.order ?? 0,
        isActive: c.isActive !== false,
        serviceCount: count,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/service-categories:", error);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST /api/admin/service-categories
 * Create a new service category
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const { name, slug, shortDescription, image, order, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!shortDescription || !shortDescription.trim()) {
      return NextResponse.json(
        { error: "Category short description is required" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    let cleanSlug = slug && slug.trim() ? slugify(slug) : slugify(cleanName);

    if (!cleanSlug) {
      cleanSlug = `category-${Date.now()}`;
    }

    const existing = await ServiceCategory.findOne({ slug: cleanSlug });
    if (existing) {
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newCat = await ServiceCategory.create({
      name: cleanName,
      slug: cleanSlug,
      shortDescription: shortDescription.trim(),
      image: (image || "").trim(),
      order: typeof order === "number" ? order : parseInt(order || "0", 10) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json(
      {
        id: newCat._id.toString(),
        name: newCat.name,
        slug: newCat.slug,
        shortDescription: newCat.shortDescription,
        image: newCat.image,
        order: newCat.order,
        isActive: newCat.isActive,
        serviceCount: 0,
        createdAt: newCat.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/admin/service-categories:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
