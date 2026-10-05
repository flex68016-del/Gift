import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

import { db } from "@/lib/db/client";
import { verifyCookie } from "@/lib/security/cookie";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: giftId } = await params;

    // Vérifier le cookie de session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__Host-manage-session");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionGiftId = verifyCookie(sessionCookie.value);
    if (!sessionGiftId || sessionGiftId !== giftId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer le cadeau
    const giftResult = await db`
      SELECT
        g.id,
        g.slug,
        g.theme,
        g.recipient_name,
        g.sender_name,
        g.scheduled_at,
        g.status
      FROM gifts g
      WHERE g.id = ${giftId}
        AND g.deleted_at IS NULL
    `;

    if (giftResult.length === 0) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    const gift = giftResult[0];
    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    // Générer l'URL du cadeau
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://moment.gift";
    const giftUrl = `${baseUrl}/g/${gift.slug}`;

    // Générer le QR code
    const qrCodeDataUrl = await QRCode.toDataURL(giftUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Retourner l'image QR code en base64
    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      giftUrl,
      theme: gift.theme,
      recipientName: gift.recipient_name,
      senderName: gift.sender_name,
    });
  } catch (error) {
    console.error("Error generating gift card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
