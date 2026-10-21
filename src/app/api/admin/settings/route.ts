import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SiteSetting, { DEFAULT_SITE_SETTINGS } from "@/models/SiteSetting";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/admin/settings
 */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(DEFAULT_SITE_SETTINGS, { status: 200 });
    }

    let setting = await SiteSetting.findOne({ key: "general" }).lean();

 
    return NextResponse.json(
      {
        id: (setting as any)._id?.toString(),
        freeConsultationActive: setting?.freeConsultationActive === true,
        freeConsultationBadge:
          setting?.freeConsultationBadge || DEFAULT_SITE_SETTINGS.freeConsultationBadge,
        freeConsultationTitle:
          setting?.freeConsultationTitle ||
          (setting as any).freeConsultationText ||
          DEFAULT_SITE_SETTINGS.freeConsultationTitle,
        freeConsultationDescription:
          setting?.freeConsultationDescription !== undefined
            ? setting.freeConsultationDescription
            : DEFAULT_SITE_SETTINGS.freeConsultationDescription,
        updatedAt: setting?.updatedAt,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/admin/settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 */
export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json().catch(() => ({}));

    const updateData: Record<string, any> = {};

    if (body.freeConsultationActive !== undefined) {
      updateData.freeConsultationActive =
        body.freeConsultationActive === true ||
        body.freeConsultationActive === "true" ||
        body.freeConsultationActive === 1;
    }

    if (typeof body.freeConsultationBadge === "string") {
      updateData.freeConsultationBadge = body.freeConsultationBadge.trim();
    }

    if (typeof body.freeConsultationTitle === "string") {
      updateData.freeConsultationTitle = body.freeConsultationTitle.trim();
    }

    if (typeof body.freeConsultationDescription === "string") {
      updateData.freeConsultationDescription = body.freeConsultationDescription.trim();
    }

    const updated = await SiteSetting.findOneAndUpdate(
      { key: "general" },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(
      {
        success: true,
        settings: {
          id: (updated as any)._id?.toString(),
          freeConsultationActive: updated.freeConsultationActive === true,
          freeConsultationBadge:
            updated.freeConsultationBadge || DEFAULT_SITE_SETTINGS.freeConsultationBadge,
          freeConsultationTitle:
            updated.freeConsultationTitle || DEFAULT_SITE_SETTINGS.freeConsultationTitle,
          freeConsultationDescription:
            updated.freeConsultationDescription !== undefined
              ? updated.freeConsultationDescription
              : DEFAULT_SITE_SETTINGS.freeConsultationDescription,
          updatedAt: updated.updatedAt,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in PUT /api/admin/settings:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
