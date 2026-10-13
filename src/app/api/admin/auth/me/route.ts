import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

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
    const admin = await Admin.findById(session.id).select("-password");
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, error: "User not found or inactive" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
