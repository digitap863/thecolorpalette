import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { getCurrentAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/bookings/[id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const booking = await Booking.findById(id).lean();
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: (booking as any)._id.toString(),
      name: booking.name,
      phone: booking.phone,
      date: booking.date,
      service: booking.service,
      message: booking.message || "",
      status: booking.status || "pending",
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/bookings/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/bookings/[id]
 * Update status or appointment details
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

    if (body.status !== undefined) {
      if (!["pending", "confirmed", "completed", "cancelled"].includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    }

    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.phone !== undefined) updateData.phone = String(body.phone).trim();
    if (body.date !== undefined) updateData.date = String(body.date).trim();
    if (body.service !== undefined) updateData.service = String(body.service).trim();
    if (body.message !== undefined) updateData.message = String(body.message || "").trim();

    const updated = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: (updated as any)._id.toString(),
      name: updated.name,
      phone: updated.phone,
      date: updated.date,
      service: updated.service,
      message: updated.message || "",
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/bookings/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/bookings/[id]
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Booking for ${deleted.name} deleted successfully`,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/bookings/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
