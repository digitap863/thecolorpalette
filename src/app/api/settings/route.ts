import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SiteSetting, { DEFAULT_SITE_SETTINGS } from "@/models/SiteSetting";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        {
          freeConsultationActive: false,
          freeConsultationBadge: DEFAULT_SITE_SETTINGS.freeConsultationBadge,
          freeConsultationTitle: DEFAULT_SITE_SETTINGS.freeConsultationTitle,
          freeConsultationDescription: DEFAULT_SITE_SETTINGS.freeConsultationDescription,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    let setting = await SiteSetting.findOne({ key: "general" }).lean();

  

    return NextResponse.json(
      {
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
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/settings:", error);
    return NextResponse.json(
      {
        freeConsultationActive: false,
        freeConsultationBadge: DEFAULT_SITE_SETTINGS.freeConsultationBadge,
        freeConsultationTitle: DEFAULT_SITE_SETTINGS.freeConsultationTitle,
        freeConsultationDescription: DEFAULT_SITE_SETTINGS.freeConsultationDescription,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
