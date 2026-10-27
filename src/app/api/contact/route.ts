import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

const SERVICE_NAMES: Record<string, string> = {
  "facial-treatments": "Facials & Medifacials",
  "laser-treatments": "Laser & Light-Based Treatments",
  "chemical-peels": "Chemical Peels",
  "advance-skin-procedures": "Advance Skin Procedures",
  gfc: "GFC",
  prp: "PRP",
  "skin-boosters": "Skin Boosters",
  "hair-treatments": "Hair & Scalp Treatments",
  "body-hand-foot-care": "Body, Hand & Foot Care",
  "iv-therapy": "IV Therapy",
  "nail-services": "Nail Services",
  "lash-services": "Lash Services",
  other: "Other / Not Sure",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, date, service, message } = body;

    if (!name || !phone || !date || !service) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    const readableService = SERVICE_NAMES[service] || service;

    // 1. Save Booking Document in MongoDB (if MONGODB_URI is provided)
    let savedBooking = null;
    try {
      const conn = await dbConnect();
      if (conn) {
        savedBooking = await Booking.create({
          name,
          phone,
          date,
          service: readableService,
          message: message || "",
          status: "pending",
        });
        console.log("✅ [MongoDB] Saved new booking reservation with ID:", savedBooking._id);
      }
    } catch (dbErr) {
      console.error("⚠️ [MongoDB Warning] Failed to save booking to database:", dbErr);
    }

    // 2. Build Luxury Email Template matching Colorpellet Design System
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request - The Color Pallete</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f1eb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e2617; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f1eb; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5dbcf; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(30, 38, 23, 0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #1e2617; padding: 36px 30px; text-align: center;">
              <span style="font-family: 'Georgia', serif; font-size: 26px; letter-spacing: 4px; text-transform: uppercase; color: #dfcca5; font-weight: 300; display: block;">
                THE COLOR PALLETE
              </span>
              <span style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #ffffff; opacity: 0.8; display: block; margin-top: 6px;">
                Advanced Aesthetic & Hair Studio
              </span>
            </td>
          </tr>

          <!-- Subheader Notification Bar -->
          <tr>
            <td align="center" style="background-color: #f2e9df; padding: 14px 20px; border-bottom: 1px solid #e5dbcf;">
              <span style="font-size: 12px; letter-spacing: 2px; font-weight: 600; text-transform: uppercase; color: #1e2617;">
                ✨ New Appointment Request Received
              </span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="font-size: 15px; line-height: 1.6; color: #1e2617; margin-top: 0; margin-bottom: 24px;">
                You have received a new booking reservation through <strong>The Color Pallete</strong> contact portal.
              </p>

              <!-- Reservation Details Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f6f2; border: 1px solid #ece4da; border-radius: 8px; margin-bottom: 28px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #c2a878; width: 35%;">
                    Client Name
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 15px; font-weight: 500; color: #1e2617;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #c2a878;">
                    Phone Number
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 15px; font-weight: 600; color: #1e2617;">
                    <a href="tel:${phone}" style="color: #1e2617; text-decoration: none; border-bottom: 1px border-dotted #1e2617;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #c2a878;">
                    Requested Date
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 15px; font-weight: 500; color: #1e2617;">
                    ${date}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #c2a878;">
                    Service Category
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #ece4da; font-size: 15px; font-weight: 600; color: #1e2617;">
                    <span style="background-color: #dfcca5; padding: 4px 10px; border-radius: 4px; font-size: 13px; letter-spacing: 0.5px;">${readableService}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #c2a878; vertical-align: top;">
                    Client Message
                  </td>
                  <td style="padding: 16px 20px; font-size: 14px; font-style: ${message ? "normal" : "italic"}; color: #4a5243; line-height: 1.6;">
                    ${message ? message.replace(/\n/g, "<br>") : "No additional notes provided."}
                  </td>
                </tr>
              </table>

              <!-- Action Callout Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e2617; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="padding: 20px 24px; text-align: center;">
                    <p style="font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: #dfcca5; margin: 0 0 12px 0; font-weight: 500;">
                      Quick Client Response
                    </p>
                    <a href="tel:${phone}" style="display: inline-block; background-color: #dfcca5; color: #1e2617; padding: 12px 28px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">
                      CALL CLIENT NOW (${phone})
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f9f6f2; padding: 28px 30px; border-top: 1px solid #ece4da; text-align: center;">
              <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #1e2617; margin: 0 0 6px 0;">
                The Color Pallete Aesthetic Studio
              </p>
              <p style="font-size: 12px; color: #6e7568; line-height: 1.6; margin: 0 0 12px 0;">
                Geo Centre, Chakkaraparambu, Vennala, Kochi, Kerala – 682032<br>
                P: +91 8547977486 | E: Info@thecolorpalette.in
              </p>
              <p style="font-size: 11px; color: #a0a69a; margin: 0;">
                © ${new Date().getFullYear()} The Color Pallete. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 3. Configure Nodemailer Transporter
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const receiver = process.env.CONTACT_RECEIVER_EMAIL || "Info@thecolorpalette.in";

    if (user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from: `"${name} via The Color Pallete" <${user}>`,
        to: receiver,
        replyTo: user,
        subject: `✨ New Booking Request: ${name} - ${readableService}`,
        html: htmlContent,
      });
    } else {
      console.log(
        "ℹ️ [SMTP Info] SMTP credentials not set in process.env (SMTP_USER/SMTP_PASS). Booking processed successfully."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your appointment request has been submitted successfully.",
      bookingId: savedBooking?._id || null,
    });
  } catch (error) {
    console.error("❌ Error sending email / saving booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process booking request. Please try again later.",
      },
      { status: 500 }
    );
  }
}

