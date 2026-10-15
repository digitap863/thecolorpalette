import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
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
 * GET /api/admin/services/[id]
 * Fetch single service by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const service = await Service.findById(id).lean();
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: (service as any)._id.toString(),
      name: service.name,
      slug: service.slug,
      categoryId: service.categoryId,
      shortDescription: service.shortDescription,
      description: service.description || "",
      image: service.image || "",
      images: Array.isArray(service.images) ? service.images : [],
      points: Array.isArray(service.points) ? service.points : [],
      pdfUrl: service.pdfUrl || null,
      isActive: service.isActive !== false,
      order: service.order ?? 0,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/services/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/services/[id]
 * Update service by ID
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) {
      const cleanName = String(body.name).trim();
      if (!cleanName) {
        return NextResponse.json(
          { error: "Service name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = cleanName;
    }

    if (body.slug !== undefined) {
      const cleanSlug = slugify(String(body.slug));
      if (!cleanSlug) {
        return NextResponse.json(
          { error: "Invalid slug format" },
          { status: 400 }
        );
      }

      // Check if new slug conflicts with another service
      const existing = await Service.findOne({
        slug: cleanSlug,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Another service already has this slug" },
          { status: 409 }
        );
      }
      updateData.slug = cleanSlug;
    }

    if (body.categoryId !== undefined) {
      updateData.categoryId = String(body.categoryId).trim();
    }

    if (body.shortDescription !== undefined) {
      updateData.shortDescription = String(body.shortDescription).trim();
    }

    if (body.description !== undefined) {
      updateData.description = String(body.description || "").trim();
    }

    if (body.image !== undefined) {
      updateData.image = String(body.image || "").trim();
    }

    if (body.images !== undefined) {
      updateData.images = Array.isArray(body.images)
        ? body.images.map((i: any) => String(i || "").trim()).filter(Boolean)
        : [];
    }

    if (body.points !== undefined) {
      updateData.points = Array.isArray(body.points)
        ? body.points.map((p: any) => String(p || "").trim()).filter(Boolean)
        : [];
    }

    if (body.pdfUrl !== undefined) {
      updateData.pdfUrl = body.pdfUrl ? String(body.pdfUrl).trim() : null;
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    if (body.order !== undefined) {
      updateData.order =
        typeof body.order === "number"
          ? body.order
          : parseInt(body.order || "0", 10) || 0;
    }

    const updated = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: (updated as any)._id.toString(),
      name: updated.name,
      slug: updated.slug,
      categoryId: updated.categoryId,
      shortDescription: updated.shortDescription,
      description: updated.description,
      image: updated.image,
      images: updated.images,
      points: updated.points,
      pdfUrl: updated.pdfUrl,
      isActive: updated.isActive,
      order: updated.order,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/services/[id]:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A service with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to update service" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/services/[id]
 * Delete service by ID
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Service "${service.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/services/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
