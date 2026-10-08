import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    const conn = await dbConnect();

    if (!conn) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection not configured. Please set MONGODB_URI.",
        },
        { status: 503 }
      );
    }

    const bookings = await Booking.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching bookings from MongoDB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}
