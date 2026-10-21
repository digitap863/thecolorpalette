import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ServiceCategory from "@/models/ServiceCategory";
import Service from "@/models/Service";
import { getCurrentAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

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
 * GET /api/admin/service-categories/[id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const category = await ServiceCategory.findById(id).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const serviceCount = await Service.countDocuments({
      $or: [{ categoryId: category.slug }, { categoryId: id }],
    });

    return NextResponse.json({
      id: (category as any)._id.toString(),
      name: category.name,
      slug: category.slug,
      shortDescription: category.shortDescription || "",
      order: category.order ?? 0,
      isActive: category.isActive !== false,
      serviceCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/service-categories/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/service-categories/[id]
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const currentCat = await ServiceCategory.findById(id);
    if (!currentCat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) {
      const cleanName = String(body.name).trim();
      if (!cleanName) {
        return NextResponse.json(
          { error: "Category name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = cleanName;
    }

    let newSlug = "";
    if (body.slug !== undefined) {
      newSlug = slugify(String(body.slug));
      if (!newSlug) {
        return NextResponse.json(
          { error: "Invalid slug format" },
          { status: 400 }
        );
      }

      const existing = await ServiceCategory.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Another category already uses this slug" },
          { status: 409 }
        );
      }
      updateData.slug = newSlug;
    }

    if (body.shortDescription !== undefined) {
      updateData.shortDescription = String(body.shortDescription).trim();
    }

    if (body.order !== undefined) {
      updateData.order =
        typeof body.order === "number"
          ? body.order
          : parseInt(body.order || "0", 10) || 0;
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    const oldSlug = currentCat.slug;
    const updated = await ServiceCategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    // If slug changed, update linked services to maintain referential integrity
    if (newSlug && newSlug !== oldSlug) {
      await Service.updateMany({ categoryId: oldSlug }, { categoryId: newSlug });
    }

    const serviceCount = await Service.countDocuments({
      $or: [{ categoryId: updated?.slug }, { categoryId: id }],
    });

    return NextResponse.json({
      id: (updated as any)._id.toString(),
      name: updated?.name,
      slug: updated?.slug,
      shortDescription: updated?.shortDescription,
      order: updated?.order,
      isActive: updated?.isActive,
      serviceCount,
      updatedAt: updated?.updatedAt,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/service-categories/[id]:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/service-categories/[id]
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const category = await ServiceCategory.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    // Count how many services are in this category
    const linkedServicesCount = await Service.countDocuments({
      $or: [{ categoryId: category.slug }, { categoryId: id }],
    });

    if (linkedServicesCount > 0 && !force) {
      return NextResponse.json(
        {
          error: `Cannot delete: ${linkedServicesCount} services are assigned to this category. Please reassign or delete those services first, or confirm force delete.`,
          linkedServicesCount,
          requiresForce: true,
        },
        { status: 400 }
      );
    }

    await ServiceCategory.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/service-categories/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
