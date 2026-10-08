import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Database already seeded to MongoDB Atlas.",
  });
}
