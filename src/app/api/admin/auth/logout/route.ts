import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_AUTH_COOKIE);

    return NextResponse.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to logo_newut";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
