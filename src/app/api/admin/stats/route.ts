import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import ServiceCategory from "@/models/ServiceCategory";
import GalleryImage from "@/models/GalleryImage";

export async function GET() {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const [
      totalBookings,
      pendingBookings,
      totalServices,
      totalCategories,
      totalGallery,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments().catch(() => 0),
      Booking.countDocuments({ status: "pending" }).catch(() => 0),
      Service.countDocuments().catch(() => 0),
      ServiceCategory.countDocuments().catch(() => 0),
      GalleryImage.countDocuments().catch(() => 0),
      Booking.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        totalServices,
        totalCategories,
        totalGallery,
        recentBookings,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load admin stats";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
