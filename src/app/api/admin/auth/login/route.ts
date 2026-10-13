import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { comparePassword, hashPassword, signAdminToken, ADMIN_AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if any admin exists in the database. If not, auto-seed default admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultPasswordHash = await hashPassword("AdminPassword123!");
      await Admin.create({
        name: "Super Admin",
        email: "admin@thecolorpalette.com",
        password: defaultPasswordHash,
        role: "superadmin",
        isActive: true,
      });
      console.log("⚡ Auto-created initial default admin account: admin@thecolorpalette.com / AdminPassword123!");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, error: "This admin account has been deactivated" },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update lastLogin timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // Sign JWT token
    const token = await signAdminToken({
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error: unknown) {
    console.error("Admin login error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
