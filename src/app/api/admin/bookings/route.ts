import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { getCurrentAdmin } from "@/lib/auth";

/**
 * GET /api/admin/bookings
 * Returns all bookings for admin management, with optional search and status filter.
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
    const searchParam = searchParams.get("search");
    const statusParam = searchParams.get("status");
    const dateParam = searchParams.get("date");

    const query: Record<string, any> = {};

    if (statusParam && statusParam !== "all") {
      query.status = statusParam;
    }

    if (dateParam) {
      query.date = dateParam;
    }

    if (searchParam) {
      const term = searchParam.trim();
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { phone: { $regex: term, $options: "i" } },
        { service: { $regex: term, $options: "i" } },
        { message: { $regex: term, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const formatted = (bookings || []).map((b: any) => ({
      id: b._id ? b._id.toString() : b.id,
      name: b.name,
      phone: b.phone,
      date: b.date,
      service: b.service,
      message: b.message || "",
      status: b.status || "pending",
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/bookings
 * Allows admin to manually create an appointment (e.g. walk-in or phone call booking)
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const { name, phone, date, service, message, status } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits" },
        { status: 400 }
      );
    }

    if (!service || !service.trim()) {
      return NextResponse.json(
        { error: "Service selection is required" },
        { status: 400 }
      );
    }

    if (!date || !date.trim()) {
      return NextResponse.json(
        { error: "Booking date is required" },
        { status: 400 }
      );
    }

    const newBooking = await Booking.create({
      name: name.trim(),
      phone: cleanPhone,
      date: date.trim(),
      service: service.trim(),
      message: (message || "").trim(),
      status: status && ["pending", "confirmed", "completed", "cancelled"].includes(status)
        ? status
        : "pending",
    });

    return NextResponse.json(
      {
        id: newBooking._id.toString(),
        name: newBooking.name,
        phone: newBooking.phone,
        date: newBooking.date,
        service: newBooking.service,
        message: newBooking.message,
        status: newBooking.status,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/admin/bookings:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
