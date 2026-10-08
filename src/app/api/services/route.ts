import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";
import { ServiceData } from "@/types/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const featuredParam = searchParams.get("featured");
    const searchParam = searchParams.get("search");

    const conn = await dbConnect();

    let servicesData: ServiceData[] = [];

    if (conn) {
      const query: any = { isActive: true };

      if (categoryParam && categoryParam !== "all") {
        query.categoryId = categoryParam;
      }

      if (featuredParam === "true") {
        query.featured = true;
      }

      const services = await Service.find(query).sort({ order: 1 }).lean();

      if (services && services.length > 0) {
        servicesData = services.map((s: any) => ({
          id: s._id ? s._id.toString() : s.id,
          categoryId: s.categoryId,
          name: s.name,
          slug: s.slug,
          shortDescription: s.shortDescription,
          image: s.image || "",
          featured: Boolean(s.featured),
          isActive: s.isActive !== false,
          order: s.order ?? 0,
        }));
      }
    }

    // Apply client-side search filter if query search provided
    if (searchParam) {
      const term = searchParam.toLowerCase().trim();
      servicesData = servicesData.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.shortDescription.toLowerCase().includes(term)
      );
    }

    return NextResponse.json(servicesData);
  } catch (error) {
    console.error("Error in GET /api/services:", error);
    return NextResponse.json([]);
  }
}
