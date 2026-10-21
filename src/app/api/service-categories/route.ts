import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ServiceCategory from "@/models/ServiceCategory";

export async function GET() {
  try {
    const conn = await dbConnect();

    if (conn) {
      const categories = await ServiceCategory.find({ isActive: true })
        .sort({ order: 1 })
        .lean();

      if (categories && categories.length > 0) {
        const formatted = categories.map((cat: any) => ({
          id: cat._id ? cat._id.toString() : cat.id,
          name: cat.name,
          slug: cat.slug,
          shortDescription: cat.shortDescription,
          order: cat.order ?? 0,
          isActive: cat.isActive !== false,
        }));
        return NextResponse.json(formatted);
      }
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error in GET /api/service-categories:", error);
    return NextResponse.json([]);
  }
}
